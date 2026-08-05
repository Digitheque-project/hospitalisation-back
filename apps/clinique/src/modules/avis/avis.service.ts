import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, QueryFailedError, Repository } from "typeorm";
import {
  AvisEntity,
  DELAI_CIBLE_MINUTES,
  LIBELLE_URGENCE,
  StatutAvis,
  TRANSITIONS_AVIS,
  URGENCE_POIDS,
  UrgenceAvis,
} from "../../domain/entities/avis.entity";
import { CreateAvisDto, UpdateAvisDto, AvisQuery } from "./avis.dto";
import { buildAvisId } from "../../common/utils/ids";
import { ServiceChuApiService } from "../../infrastructure/http-clients/service-chu-api.service";
import { NotificationApiService } from "../../infrastructure/http-clients/notification-api.service";

/**
 * Cycle de vie d'une demande d'avis, aligne sur le standard international de la
 * demande de consultation (HL7 FHIR ServiceRequest + Task) :
 *
 *   requested   -> EN_ATTENTE       (la demande est emise au consultant)
 *   received    -> CONSULTEE        (accuse de reception par le consultant)
 *   accepted /
 *   in-progress -> PRISE_EN_CHARGE  (le consultant se saisit du dossier)
 *   completed   -> REPONDUE         (compte-rendu d'avis restitue au demandeur)
 *   closed      -> CLOTUREE         (le demandeur a lu et clot la boucle)
 *
 * Regles portees par le service :
 *  - transitions verrouillees (pas de retour arriere, pas de saut illegal) ;
 *  - compte-rendu obligatoire pour REPONDUE ;
 *  - horodatage de chaque etape + delai de reponse mesure ;
 *  - delai cible (echeance) derive du degre d'urgence ;
 *  - a CHAQUE etape, la partie concernee est notifiee : le consultant a
 *    l'emission, le DEMANDEUR a la reception, la prise en charge, la reponse et
 *    la reponse, le consultant a la lecture et a la cloture.
 */
@Injectable()
export class AvisService {
  constructor(
    @InjectRepository(AvisEntity)
    private readonly avisRepository: Repository<AvisEntity>,
    private readonly serviceChuApi: ServiceChuApiService,
    private readonly notificationApi: NotificationApiService,
  ) {}

  private readonly logger = new Logger(AvisService.name);

