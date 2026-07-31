import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  HospitalisationEpisodeEntity,
  ModeSortie,
  StatutHospitalisation,
  StatutPaiementSortie,
} from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity, StatutLit } from '../../domain/entities/lit.entity';
import {
  CloseHospitalisationEpisodeDto,
  CreateHospitalisationEpisodeDto,
  HospitalisationEpisodeQuery,
  UpdateHospitalisationStatusDto,
  AttributeLitDto,
  UpdateExeatableDto,
} from './hospitalisation.dto';
import {
  RapportData,
  Demographie,
  PeriodeStat,
  RAPPORT_AGE_BUCKETS,
  RAPPORT_MONTH_LABELS,
} from './rapport.types';
import { AccueilPatientApiService } from '../../infrastructure/http-clients/accueil-patient-api.service';
import { DossierPatientApiService } from '../../infrastructure/http-clients/dossier-patient-api.service';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';
import { buildEpisodeId } from '../../common/utils/ids';
import { NotificationApiService } from '../../infrastructure/http-clients/notification-api.service';
import { DemandeEntity, StatutDemande } from '../../domain/entities/demande.entity';
​
@Injectable()
export class HospitalisationService {
  constructor(
    @InjectRepository(HospitalisationEpisodeEntity)
    private readonly hospitalisationRepository: Repository<HospitalisationEpisodeEntity>,
    @InjectRepository(LitEntity)
    private readonly litRepository: Repository<LitEntity>,
    // Injection du repository (et non de DemandeService) pour eviter une
    // dependance circulaire : DemandeModule importe deja HospitalisationModule.
    @InjectRepository(DemandeEntity)
    private readonly demandeRepository: Repository<DemandeEntity>,
    private readonly accueilPatientApi: AccueilPatientApiService,
    private readonly dossierPatientApi: DossierPatientApiService,
    private readonly kafkaService: KafkaService,
    private readonly notificationApi: NotificationApiService,
  ) {}

  private readonly logger = new Logger(HospitalisationService.name);
​
  async createEpisode(
    input: CreateHospitalisationEpisodeDto,
    chuId: string,
    options: { notifyServiceConcerne?: boolean } = {},
  ): Promise<HospitalisationEpisodeEntity> {
    await this.accueilPatientApi.ensurePatientExistsAtAccueil(input.patientId);
​
​
    const admissionDate = input.dateAdmission ? new Date(input.dateAdmission) : new Date();
​
    let lit: LitEntity | null = null;
    if (input.litId) {
      lit = await this.findAvailableLit(input.litId, input.serviceIdDest, chuId);
      lit.statut = StatutLit.OCCUPE;
      await this.litRepository.save(lit);
    }
​
    const entity = this.hospitalisationRepository.create({
      id: buildEpisodeId({
        chuId,
        dateAdmission: admissionDate,
      }),
      patientId: input.patientId,
      chuId,
      serviceIdDest: input.serviceIdDest,
      serviceIdSource: input.serviceIdSource ?? null,
      // Chainage du parcours : renseigne quand l'episode nait d'un transfert interne.
      episodePrecedentId: input.episodePrecedentId ?? null,
      dateAdmission: admissionDate,
      motifAdmission: input.motifAdmission ?? null,
      createdBy: input.createdBy,
      litId: lit?.id ?? null,
      litCode: lit?.codeLit ?? null,
      statut: StatutHospitalisation.ADMIS,
      fraisRegles: false,
      statutPaiementSortie: StatutPaiementSortie.NON_VERIFIE,
      sortieMedicaleValidee: false,
      sortieAdministrativeValidee: false,
    });
​
    const saved = await this.hospitalisationRepository.save(entity);
​
    await this.kafkaService.emit('hospitalisation.episode.created', {
      id: saved.id,
      patientId: saved.patientId,
      chuId: saved.chuId,
      serviceId: saved.serviceIdDest,
      dateAdmission: saved.dateAdmission.toISOString(),
      statut: saved.statut,
      createdBy: saved.createdBy,
      serviceIdSource: saved.serviceIdSource ?? null,
      litId: saved.litId ?? null,
      litCode: saved.litCode ?? null,
    });
​
    // Notification patient en attente de lit au service concerne (destination).
    // Declenchee par le POST /clinique/hospitalisations (consultation externe).
    // Le flux d'acceptation d'une demande passe notifyServiceConcerne=false car
    // il envoie deja ses propres notifications (demande_accepted).
    const shouldNotify = options.notifyServiceConcerne ?? true;
    if (shouldNotify) {
      const serviceConcerne = saved.serviceIdDest;
      await this.notificationApi.sendToService({
        serviceId: serviceConcerne,
        title: 'Nouveau patient en attente de lit',
        message: `Le patient ${saved.patientId} a ete oriente vers votre service et est en attente d'attribution de lit.`,
        type: 'hospitalisation_en_attente_lit',
        source: 'hospitalisation-back',
        data: {
          episodeId: saved.id,
          patientId: saved.patientId,
          chuId: saved.chuId,
          serviceIdDest: serviceConcerne,
          serviceIdSource: saved.serviceIdSource ?? null,
          statut: saved.statut,
          litId: saved.litId ?? null,
          litCode: saved.litCode ?? null,
          enAttenteLit: !saved.litId,
          createdAt: saved.createdAt ? saved.createdAt.toISOString() : new Date().toISOString(),
        },
      });
    }
​
    return saved;
  }
​
  async updateStatus(
    id: string,
    input: UpdateHospitalisationStatusDto,
  ): Promise<HospitalisationEpisodeEntity> {
    const episode = await this.findEpisodeById(id, input.chuId);
    if (this.isClosedStatus(episode.statut)) {
      throw new BadRequestException('Episode deja cloture');
    }
    if (this.isClosedStatus(input.statut)) {
      throw new BadRequestException('Utiliser /hospitalisations/:id/close pour cloturer un episode');
    }
​
    episode.statut = input.statut;
    episode.updatedBy = input.updatedBy;
​
    const saved = await this.hospitalisationRepository.save(episode);
​
    await this.kafkaService.emit('hospitalisation.episode.status.updated', {
      id: saved.id,
      chuId: saved.chuId,
      statut: saved.statut,
      updatedBy: saved.updatedBy ?? null,
      dateSortie: saved.dateSortie ? saved.dateSortie.toISOString() : null,
    });
​
    return saved;
  }
​
  async closeEpisode(
    id: string,
    input: CloseHospitalisationEpisodeDto,
  ): Promise<HospitalisationEpisodeEntity> {
    const episode = await this.findEpisodeById(id, input.chuId);
    if (this.isClosedStatus(episode.statut)) {
      throw new BadRequestException('Episode deja cloture');
    }
​
    const finalStatus = input.statutFinal ?? this.resolveFinalStatus(input.modeSortie);
    if (!this.isClosedStatus(finalStatus)) {
      throw new BadRequestException('Le statut final doit etre un statut de cloture');
    }
​
    const effectiveExitDate = input.dateSortie ? new Date(input.dateSortie) : new Date();
    if (Number.isNaN(effectiveExitDate.getTime())) {
      throw new BadRequestException('Date de sortie invalide');
    }
    if (effectiveExitDate.getTime() < episode.dateAdmission.getTime()) {
      throw new BadRequestException('La date de sortie ne peut pas etre avant la date d admission');
    }
​
    this.validateCloseInput(input, finalStatus);
    const paymentState = this.resolvePaymentState(input, input.updatedBy, effectiveExitDate);
​
    episode.statut = finalStatus;
    episode.modeSortie = input.modeSortie;
    episode.updatedBy = input.updatedBy;
    episode.validatedBy = input.updatedBy;
    episode.validatedAt = effectiveExitDate;
    episode.commentaireSortie = input.commentaireSortie ?? null;
    episode.dateSortie = effectiveExitDate;
    episode.etatSortie = input.etatSortie ?? null;
    episode.motifSortie = input.motifSortie ?? null;
    episode.resumeSortie = input.resumeSortie ?? null;
    episode.diagnosticFinal = input.diagnosticFinal ?? null;
    episode.traitementSortie = input.traitementSortie ?? null;
    episode.conduiteATenir = input.conduiteATenir ?? null;
    episode.rendezVousControle = input.rendezVousControle ?? null;
    episode.destinationServiceId = input.destinationServiceId ?? null;
    episode.destinationEtablissement = input.destinationEtablissement ?? null;
    episode.moyenTransport = input.moyenTransport ?? null;
    episode.dateDeces = input.dateDeces ? new Date(input.dateDeces) : null;
    episode.causeDeces = input.causeDeces ?? null;
    episode.certificatDecesNumero = input.certificatDecesNumero ?? null;
    episode.motifContreAvis = input.motifContreAvis ?? null;
    episode.risquesExpliques = input.risquesExpliques ?? null;
    episode.signaturePatient = input.signaturePatient ?? null;
    episode.fraisRegles = paymentState.fraisRegles;
    episode.statutPaiementSortie = paymentState.statutPaiementSortie;
    episode.referencePaiement = input.referencePaiement ?? null;
    episode.commentairePaiement = input.commentairePaiement ?? null;
    episode.fraisReglesPar = paymentState.fraisReglesPar;
    episode.fraisReglesAt = paymentState.fraisReglesAt;
    episode.sortieMedicaleValidee = true;
    episode.sortieAdministrativeValidee = paymentState.sortieAdministrativeValidee;
​
    await this.releaseLitIfNeeded(episode.litId);
​
    const saved = await this.hospitalisationRepository.save(episode);
​
    await this.kafkaService.emit('hospitalisation.episode.closed', {
      id: saved.id,
      patientId: saved.patientId,
      chuId: saved.chuId,
      serviceId: saved.serviceIdDest,
      statut: saved.statut,
      modeSortie: saved.modeSortie,
      updatedBy: saved.updatedBy ?? null,
      validatedBy: saved.validatedBy ?? null,
      dateSortie: saved.dateSortie ? saved.dateSortie.toISOString() : null,
      commentaireSortie: saved.commentaireSortie ?? null,
      fraisRegles: saved.fraisRegles,
      statutPaiementSortie: saved.statutPaiementSortie,
      sortieAdministrativeValidee: saved.sortieAdministrativeValidee,
    });
​
    await this.dossierPatientApi.archivePatientDiagnostics({
      chuId: saved.chuId,
      serviceId: saved.serviceIdDest,
      patientId: saved.patientId,
      episodeId: saved.id,
    });

    // Transfert interne : le service destinataire doit RECEVOIR le patient.
    // Best-effort : la cloture est deja persistee, une panne notification/demande
    // ne doit jamais faire echouer la sortie.
    await this.notifierTransfertInterne(saved);
​
    return saved;
  }
​
  async findEpisodeById(id: string, chuId?: string): Promise<HospitalisationEpisodeEntity> {
    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = chuId
      ? { id, chuId }
      : { id };
    const episode = await this.hospitalisationRepository.findOne({ where });
    if (!episode) {
      throw new NotFoundException('Episode introuvable');
    }
    const patientInfo = await this.accueilPatientApi.getPatientById(episode.patientId);
    if (patientInfo) {
      episode.patient = patientInfo;
    }
    return episode;
  }
​
  async listEpisodes(query: HospitalisationEpisodeQuery): Promise<HospitalisationEpisodeEntity[]> {
​
    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = {};
    where.serviceIdDest = query.serviceIdDest;
    where.chuId = query.chuId;
    if (query.patientId) {
      where.patientId = query.patientId;
    }
    if (query.statut) {
      where.statut = query.statut;
    }
​
    const episodes = await this.hospitalisationRepository.find({
      where,
      order: { dateAdmission: 'DESC' },
    });
​
    await Promise.all(
      episodes.map(async (episode) => {
        const patientInfo = await this.accueilPatientApi.getPatientById(episode.patientId);
        if (patientInfo) {
          episode.patient = patientInfo;
        }
      }),
    );
​
    return episodes;
  }
​
  /**
   * Archive du service : liste paginee des episodes CLOTURES (SORTIE,
   * TRANSFERE, DECEDE, EVADE), enrichis des informations patient. Le back
   * applique les filtres statut/mode/date + la pagination ; la recherche
   * plein-texte (nom, motif, diagnostic, lit) est appliquee en memoire car le
   * nom du patient provient du service accueil et non de la base locale.
   */
  async getArchives(options: {
    chuId: string;
    serviceIdDest: string;
    search?: string;
    diagnostic?: string;
    sexe?: string;
    statut?: string;
    modeSortie?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    items: HospitalisationEpisodeEntity[];
    total: number;
    limit: number;
    offset: number;
    stats: {
      total: number;
      sorties: number;
      transferts: number;
      deces: number;
      evasions: number;
    };
  }> {
    // Le statut est valide ici mais n'est PAS applique a la requete de base :
    // les KPI doivent conserver les totaux de chaque categorie lorsque
    // l'utilisateur clique une carte (filtrage facette).
    let requestedStatus: StatutHospitalisation | undefined;
    if (options.statut) {
      requestedStatus = options.statut as StatutHospitalisation;
      if (!this.isClosedStatus(requestedStatus)) {
        throw new BadRequestException(
          'Le filtre statut doit correspondre a un statut de cloture',
        );
      }
    }

    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = {
      chuId: options.chuId,
      serviceIdDest: options.serviceIdDest,
      statut: In(this.closedStatuses()),
    };

    if (options.modeSortie) {
      if (
        !Object.values(ModeSortie).includes(options.modeSortie as ModeSortie)
      ) {
        throw new BadRequestException('Mode de sortie invalide');
      }
      where.modeSortie = options.modeSortie as ModeSortie;
    }

    const fromDate = this.parseBoundaryDate(options.from, 'start');
    const toDate = this.parseBoundaryDate(options.to, 'end');
    if (fromDate && toDate) {
      where.dateSortie = Between(fromDate, toDate);
    } else if (fromDate) {
      where.dateSortie = MoreThanOrEqual(fromDate);
    } else if (toDate) {
      where.dateSortie = LessThanOrEqual(toDate);
    }

    let episodes = await this.hospitalisationRepository.find({
      where,
      order: { dateSortie: 'DESC', dateAdmission: 'DESC' },
    });

    // Normalisation sans accents pour une recherche clinique tolerante.
    const normalizeText = (value: unknown): string =>
      typeof value === 'string'
        ? value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
        : '';

    const normalizeSexe = (value: unknown): 'F' | 'M' | 'INCONNU' => {
      const sexe = normalizeText(value).toUpperCase();
      if (sexe.startsWith('F')) return 'F';
      if (sexe.startsWith('M') || sexe.startsWith('H')) return 'M';
      return 'INCONNU';
    };

    const requestedSexe = options.sexe?.trim().toUpperCase();
    if (
      requestedSexe &&
      !['F', 'M', 'INCONNU'].includes(requestedSexe)
    ) {
      throw new BadRequestException('Filtre sexe invalide');
    }

    const search = normalizeText(options.search);
    const diagnostic = normalizeText(options.diagnostic);

    // Le diagnostic est local a l'episode : on le filtre avant tout appel au
    // service Patient afin de reduire au maximum la cohorte a enrichir.
    if (diagnostic) {
      episodes = episodes.filter((episode) =>
        normalizeText(episode.diagnosticFinal).includes(diagnostic),
      );
    }

    const enrichPatients = async (
      cohort: HospitalisationEpisodeEntity[],
    ): Promise<void> => {
      await Promise.all(
        cohort.map(async (episode) => {
          const patientInfo = await this.accueilPatientApi.getPatientById(
            episode.patientId,
          );
          if (patientInfo) episode.patient = patientInfo;
        }),
      );
    };

    // Nom et sexe proviennent du service Patient : uniquement ces deux filtres
    // necessitent l'enrichissement de toute la cohorte. Dans le cas courant,
    // seuls les éléments de la page demandée seront enrichis plus bas.
    const requiresFullPatientEnrichment = Boolean(search || requestedSexe);
    if (requiresFullPatientEnrichment) {
      await enrichPatients(episodes);
    }

    // Tous les criteres cliniques hors statut sont appliques avant les KPI.
    // Les KPI refletent la cohorte recherchee mais restent stables lorsqu'une
    // carte de statut est selectionnee.
    episodes = episodes.filter((episode) => {
      const patient = (episode.patient ?? {}) as Record<string, unknown>;

      if (
        requestedSexe &&
        normalizeSexe(patient.sexe) !== requestedSexe
      ) {
        return false;
      }

      if (search) {
        const haystack = [
          patient.nom,
          patient.prenom,
          episode.patientId,
          episode.motifAdmission,
          episode.diagnosticFinal,
          episode.litCode,
        ]
          .map(normalizeText)
          .filter(Boolean)
          .join(' ');
        if (!haystack.includes(search)) return false;
      }

      return true;
    });

    // Statistiques facettees : elles sont calculees AVANT le filtre statut.
    const stats = {
      total: episodes.length,
      sorties: episodes.filter(
        (episode) => episode.statut === StatutHospitalisation.SORTIE,
      ).length,
      transferts: episodes.filter(
        (episode) => episode.statut === StatutHospitalisation.TRANSFERE,
      ).length,
      deces: episodes.filter(
        (episode) => episode.statut === StatutHospitalisation.DECEDE,
      ).length,
      evasions: episodes.filter(
        (episode) => episode.statut === StatutHospitalisation.EVADE,
      ).length,
    };

    if (requestedStatus) {
      episodes = episodes.filter(
        (episode) => episode.statut === requestedStatus,
      );
    }

    const total = episodes.length;
    // Pagination défensive : le frontend propose 5, 10, 20, 50 ou 100 et le backend
    // interdit toute réponse supérieure à 100 dossiers par requête.
    const requestedLimit =
      options.limit && Number.isFinite(options.limit) ? options.limit : 10;
    const limit = Math.min(100, Math.max(1, Math.trunc(requestedLimit)));
    const offset =
      options.offset && Number.isFinite(options.offset)
        ? Math.max(0, Math.trunc(options.offset))
        : 0;
    const items = episodes.slice(offset, offset + limit);

    if (!requiresFullPatientEnrichment) {
      await enrichPatients(items);
    }

    return { items, total, limit, offset, stats };
  }

  /**
   * Rapport d'activite du service : agrege les episodes CLOTURES sur une
   * periode (indicateurs cles, repartition par mode de cloture, demographie
   * patients et evolution mensuelle). Reutilise le meme perimetre que
   * l'archive (statuts de cloture + borne sur la date de sortie).
   */
  async getRapport(options: {
    chuId: string;
    serviceIdDest: string;
    from?: string;
    to?: string;
  }): Promise<RapportData> {
    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = {
      chuId: options.chuId,
      serviceIdDest: options.serviceIdDest,
      statut: In(this.closedStatuses()),
    };

    const fromDate = this.parseBoundaryDate(options.from, 'start');
    const toDate = this.parseBoundaryDate(options.to, 'end');
    if (fromDate && toDate) {
      where.dateSortie = Between(fromDate, toDate);
    } else if (fromDate) {
      where.dateSortie = MoreThanOrEqual(fromDate);
    } else if (toDate) {
      where.dateSortie = LessThanOrEqual(toDate);
    }

    const episodes = await this.hospitalisationRepository.find({
      where,
      order: { dateSortie: 'DESC', dateAdmission: 'DESC' },
    });

    await Promise.all(
      episodes.map(async (episode) => {
        const patientInfo = await this.accueilPatientApi.getPatientById(
          episode.patientId,
        );
        if (patientInfo) {
          episode.patient = patientInfo;
        }
      }),
    );

    const countBy = (statut: StatutHospitalisation) =>
      episodes.filter((e) => e.statut === statut).length;

    const total = episodes.length;
    const sorties = countBy(StatutHospitalisation.SORTIE);
    const transferts = countBy(StatutHospitalisation.TRANSFERE);
    const deces = countBy(StatutHospitalisation.DECEDE);
    const evasions = countBy(StatutHospitalisation.EVADE);

    const durations = episodes
      .map((e) => this.stayDays(e))
      .filter((d): d is number => d !== null);
    const dureeMoyenne =
      durations.length > 0
        ? Math.round(
            (durations.reduce((sum, d) => sum + d, 0) / durations.length) *
              10,
          ) / 10
        : 0;

    const tauxSortie =
      total > 0 ? Math.round((sorties / total) * 1000) / 10 : 0;

    return {
      date_from: options.from ?? null,
      date_to: options.to ?? null,
      kpis: {
        total_archives: total,
        sorties,
        transferts,
        deces,
        evasions,
        taux_sortie: tauxSortie,
        duree_moyenne_sejour: dureeMoyenne,
      },
      modes_sortie: [
        { code: StatutHospitalisation.SORTIE, nom: 'Sorties', nombre: sorties },
        {
          code: StatutHospitalisation.TRANSFERE,
          nom: 'Transferts',
          nombre: transferts,
        },
        { code: StatutHospitalisation.DECEDE, nom: 'Deces', nombre: deces },
        { code: StatutHospitalisation.EVADE, nom: 'Evasions', nombre: evasions },
      ],
      demographie: this.buildDemographie(episodes),
      periodes: this.buildPeriodes(episodes),
    };
  }

  async getStats(chuId: string, serviceIdDest?: string): Promise<{
    hospitalizedTotal: number;
    hospitalizedNewToday: number;
  }> {
    const activeStatuts = this.activeStatuses();
​
    const [total, newToday] = await Promise.all([
      this.hospitalisationRepository.count({
        where: { chuId, statut: In(activeStatuts), ...(serviceIdDest ? { serviceIdDest } : {}) },
      }),
      (() => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return this.hospitalisationRepository
          .createQueryBuilder('ep')
          .where('ep."chuId" = :chuId', { chuId })
          .andWhere('ep.statut IN (:...statuts)', { statuts: activeStatuts })
          .andWhere('ep."dateAdmission" >= :startOfDay', { startOfDay })
          .andWhere(
            serviceIdDest ? 'ep."serviceIdDest" = :serviceIdDest' : '1=1',
            serviceIdDest ? { serviceIdDest } : {},
          )
          .getCount();
      })(),
    ]);
​
    return { hospitalizedTotal: total, hospitalizedNewToday: newToday };
  }
​
  async getActives(
    chuId: string,
    serviceIdDest?: string,
    limit = 50,
  ): Promise<HospitalisationEpisodeEntity[]> {
    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = {
      chuId,
      statut: In(this.activeStatuses()),
    };
    if (serviceIdDest) {
      where.serviceIdDest = serviceIdDest;
    }
​
    const episodes = await this.hospitalisationRepository.find({
      where,
      order: { dateAdmission: 'DESC' },
      take: limit,
    });
​
    await Promise.all(
      episodes.map(async (episode) => {
        const patientInfo = await this.accueilPatientApi.getPatientById(episode.patientId);
        if (patientInfo) {
          episode.patient = patientInfo;
        }
      }),
    );
​
    return episodes;
  }
​
  /**
   * Episode actif (ADMIS/EN_COURS) d'un patient dans un service.
   * Utilise par l'attribution de lit et par l'acceptation d'une demande
   * (idempotence : ne pas creer un second episode si un actif existe deja).
   */
  async findActiveEpisode(
    patientId: string,
    serviceIdDest: string,
    chuId: string,
  ): Promise<HospitalisationEpisodeEntity | null> {
    return this.hospitalisationRepository.findOne({
      where: {
        patientId,
        serviceIdDest,
        chuId,
        statut: In(this.activeStatuses()),
      },
      order: { dateAdmission: 'DESC' },
    });
  }
​
  async assignLit(input: AttributeLitDto): Promise<HospitalisationEpisodeEntity> {
    const episode = await this.findActiveEpisode(
      input.patientId,
      input.serviceIdDest,
      input.chuId,
    );
​
    if (!episode) {
      throw new NotFoundException(
        'Aucun episode actif trouvé pour ce patient dans ce service',
      );
    }
​
    if (episode.litId) {
      await this.releaseLitIfNeeded(episode.litId);
    }
​
    const lit = await this.findAvailableLit(input.litId, input.serviceIdDest, input.chuId);
    lit.statut = StatutLit.OCCUPE;
    await this.litRepository.save(lit);
​
    episode.litId = lit.id;
    episode.litCode = lit.codeLit;
    episode.updatedBy = input.updatedBy;
​
    const saved = await this.hospitalisationRepository.save(episode);
​
    await this.kafkaService.emit('hospitalisation.lit.assigned', {
      id: saved.id,
      patientId: saved.patientId,
      chuId: saved.chuId,
      serviceId: saved.serviceIdDest,
      litId: saved.litId,
      litCode: saved.litCode,
      updatedBy: saved.updatedBy,
    });
​
    return saved;
  }
​
  async setExeatable(
    id: string,
    input: UpdateExeatableDto,
  ): Promise<HospitalisationEpisodeEntity> {
    const episode = await this.findEpisodeById(id, input.chuId);
    episode.exeatable = input.exeatable;
    return this.hospitalisationRepository.save(episode);
  }
​
  private async findAvailableLit(
    litId: string,
    serviceId: string,
    chuId: string,
  ): Promise<LitEntity> {
    const lit = await this.litRepository.findOne({
      where: { id: litId },
      relations: ['chambre'],
    });
    if (!lit) {
      throw new NotFoundException('Lit introuvable');
    }
    if (!lit.chambre) {
      throw new BadRequestException('Le lit doit etre rattache a une chambre');
    }
    if (lit.chambre.chuId !== chuId || lit.chuId !== chuId) {
      throw new BadRequestException('Le lit ne correspond pas au CHU cible');
    }
    if (lit.chambre.serviceId !== serviceId) {
      throw new BadRequestException('Le lit ne correspond pas au service de l episode');
    }
    if (lit.statut !== StatutLit.DISPONIBLE) {
      throw new BadRequestException('Le lit demande est indisponible');
    }
    return lit;
  }
​
  private async releaseLitIfNeeded(litId?: string | null): Promise<void> {
    if (!litId) {
      return;
    }
    const lit = await this.litRepository.findOne({ where: { id: litId } });
    if (!lit) {
      return;
    }
    lit.statut = StatutLit.A_NETTOYER;
    await this.litRepository.save(lit);
  }
​
  private validateCloseInput(input: CloseHospitalisationEpisodeDto, finalStatus: StatutHospitalisation): void {
    if (input.modeSortie === ModeSortie.DECES && !input.causeDeces) {
      throw new BadRequestException('La cause du deces est obligatoire');
    }
    if (input.modeSortie === ModeSortie.DECES && finalStatus !== StatutHospitalisation.DECEDE) {
      throw new BadRequestException('Le mode DECES doit cloturer avec le statut DECEDE');
    }
    if (input.modeSortie === ModeSortie.EVASION && finalStatus !== StatutHospitalisation.EVADE) {
      throw new BadRequestException('Le mode EVASION doit cloturer avec le statut EVADE');
    }
    if (input.modeSortie === ModeSortie.TRANSFERT_INTERNE && !input.destinationServiceId) {
      throw new BadRequestException('Le service de destination est obligatoire pour un transfert interne');
    }
    if (
      [ModeSortie.TRANSFERT_EXTERNE, ModeSortie.EVACUATION_SANITAIRE].includes(input.modeSortie) &&
      !input.destinationEtablissement
    ) {
      throw new BadRequestException('La destination est obligatoire pour un transfert externe ou une evacuation sanitaire');
    }
    if (input.modeSortie === ModeSortie.SORTIE_CONTRE_AVIS) {
      if (!input.motifContreAvis) {
        throw new BadRequestException('Le motif est obligatoire pour une sortie contre avis medical');
      }
      if (!input.risquesExpliques) {
        throw new BadRequestException('Les risques expliques sont obligatoires pour une sortie contre avis medical');
      }
    }
  }
​
  /**
   * TRANSFERT INTERNE : cote reception.
   *
   * A la cloture d'un episode en TRANSFERT_INTERNE, le patient doit apparaitre
   * dans le service destinataire. On realise donc deux choses :
   *  1. creation d'une demande d'hospitalisation PRE-REMPLIE (EN_ATTENTE) vers
   *     le service de destination, chainee a l'episode source
   *     (episodeSourceId) : a l'acceptation, l'episode d'arrivee heritera de
   *     episodePrecedentId, ce qui reconstitue le parcours du patient ;
   *  2. notification temps reel au service destinataire (type
   *     'transfert_entrant').
   *
   * Idempotent : une demande deja creee pour cet episode source est reutilisee.
   * Best-effort : aucune exception ne remonte (la cloture est deja persistee).
   */
  private async notifierTransfertInterne(
    episode: HospitalisationEpisodeEntity,
  ): Promise<DemandeEntity | null> {
    if (
      episode.modeSortie !== ModeSortie.TRANSFERT_INTERNE ||
      !episode.destinationServiceId
    ) {
      return null;
    }

    let demande: DemandeEntity | null = null;
    try {
      demande = await this.demandeRepository.findOne({
        where: { episodeSourceId: episode.id },
      });
      if (!demande) {
        demande = await this.demandeRepository.save(
          this.demandeRepository.create({
            // Id deterministe : rejouer la cloture ne cree pas de doublon.
            id: `transfert-${episode.id}`.slice(0, 120),
            motif:
              episode.motifSortie ??
              episode.diagnosticFinal ??
              'Transfert interne',
            patientId: episode.patientId,
            // La source de la demande est le service qui transfere.
            serviceIdSource: episode.serviceIdDest,
            serviceIdDest: episode.destinationServiceId,
            chuId: episode.chuId,
            statut: StatutDemande.EN_ATTENTE,
            infoComplementaire: this.buildResumeTransfert(episode),
            episodeSourceId: episode.id,
            createdBy: episode.updatedBy ?? episode.createdBy,
          }),
        );
      }
    } catch (error) {
      this.logger.error(
        `Transfert interne ${episode.id} : demande d'admission non creee : ${String(error)}`,
      );
    }

    try {
      await this.notificationApi.sendToService({
        serviceId: episode.destinationServiceId,
        title: 'Transfert entrant',
        message: `Le patient ${episode.patientId} vous est transfere par un autre service. Une demande d'admission pre-remplie est en attente.`,
        type: 'transfert_entrant',
        source: 'hospitalisation-back',
        data: {
          demandeId: demande?.id ?? null,
          episodeSourceId: episode.id,
          patientId: episode.patientId,
          chuId: episode.chuId,
          serviceIdSource: episode.serviceIdDest,
          serviceIdDest: episode.destinationServiceId,
          modeSortie: episode.modeSortie,
          motifSortie: episode.motifSortie ?? null,
          diagnosticFinal: episode.diagnosticFinal ?? null,
          moyenTransport: episode.moyenTransport ?? null,
          dateSortie: episode.dateSortie ? episode.dateSortie.toISOString() : null,
        },
      });
    } catch (error) {
      this.logger.warn(
        `Transfert interne ${episode.id} : notification non envoyee : ${String(error)}`,
      );
    }

    try {
      await this.kafkaService.emit('hospitalisation.transfert.interne', {
        episodeSourceId: episode.id,
        demandeId: demande?.id ?? null,
        patientId: episode.patientId,
        chuId: episode.chuId,
        serviceIdSource: episode.serviceIdDest,
        serviceIdDest: episode.destinationServiceId,
        dateSortie: episode.dateSortie ? episode.dateSortie.toISOString() : null,
      });
    } catch (error) {
      this.logger.warn(
        `Transfert interne ${episode.id} : evenement Kafka non emis : ${String(error)}`,
      );
    }

    return demande;
  }