  async create(input: CreateAvisDto): Promise<AvisEntity> {
    // Le service destinataire n'est pas porte par le token : on le valide
    // via le service CHU externe (SERVICE_CHU_API_BASE_URL).
    // Validation best-effort : ne bloque pas la creation si le service CHU
    // externe est momentanement indisponible (500/503).
    try {
      await this.serviceChuApi.getServiceById(input.serviceIdDest);
    } catch (err) {
      this.logger.warn(
        `Avis: validation du service destinataire ignoree (${input.serviceIdDest}) : ${
          (err as Error)?.message ?? err
        }`,
      );
    }

    // Un service ne demande pas son propre avis : la boucle serait absurde et
    // le compteur "recus" du front compterait deux fois la meme ligne.
    if (input.serviceIdSource === input.serviceIdDest) {
      throw new BadRequestException(
        "Le service demandeur et le service consulte doivent etre differents.",
      );
    }

    if (!input.motif?.trim()) {
      throw new BadRequestException(
        "Le motif de la demande d'avis est obligatoire.",
      );
    }

    const urgence = input.urgence ?? UrgenceAvis.NORMAL;
    const createdAt = new Date();

    const entity = this.avisRepository.create({
      id: buildAvisId({ chuId: input.chuId, createdAt }),
      motif: input.motif.trim(),
      patientId: input.patientId,
      serviceIdSource: input.serviceIdSource,
      serviceIdDest: input.serviceIdDest,
      chuId: input.chuId,
      urgence,
      statut: StatutAvis.EN_ATTENTE,
      infoComplementaire: input.infoComplementaire ?? null,
      // Echeance de reponse attendue, derivee du degre d'urgence.
      dateEcheanceReponse: this.computeEcheance(urgence, createdAt),
      createdBy: input.createdBy,
    });

    let saved: AvisEntity;
    try {
      saved = await this.avisRepository.save(entity);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Avis: echec de l'enregistrement PostgreSQL : ${detail}`,
        err instanceof Error ? err.stack : undefined,
      );

      // Une valeur incompatible avec le schema (UUID, longueur, contrainte)
      // est une erreur de requete et ne doit pas devenir un 500 opaque.
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(
          `Impossible d'enregistrer l'avis : ${detail}`,
        );
      }
      throw err;
    }

    // Notifie le service destinataire (le consultant) qu'un avis est demande.
    await this.notifyDest(saved, {
      title: this.prefixeUrgence(saved.urgence, "Nouvelle demande d'avis"),
      message:
        `Avis ${this.libelleUrgence(saved.urgence)} demande pour le patient ${saved.patientId} ` +
        `par le service demandeur. Reponse attendue avant ${this.formatEcheance(saved.dateEcheanceReponse)}. ` +
        `Motif : ${saved.motif}`,
      type: "avis_created",
    });

    return saved;
  }

  async findById(id: string, chuId?: string): Promise<AvisEntity> {
    const where: FindOptionsWhere<AvisEntity> = chuId ? { id, chuId } : { id };
    const avis = await this.avisRepository.findOne({ where });
    if (!avis) {
      throw new NotFoundException("Avis introuvable");
    }
    return avis;
  }

  async findAll(query: AvisQuery): Promise<AvisEntity[]> {
    const where: FindOptionsWhere<AvisEntity> = {};
    if (query.chuId) {
      where.chuId = query.chuId;
    }
    if (query.serviceIdSource) {
      where.serviceIdSource = query.serviceIdSource;
    }
    if (query.serviceIdDest) {
      where.serviceIdDest = query.serviceIdDest;
    }
    if (query.patientId) {
      where.patientId = query.patientId;
    }

    // `statuts` (CSV) permet de charger une file de travail en un appel,
    // ex. statuts=EN_ATTENTE,CONSULTEE,PRISE_EN_CHARGE pour les avis a traiter.
    const statuts = this.parseStatuts(query.statuts);
    if (statuts.length > 1) {
      where.statut = In(statuts);
    } else if (statuts.length === 1) {
      where.statut = statuts[0];
    } else if (query.statut) {
      where.statut = query.statut;
    }

    const rows = await this.avisRepository.find({
      where,
      order: { createdAt: "DESC" },
    });

    // Tri clinique : le plus urgent d'abord, puis le plus ancien en attente
    // (regle de priorisation d'une file de consultations).
    return rows.sort((a: AvisEntity, b: AvisEntity) => {
      const poids = this.poids(a.urgence) - this.poids(b.urgence);
      if (poids !== 0) return poids;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Nombre d'avis recus non encore accuses par le service consulte (badge
   * "non lus"), equivalent des Task au statut `requested`.
   */
  async countNonLus(serviceIdDest: string, chuId?: string): Promise<number> {
    const where: FindOptionsWhere<AvisEntity> = {
      serviceIdDest,
      statut: StatutAvis.EN_ATTENTE,
    };
    if (chuId) {
      where.chuId = chuId;
    }
    return this.avisRepository.count({ where });
  }

  /**
   * Accuse de reception cote CONSULTANT : tous les avis EN_ATTENTE recus par le
   * service passent a CONSULTEE. Le demandeur est informe que sa demande a bien
   * ete recue (etape `received` du standard), meme si personne n'a encore
   * repondu : c'est ce qui evite les demandes qui "disparaissent".
   */
  async marquerConsultees(
    serviceIdDest: string,
    chuId?: string,
    updatedBy?: string,
  ): Promise<AvisEntity[]> {
    const where: FindOptionsWhere<AvisEntity> = {
      serviceIdDest,
      statut: StatutAvis.EN_ATTENTE,
    };
    if (chuId) {
      where.chuId = chuId;
    }

    const avisList = await this.avisRepository.find({ where });
    if (avisList.length === 0) {
      return [];
    }

    const now = new Date();
    for (const avis of avisList) {
      avis.statut = StatutAvis.CONSULTEE;
      avis.dateConsultation = now;
      if (updatedBy) {
        avis.updatedBy = updatedBy;
      }
    }

    const saved = await this.avisRepository.save(avisList);

    for (const avis of saved) {
      await this.notifySource(avis, {
        title: "Demande d'avis recue",
        message: `Le service consulte a pris connaissance de votre demande d'avis pour le patient ${avis.patientId}.`,
        type: "avis_received",
      });
    }

    return saved;
  }

  async update(
    id: string,
    input: UpdateAvisDto,
    chuId?: string,
  ): Promise<AvisEntity> {
    const avis = await this.findById(id, chuId);
    const ancienStatut = avis.statut;
    const nouveauStatut = input.statut;

    if (nouveauStatut !== undefined && nouveauStatut !== ancienStatut) {
      this.assertTransition(ancienStatut, nouveauStatut);
    }

    if (input.motif !== undefined) {
      if (!input.motif.trim()) {
        throw new BadRequestException("Le motif ne peut pas etre vide.");
      }
      avis.motif = input.motif.trim();
    }
    if (input.reponse !== undefined) {
      avis.reponse = input.reponse;
    }
    if (input.infoComplementaire !== undefined) {
      avis.infoComplementaire = input.infoComplementaire;
    }
    avis.updatedBy = input.updatedBy;

    if (nouveauStatut !== undefined) {
      // Un compte-rendu vide n'est pas une reponse : sans cette garde, le
      // demandeur recoit une notification "repondu" sans aucun contenu.
      if (
        nouveauStatut === StatutAvis.REPONDUE &&
        !avis.reponse?.toString().trim()
      ) {
        throw new BadRequestException(
          "Le compte-rendu d'avis est obligatoire pour repondre a une demande d'avis.",
        );
      }
      avis.statut = nouveauStatut;
      this.horodater(avis, nouveauStatut, input.updatedBy, {
        nom: input.repondeurNom,
        prenom: input.repondeurPrenom,
        fonction: input.repondeurFonction,
      });
    }

    const saved = await this.avisRepository.save(avis);

    // Notifications best-effort selon la transition de statut.
    // Contrairement a une demande d'hospitalisation, aucun episode n'est cree.
    if (nouveauStatut !== undefined && nouveauStatut !== ancienStatut) {
      await this.notifierTransition(saved, nouveauStatut);
    }

    return saved;
  }

  /**
   * Accuse de reception cote DEMANDEUR : le service source declare avoir lu le
   * compte-rendu. La boucle est ainsi refermee des deux cotes (le consultant
   * sait que son avis a ete lu), comme le `Task.status = completed` cote
   * demandeur du standard.
   */
  async accuserReceptionReponse(
    id: string,
    lecteurId: string,
    chuId?: string,
  ): Promise<AvisEntity> {
    const avis = await this.findById(id, chuId);

    if (
      avis.statut !== StatutAvis.REPONDUE &&
      avis.statut !== StatutAvis.CLOTUREE
    ) {
      throw new BadRequestException(
        "Aucun compte-rendu a accuser : la demande d'avis n'a pas encore recu de reponse.",
      );
    }

    // Idempotent : une deuxieme lecture ne renotifie pas le consultant.
    if (avis.dateLectureReponse) {
      return avis;
    }

    avis.dateLectureReponse = new Date();
    avis.reponseLuePar = lecteurId ?? null;
    const saved = await this.avisRepository.save(avis);

    await this.notifyDest(saved, {
      title: "Votre avis a ete lu",
      message: `Le service demandeur a pris connaissance de votre compte-rendu pour le patient ${saved.patientId}.`,
      type: "avis_reponse_lue",
    });

    return saved;
  }

  async delete(id: string, chuId?: string): Promise<void> {
    const avis = await this.findById(id, chuId);

    // Un avis deja repondu ou clos est une piece du dossier medical : il se
    // cloture, il ne s'efface pas.
    if (
      avis.statut === StatutAvis.REPONDUE ||
      avis.statut === StatutAvis.CLOTUREE
    ) {
      throw new BadRequestException(
        "Une demande d'avis deja repondue ne peut pas etre supprimee : elle fait partie du dossier du patient.",
      );
    }

    await this.avisRepository.remove(avis);
  }

  // ---------------------------------------------------------------------------
  // Cycle de vie
  // ---------------------------------------------------------------------------

  /** Refuse toute transition non prevue par le cycle de vie standard. */
  private assertTransition(depuis: StatutAvis, vers: StatutAvis): void {
    const autorisees = TRANSITIONS_AVIS[depuis] ?? [];
    if (!autorisees.includes(vers)) {
      throw new BadRequestException(
        `Transition invalide : un avis "${depuis}" ne peut pas passer a "${vers}".` +
          (autorisees.length
            ? ` Transitions possibles : ${autorisees.join(", ")}.`
            : " Ce statut est terminal."),
      );
    }
  }

  /**
   * Horodate l'etape atteinte, mesure le delai de reponse effectif et fige la
   * signature du consultant au moment de la reponse.
   */
  private horodater(
    avis: AvisEntity,
    statut: StatutAvis,
    acteurId?: string,
    identite?: { nom?: string; prenom?: string; fonction?: string },
  ): void {
    const now = new Date();

    // La signature n'est enregistree qu'aux etapes ou un praticien engage sa
    // responsabilite : REPONDUE. Elle n'est jamais ecrasee par une
    // valeur vide, pour qu'un amendement ulterieur ne fasse pas disparaitre
    // l'auteur du compte-rendu initial.
    const signer = () => {
      avis.repondeurId = acteurId ?? avis.repondeurId ?? null;
      const nom = identite?.nom?.trim();
      const prenom = identite?.prenom?.trim();
      const fonction = identite?.fonction?.trim();
      if (nom) avis.repondeurNom = nom;
      if (prenom) avis.repondeurPrenom = prenom;
      if (fonction) avis.repondeurFonction = fonction;
    };

    switch (statut) {
      case StatutAvis.CONSULTEE:
        avis.dateConsultation = avis.dateConsultation ?? now;
        break;
      case StatutAvis.PRISE_EN_CHARGE:
        // Une prise en charge vaut accuse de reception si l'etape a ete sautee.
        avis.dateConsultation = avis.dateConsultation ?? now;
        avis.datePriseEnCharge = avis.datePriseEnCharge ?? now;
        break;
      case StatutAvis.REPONDUE:
        avis.dateConsultation = avis.dateConsultation ?? now;
        avis.datePriseEnCharge = avis.datePriseEnCharge ?? now;
        avis.dateReponse = now;
        signer();
        avis.delaiReponseMinutes = this.minutesEntre(avis.createdAt, now);
        break;
      case StatutAvis.CLOTUREE:
        // Clore vaut lecture du compte-rendu par le demandeur.
        avis.dateLectureReponse = avis.dateLectureReponse ?? now;
        avis.reponseLuePar = avis.reponseLuePar ?? acteurId ?? null;
        avis.dateCloture = now;
        break;
      default:
        break;
    }
  }

  /** Envoie la notification correspondant a l'etape atteinte. */
  private async notifierTransition(
    avis: AvisEntity,
    statut: StatutAvis,
  ): Promise<void> {
    switch (statut) {
      case StatutAvis.CONSULTEE:
        await this.notifySource(avis, {
          title: "Demande d'avis recue",
          message: `Le service consulte a pris connaissance de votre demande d'avis pour le patient ${avis.patientId}.`,
          type: "avis_received",
        });
        break;

      case StatutAvis.PRISE_EN_CHARGE:
        await this.notifySource(avis, {
          title: "Avis pris en charge",
          message: `Votre demande d'avis pour le patient ${avis.patientId} est prise en charge par le service consulte.`,
          type: "avis_taken",
        });
        break;

      case StatutAvis.REPONDUE:
        // Le coeur de la boucle : le DEMANDEUR recoit le compte-rendu, avec un
        // extrait dans le message et le texte complet dans data.reponse.
        await this.notifySource(avis, {
          title: "Reponse a votre demande d'avis",
          message:
            `Compte-rendu d'avis recu pour le patient ${avis.patientId}` +
            `${avis.delaiReponseMinutes != null ? ` (en ${this.formatDelai(avis.delaiReponseMinutes)})` : ""} : ` +
            this.extrait(avis.reponse),
          type: "avis_answered",
        });
        break;

      case StatutAvis.CLOTUREE:
        // Le consultant doit savoir que son avis a ete lu et la boucle fermee.
        await this.notifyDest(avis, {
          title: "Demande d'avis cloturee",
          message: `Le service demandeur a cloture la demande d'avis du patient ${avis.patientId} apres lecture de votre compte-rendu.`,
          type: "avis_closed",
        });
        break;

      default:
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------

  /** Notifie le service SOURCE (le demandeur) d'une evolution de l'avis. */
  private async notifySource(
    avis: AvisEntity,
    n: { title: string; message: string; type: string },
  ): Promise<void> {
    await this.safeNotify({
      serviceId: avis.serviceIdSource,
      title: n.title,
      message: n.message,
      type: n.type,
      source: "hospitalisation-back",
      data: this.payload(avis),
    });
  }

  /** Notifie le service DESTINATAIRE (le consultant) d'une evolution de l'avis. */
  private async notifyDest(
    avis: AvisEntity,
    n: { title: string; message: string; type: string },
  ): Promise<void> {
    await this.safeNotify({
      serviceId: avis.serviceIdDest,
      title: n.title,
      message: n.message,
      type: n.type,
      source: "hospitalisation-back",
      data: this.payload(avis),
    });
  }

  /**
   * Charge utile commune : le front ouvre l'avis concerne directement depuis la
   * notification, sans second appel reseau.
   */
  private payload(avis: AvisEntity): Record<string, unknown> {
    return {
      avisId: avis.id,
      patientId: avis.patientId,
      chuId: avis.chuId,
      serviceIdSource: avis.serviceIdSource,
      serviceIdDest: avis.serviceIdDest,
      urgence: avis.urgence,
      statut: avis.statut,
      motif: avis.motif,
      reponse: avis.reponse ?? null,
      motifRefus: avis.motifRefus ?? null,
      dateEcheanceReponse: avis.dateEcheanceReponse ?? null,
      dateReponse: avis.dateReponse ?? null,
      delaiReponseMinutes: avis.delaiReponseMinutes ?? null,
    };
  }

  /** Notification best-effort : ne doit jamais faire echouer l'operation metier. */
  private async safeNotify(
    payload: Parameters<NotificationApiService["sendToService"]>[0],
  ): Promise<void> {
    try {
      await this.notificationApi.sendToService(payload);
    } catch (err) {
      this.logger.warn(
        `Avis: notification non envoyee : ${(err as Error)?.message ?? err}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Utilitaires
  // ---------------------------------------------------------------------------

  /** Echeance de reponse attendue selon le degre d'urgence. */
  private computeEcheance(urgence: UrgenceAvis, from: Date): Date {
    const minutes =
      DELAI_CIBLE_MINUTES[urgence] ?? DELAI_CIBLE_MINUTES[UrgenceAvis.NORMAL];
    return new Date(from.getTime() + minutes * 60_000);
  }

  /** Poids de tri de l'urgence, tolerant a une valeur inattendue en base. */
  private poids(urgence: UrgenceAvis): number {
    return URGENCE_POIDS[urgence] ?? 9;
  }

  private minutesEntre(debut?: Date | null, fin?: Date | null): number | null {
    if (!debut || !fin) return null;
    const ms = fin.getTime() - new Date(debut).getTime();
    if (!Number.isFinite(ms) || ms < 0) return null;
    return Math.round(ms / 60_000);
  }

  private formatDelai(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  private formatEcheance(date?: Date | null): string {
    if (!date) return "la date prevue";
    return new Date(date).toISOString().slice(0, 16).replace("T", " ");
  }

  /** Libelle lisible, tolerant a une valeur inattendue en base. */
  private libelleUrgence(urgence: UrgenceAvis): string {
    return LIBELLE_URGENCE[urgence] ?? 'normal';
  }

  private prefixeUrgence(urgence: UrgenceAvis, titre: string): string {
    if (urgence === UrgenceAvis.TRES_URGENT) return `[TRES URGENT] ${titre}`;
    if (urgence === UrgenceAvis.URGENT) return `[URGENT] ${titre}`;
    return titre;
  }

  private extrait(texte?: string | null, max = 180): string {
    const clean = (texte ?? "").toString().replace(/\s+/g, " ").trim();
    if (!clean) return "voir le compte-rendu dans le dossier du patient.";
    return clean.length > max ? `${clean.slice(0, max - 1)}\u2026` : clean;
  }

  private parseStatuts(csv?: string): StatutAvis[] {
    if (!csv) return [];
    const valides = new Set(Object.values(StatutAvis) as string[]);
    return csv
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => valides.has(s)) as StatutAvis[];
  }
}