  /** Resume transmis au service d'accueil pour eviter toute ressaisie. */
  private buildResumeTransfert(episode: HospitalisationEpisodeEntity): string {
    const lignes: string[] = [];
    const ajouter = (libelle: string, valeur?: string | null) => {
      if (valeur && valeur.trim()) {
        lignes.push(`${libelle} : ${valeur.trim()}`);
      }
    };
    lignes.push(`Transfert interne (episode source ${episode.id})`);
    ajouter('Motif du transfert', episode.motifSortie);
    ajouter('Diagnostic final', episode.diagnosticFinal);
    ajouter('Resume d hospitalisation', episode.resumeSortie);
    ajouter('Traitement de sortie', episode.traitementSortie);
    ajouter('Conduite a tenir', episode.conduiteATenir);
    ajouter('Etat a la sortie', episode.etatSortie);
    ajouter('Moyen de transport', episode.moyenTransport);
    return lignes.join('\n');
  }

  private resolveFinalStatus(modeSortie: ModeSortie): StatutHospitalisation {
    switch (modeSortie) {
      case ModeSortie.DECES:
        return StatutHospitalisation.DECEDE;
      case ModeSortie.EVASION:
        return StatutHospitalisation.EVADE;
      case ModeSortie.TRANSFERT_INTERNE:
        return StatutHospitalisation.TRANSFERE;
      case ModeSortie.SORTIE_AUTORISEE:
      case ModeSortie.SORTIE_CONTRE_AVIS:
      case ModeSortie.TRANSFERT_EXTERNE:
      case ModeSortie.EVACUATION_SANITAIRE:
      default:
        return StatutHospitalisation.SORTIE;
    }
  }
​
  private resolvePaymentState(
    input: CloseHospitalisationEpisodeDto,
    userId: string,
    dateSortie: Date,
  ): {
    fraisRegles: boolean;
    statutPaiementSortie: StatutPaiementSortie;
    fraisReglesPar: string | null;
    fraisReglesAt: Date | null;
    sortieAdministrativeValidee: boolean;
  } {
    let statut = input.statutPaiementSortie ?? StatutPaiementSortie.NON_VERIFIE;
    if (input.fraisRegles === true) {
      statut = StatutPaiementSortie.REGLE;
    } else if (input.fraisRegles === false && !input.statutPaiementSortie) {
      statut = StatutPaiementSortie.NON_REGLE;
    }
​
    const paiementOK = [
      StatutPaiementSortie.REGLE,
      StatutPaiementSortie.EXONERE,
      StatutPaiementSortie.PRISE_EN_CHARGE,
      StatutPaiementSortie.REGLEMENT_DIFFERE,
    ].includes(statut);
​
    return {
      fraisRegles: statut === StatutPaiementSortie.REGLE,
      statutPaiementSortie: statut,
      fraisReglesPar: statut === StatutPaiementSortie.REGLE ? userId : null,
      fraisReglesAt: statut === StatutPaiementSortie.REGLE ? dateSortie : null,
      sortieAdministrativeValidee: paiementOK,
    };
  }
​
  private activeStatuses(): StatutHospitalisation[] {
    return [StatutHospitalisation.ADMIS, StatutHospitalisation.EN_COURS];
  }
​
  private isClosedStatus(statut: StatutHospitalisation): boolean {
    return this.closedStatuses().includes(statut);
  }

  private closedStatuses(): StatutHospitalisation[] {
    return [
      StatutHospitalisation.TRANSFERE,
      StatutHospitalisation.SORTIE,
      StatutHospitalisation.DECEDE,
      StatutHospitalisation.EVADE,
    ];
  }

  /** Duree de sejour en jours (dateSortie - dateAdmission, borne a 0). */
  private stayDays(episode: HospitalisationEpisodeEntity): number | null {
    if (!episode.dateAdmission) {
      return null;
    }
    const start = new Date(episode.dateAdmission);
    const end = episode.dateSortie ? new Date(episode.dateSortie) : new Date();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return null;
    }
    return Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / 86400000),
    );
  }

  /** Age (en annees) a partir d'une date de naissance ISO. */
  private ageFromBirthdate(dateNaissance?: string): number | null {
    if (!dateNaissance) {
      return null;
    }
    const birth = new Date(dateNaissance);
    if (Number.isNaN(birth.getTime())) {
      return null;
    }
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age -= 1;
    }
    if (age < 0 || age > 140) {
      return null;
    }
    return age;
  }

  /** Repartition par genre + tranches d'age des patients archives. */
  private buildDemographie(
    episodes: HospitalisationEpisodeEntity[],
  ): Demographie {
    const tranches_age = RAPPORT_AGE_BUCKETS.map((b) => ({
      tranche: b.tranche,
      nombre: 0,
    }));
    let hommes = 0;
    let femmes = 0;
    let enfants = 0;
    let inconnus = 0;

    for (const ep of episodes) {
      const sexe = (ep.patient?.sexe ?? '').toString().trim().toUpperCase();
      if (sexe.startsWith('F')) {
        femmes += 1;
      } else if (sexe.startsWith('M')) {
        hommes += 1;
      } else {
        inconnus += 1;
      }

      const age = this.ageFromBirthdate(ep.patient?.dateNaissance);
      if (age !== null) {
        if (age < 18) {
          enfants += 1;
        }
        const idx = RAPPORT_AGE_BUCKETS.findIndex(
          (b) => age >= b.min && age <= b.max,
        );
        if (idx >= 0) {
          tranches_age[idx].nombre += 1;
        }
      }
    }

    return { hommes, femmes, enfants, inconnus, tranches_age };
  }

  /** Regroupement mensuel des episodes (par date de sortie). */
  private buildPeriodes(
    episodes: HospitalisationEpisodeEntity[],
  ): PeriodeStat[] {
    const map = new Map<string, PeriodeStat>();

    for (const ep of episodes) {
      const raw = ep.dateSortie ?? ep.dateAdmission;
      if (!raw) {
        continue;
      }
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) {
        continue;
      }
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      let entry = map.get(key);
      if (!entry) {
        entry = {
          key,
          periode: `${RAPPORT_MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`,
          total: 0,
          sorties: 0,
          transferts: 0,
          deces: 0,
          evasions: 0,
        };
        map.set(key, entry);
      }
      entry.total += 1;
      switch (ep.statut) {
        case StatutHospitalisation.SORTIE:
          entry.sorties += 1;
          break;
        case StatutHospitalisation.TRANSFERE:
          entry.transferts += 1;
          break;
        case StatutHospitalisation.DECEDE:
          entry.deces += 1;
          break;
        case StatutHospitalisation.EVADE:
          entry.evasions += 1;
          break;
        default:
          break;
      }
    }

    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
  }

  /**
   * Normalise une borne de date de filtre. Une date seule (AAAA-MM-JJ) est
   * etendue au debut (00:00:00) ou a la fin (23:59:59) de la journee.
   */
  private parseBoundaryDate(
    value: string | undefined,
    boundary: 'start' | 'end',
  ): Date | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date de filtre invalide');
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
      if (boundary === 'start') {
        date.setHours(0, 0, 0, 0);
      } else {
        date.setHours(23, 59, 59, 999);
      }
    }
    return date;
  }
}
​