import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SignatureService } from '../signature/signature.service';
import { isUuidV4 } from '../../common/utils/uuid';
import {
  AffectationLitEntity,
  AvisMedicalEntity,
  ChambreEntity,
  DemandeAvisEntity,
  DemandeTransfertEntity,
  DiagnosticsEntity,
  HospitalisationEntity,
  LitEntity,
  ModeSortieEntity,
  PersonnelRefEntity,
  PrescriptionMedicaleEntity,
  ServiceRefEntity,
  SoinsEntity,
  StatutDemandeTransfert,
  StatutDemande,
  StatutHospitalisation,
  StatutLit,
  TransfertEntity,
} from './hospitalisation.entities';
import { ActiveHospitalisationItem, HospitalisationStatsResponse, PlanLitsResponse, PlanLitRoomItem, PlanLitBedItem } from './hospitalisation.dto';
import {
  CloturerHospitalisationDto,
  CreateChambreDto,
  CreateLitDto,
  CreateAffectationLitDto,
  CreateAvisMedicalDto,
  CreateDemandeAvisDto,
  CreateDemandeTransfertDto,
  CreateDiagnosticsDto,
  CreateHospitalisationDto,
  CreatePrescriptionMedicaleDto,
  TraiterDemandeTransfertDto,
  UpdateLitStatutDto,
} from './hospitalisation.dto';
import { HospitalisationGateway } from './hospitalisation.gateway';
import { AccueilPatientApiService } from '../accueil/accueil-patient-api.service';

@Injectable()
export class HospitalisationService implements OnModuleDestroy {
  private readonly logger = new Logger(HospitalisationService.name);
  private readonly demandeAvisIntervals = new Map<string, NodeJS.Timeout>();

  private static readonly DEFAULT_LIMIT = 6;
  private static readonly MAX_LIMIT = 50;

  constructor(
    @InjectRepository(HospitalisationEntity)
    private readonly hospitalisationRepository: Repository<HospitalisationEntity>,
    @InjectRepository(ModeSortieEntity)
    private readonly modeSortieRepository: Repository<ModeSortieEntity>,
    @InjectRepository(DemandeAvisEntity)
    private readonly demandeAvisRepository: Repository<DemandeAvisEntity>,
    @InjectRepository(AvisMedicalEntity)
    private readonly avisMedicalRepository: Repository<AvisMedicalEntity>,
    @InjectRepository(DiagnosticsEntity)
    private readonly diagnosticsRepository: Repository<DiagnosticsEntity>,
    @InjectRepository(PrescriptionMedicaleEntity)
    private readonly prescriptionRepository: Repository<PrescriptionMedicaleEntity>,
    @InjectRepository(DemandeTransfertEntity)
    private readonly demandeTransfertRepository: Repository<DemandeTransfertEntity>,
    @InjectRepository(LitEntity)
    private readonly litRepository: Repository<LitEntity>,
    @InjectRepository(ChambreEntity)
    private readonly chambreRepository: Repository<ChambreEntity>,
    @InjectRepository(AffectationLitEntity)
    private readonly affectationLitRepository: Repository<AffectationLitEntity>,
    @InjectRepository(TransfertEntity)
    private readonly transfertRepository: Repository<TransfertEntity>,
    @InjectRepository(SoinsEntity)
    private readonly soinsRepository: Repository<SoinsEntity>,
    @InjectRepository(PersonnelRefEntity)
    private readonly personnelRefRepository: Repository<PersonnelRefEntity>,
    @InjectRepository(ServiceRefEntity)
    private readonly serviceRefRepository: Repository<ServiceRefEntity>,
    private readonly signatureService: SignatureService,
    private readonly hospitalisationGateway: HospitalisationGateway,
    private readonly accueilPatientApi: AccueilPatientApiService,
  ) {}

  // --- Ref Seed Methods ---

  async createPersonnelRef(id: string): Promise<PersonnelRefEntity> {
    const entity = this.personnelRefRepository.create({ id });
    return this.personnelRefRepository.save(entity);
  }

  async createServiceRef(id: string): Promise<ServiceRefEntity> {
    const entity = this.serviceRefRepository.create({ id });
    return this.serviceRefRepository.save(entity);
  }

  async createHospitalisation(input: CreateHospitalisationDto): Promise<HospitalisationEntity> {
    await this.accueilPatientApi.ensurePatientExistsAtAccueil(input.patientId);
    await this.assertServiceRefExists(input.serviceId);
    let modeSortie: ModeSortieEntity | null = null;
    if (input.idModeSortie) {
      if (!isUuidV4(input.idModeSortie)) {
        throw new UnprocessableEntityException('Identifiant mode sortie invalide');
      }
      modeSortie = await this.modeSortieRepository.findOne({ where: { id: input.idModeSortie } });
      if (!modeSortie) {
        throw new NotFoundException('Mode de sortie introuvable');
      }
    }

    const entity = this.hospitalisationRepository.create({
      patientId: input.patientId,
      serviceId: input.serviceId,
      motifHospitalisation: input.motifHospitalisation,
      type: input.type ?? 'Hospitalisation',
      commentaire: input.commentaire ?? null,
      dateEntrer: new Date(input.dateEntrer),
      modeSortie,
      idModeSortie: input.idModeSortie ?? null,
      statutHospitalisation: StatutHospitalisation.EN_COURS,
    });
    const saved = await this.hospitalisationRepository.save(entity);
    if (input.idLit) {
      const litDisponible = await this.findAvailableLitForService(input.serviceId, input.idLit);
      await this.affecterLit(saved.id, litDisponible.id);
    }
    this.hospitalisationGateway.emitHospitalisationCreated(saved);
    return saved;
  }

  async createDemandeAvis(input: CreateDemandeAvisDto): Promise<DemandeAvisEntity> {
    await this.assertHospitalisationExists(input.idHospitalisation);

    const demande = this.demandeAvisRepository.create({
      ...input,
      dateDemande: new Date(),
      statut: StatutDemande.EN_ATTENTE,
    });
    const saved = await this.demandeAvisRepository.save(demande);
    this.startAvisNotification(saved.id);
    return saved;
  }

  async consulterDemandeAvis(id: string): Promise<DemandeAvisEntity> {
    const demande = await this.demandeAvisRepository.findOne({ where: { id } });
    if (!demande) {
      throw new NotFoundException("Demande d'avis introuvable");
    }
    demande.statut = StatutDemande.CONSULTEE;
    this.stopAvisNotification(id);
    return this.demandeAvisRepository.save(demande);
  }

  async createDiagnostics(
    input: CreateDiagnosticsDto,
    user: { orderNumber?: string | null } | null,
  ): Promise<DiagnosticsEntity> {
    await this.assertHospitalisationExists(input.idHospitalisation);
    this.signatureService.assertProfessionalOrderNumber(user);

    const diagnostics = this.diagnosticsRepository.create({
      ...input,
      dateDiagnostics: new Date(),
    });
    return this.diagnosticsRepository.save(diagnostics);
  }

  async createAvisMedical(
    input: CreateAvisMedicalDto,
    user: { orderNumber?: string | null } | null,
  ): Promise<AvisMedicalEntity> {
    this.signatureService.assertProfessionalOrderNumber(user);
    const demande = await this.demandeAvisRepository.findOne({ where: { id: input.idDemande } });
    if (!demande) {
      throw new NotFoundException("Demande d'avis referencee introuvable");
    }
    if (demande.statut !== StatutDemande.CONSULTEE) {
      throw new UnprocessableEntityException(
        "Avis medical interdit tant que la demande d'avis n'est pas consultee",
      );
    }

    const avis = this.avisMedicalRepository.create({
      ...input,
      dateAvis: new Date(),
    });
    return this.avisMedicalRepository.save(avis);
  }

  async createPrescriptionMedicale(
    input: CreatePrescriptionMedicaleDto,
    user: { orderNumber?: string | null } | null,
  ): Promise<PrescriptionMedicaleEntity> {
    await this.assertHospitalisationExists(input.idHospitalisation);
    this.signatureService.assertProfessionalOrderNumber(user);

    const prescription = this.prescriptionRepository.create({
      ...input,
      datePrescription: new Date(),
    });
    return this.prescriptionRepository.save(prescription);
  }

  async createDemandeTransfert(input: CreateDemandeTransfertDto): Promise<DemandeTransfertEntity> {
    const hospitalisation = await this.hospitalisationRepository.findOne({
      where: { id: input.idHospitalisation },
    });
    if (!hospitalisation) {
      throw new NotFoundException('Hospitalisation introuvable');
    }
    if (hospitalisation.serviceId !== input.serviceSource) {
      throw new UnprocessableEntityException(
        'Le service source doit correspondre au service courant de hospitalisation',
      );
    }
    const demande = this.demandeTransfertRepository.create({
      ...input,
      dateDemande: new Date(),
      statut: StatutDemandeTransfert.A_VOIR,
    });
    return this.demandeTransfertRepository.save(demande);
  }

  async traiterDemandeTransfert(
    idDemandeTransfert: string,
    input: TraiterDemandeTransfertDto,
  ): Promise<DemandeTransfertEntity> {
    const demande = await this.demandeTransfertRepository.findOne({ where: { id: idDemandeTransfert } });
    if (!demande) {
      throw new NotFoundException('Demande de transfert introuvable');
    }
    if (
      input.statut === StatutDemandeTransfert.REFUSE &&
      (!input.justification || input.justification.trim().length === 0)
    ) {
      throw new UnprocessableEntityException('Justification obligatoire si transfert REFUSE');
    }
    demande.statut = input.statut;
    demande.justification = input.justification ?? null;
    const savedDemande = await this.demandeTransfertRepository.save(demande);

    if (input.statut === StatutDemandeTransfert.ACCEPTE) {
      const litDestination = await this.findAvailableLitForService(
        savedDemande.serviceDestination,
        input.idLitDestination,
      );
      await this.effectuerTransfert(savedDemande, litDestination.id);
    }

    return savedDemande;
  }

  async cloturerHospitalisation(
    idHospitalisation: string,
    input: CloturerHospitalisationDto,
  ): Promise<HospitalisationEntity> {
    const hospitalisation = await this.hospitalisationRepository.findOne({
      where: { id: idHospitalisation },
    });
    if (!hospitalisation) {
      throw new NotFoundException('Hospitalisation introuvable');
    }
    const modeSortie = await this.modeSortieRepository.findOne({ where: { id: input.idModeSortie } });
    if (!modeSortie) {
      throw new NotFoundException('Mode de sortie introuvable');
    }

    hospitalisation.idModeSortie = input.idModeSortie;
    hospitalisation.modeSortie = modeSortie;
    hospitalisation.commentaire = input.commentaire ?? null;
    hospitalisation.dateSortie = new Date();
    hospitalisation.statutHospitalisation = StatutHospitalisation.CLOTUREE;
    const closed = await this.hospitalisationRepository.save(hospitalisation);

    const activeAffectation = await this.affectationLitRepository.findOne({
      where: { idHospitalisation, dateFinAffectation: IsNull() },
      order: { dateDebutAffectation: 'DESC' },
    });
    if (activeAffectation) {
      activeAffectation.dateFinAffectation = new Date();
      await this.affectationLitRepository.save(activeAffectation);
      const lit = await this.litRepository.findOne({ where: { id: activeAffectation.idLit } });
      if (lit) {
        lit.statut = StatutLit.DISPONIBLE;
        await this.litRepository.save(lit);
      }
    }

    return closed;
  }

  async findHospitalisationById(id: string): Promise<HospitalisationEntity | null> {
    return this.hospitalisationRepository.findOne({ where: { id } });
  }

  async getHospitalisationStats(): Promise<HospitalisationStatsResponse> {
    const hospitalizedTotal = await this.hospitalisationRepository.count({
      where: { statutHospitalisation: StatutHospitalisation.EN_COURS },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const hospitalizedNewToday = await this.hospitalisationRepository
      .createQueryBuilder('hospitalisation')
      .where('hospitalisation.statut_hospitalisation = :status', {
        status: StatutHospitalisation.EN_COURS,
      })
      .andWhere('hospitalisation.date_entrer >= :startOfToday', {
        startOfToday,
      })
      .getCount();

    return {
      hospitalizedTotal,
      hospitalizedNewToday,
    };
  }

  async getActiveHospitalisations(limit: number): Promise<ActiveHospitalisationItem[]> {
    const normalizedLimit = this.normalizeLimit(limit);

    const rows = await this.hospitalisationRepository
      .createQueryBuilder('hospitalisation')
      .leftJoin(
        AffectationLitEntity,
        'affectation',
        'affectation.id_hospitalisation = hospitalisation.id_hospitalisation AND affectation.date_fin_affectation IS NULL',
      )
      .leftJoin(LitEntity, 'lit', 'lit.id_lit = affectation.id_lit')
      .leftJoin(ChambreEntity, 'chambre', 'chambre.id_chambre = lit.id_chambre')
      .where('hospitalisation.statut_hospitalisation = :status', {
        status: StatutHospitalisation.EN_COURS,
      })
      .orderBy('hospitalisation.date_entrer', 'DESC')
      .limit(normalizedLimit)
      .select([
        'hospitalisation.id_hospitalisation AS id',
        'hospitalisation.id_patient AS "patientId"',
        'hospitalisation.date_entrer AS "dateEntrer"',
        'hospitalisation.motif_hospitalisation AS "motifHospitalisation"',
        'hospitalisation.id_service AS "serviceId"',
        'hospitalisation.statut_hospitalisation AS "statutHospitalisation"',
        'lit.code_lit AS "litCode"',
        'chambre.numero_chambre AS "chambreNumero"',
      ])
      .getRawMany<ActiveHospitalisationItem>();

    return rows.map((row) => ({
      ...row,
      dateEntrer: new Date(row.dateEntrer).toISOString(),
      litCode: row.litCode ?? null,
      chambreNumero: row.chambreNumero ?? null,
    }));
  }

  async getPlanLitsByService(serviceId: string): Promise<PlanLitsResponse> {
    const chambres = await this.chambreRepository.find({
      where: { serviceId: serviceId },
      order: { numeroChambre: 'ASC' },
    });

    let totalLits = 0;
    let litsOccupes = 0;
    let totalPatients = 0;

    const chambreResults: PlanLitRoomItem[] = [];

    for (const chambre of chambres) {
      const lits = await this.litRepository.find({
        where: { idChambre: chambre.id },
        order: { codeLit: 'ASC' },
      });

      const litItems: PlanLitBedItem[] = [];

      for (const lit of lits) {
        totalLits++;

        const activeAffectation = await this.affectationLitRepository.findOne({
          where: { idLit: lit.id, dateFinAffectation: IsNull() },
          order: { dateDebutAffectation: 'DESC' },
        });

        let hospitalisation: PlanLitBedItem['hospitalisation'] = null;

        if (activeAffectation) {
          litsOccupes++;
          totalPatients++;

          const hosp = await this.hospitalisationRepository.findOne({
            where: { id: activeAffectation.idHospitalisation },
          });

          if (hosp) {
            const latestDiag = await this.diagnosticsRepository.findOne({
              where: { idHospitalisation: hosp.id },
              order: { dateDiagnostics: 'DESC' },
            });

            const soinsCount = await this.soinsRepository.count({
              where: { idHospitalisation: hosp.id },
            });

            hospitalisation = {
              id: hosp.id,
              patientId: hosp.patientId,
              dateEntrer: new Date(hosp.dateEntrer).toISOString(),
              motifHospitalisation: hosp.motifHospitalisation,
              statutHospitalisation: hosp.statutHospitalisation,
              diagnostic: latestDiag?.descriptionDiagnostic ?? null,
              soinsCount,
            };
          }
        }

        litItems.push({
          litId: lit.id,
          codeLit: lit.codeLit,
          statut: lit.statut,
          hospitalisation,
        });
      }

      chambreResults.push({
        chambreId: chambre.id,
        numeroChambre: chambre.numeroChambre,
        type: chambre.type,
        lits: litItems,
      });
    }

    return {
      serviceId,
      chambres: chambreResults,
      stats: { totalLits, litsOccupes, totalPatients },
    };
  }

  async findDemandeAvisById(id: string): Promise<DemandeAvisEntity | null> {
    return this.demandeAvisRepository.findOne({ where: { id } });
  }

  async findDemandeTransfertById(id: string): Promise<DemandeTransfertEntity | null> {
    return this.demandeTransfertRepository.findOne({ where: { id } });
  }

  async findAvailableLitsByService(serviceId: string): Promise<LitEntity[]> {
    return this.litRepository
      .createQueryBuilder('lit')
      .innerJoin(ChambreEntity, 'chambre', 'chambre.id_chambre = lit.id_chambre')
      .where('chambre.id_service = :serviceId', { serviceId })
      .andWhere('lit.statut = :statut', { statut: StatutLit.DISPONIBLE })
      .orderBy('lit.code_lit', 'ASC')
      .getMany();
  }

  async createChambre(input: CreateChambreDto): Promise<ChambreEntity> {
    await this.assertServiceRefExists(input.serviceId);
    const exists = await this.chambreRepository.findOne({
      where: { serviceId: input.serviceId, numeroChambre: input.numeroChambre },
    });
    if (exists) {
      throw new UnprocessableEntityException('Une chambre avec ce numero existe deja pour ce service');
    }
    const chambre = this.chambreRepository.create(input);
    return this.chambreRepository.save(chambre);
  }

  async createLit(input: CreateLitDto): Promise<LitEntity> {
    const chambre = await this.chambreRepository.findOne({ where: { id: input.idChambre } });
    if (!chambre) {
      throw new NotFoundException('Chambre introuvable');
    }
    const existing = await this.litRepository.findOne({ where: { codeLit: input.codeLit } });
    if (existing) {
      throw new UnprocessableEntityException('Code lit deja utilise');
    }
    const lit = this.litRepository.create({ ...input, statut: StatutLit.DISPONIBLE });
    return this.litRepository.save(lit);
  }

  async findLitById(id: string): Promise<LitEntity | null> {
    return this.litRepository.findOne({ where: { id } });
  }

  async findLitsByChambre(idChambre: string): Promise<LitEntity[]> {
    return this.litRepository.find({ where: { idChambre }, order: { codeLit: 'ASC' } });
  }

  async updateLitStatut(idLit: string, input: UpdateLitStatutDto): Promise<LitEntity> {
    const lit = await this.litRepository.findOne({ where: { id: idLit } });
    if (!lit) {
      throw new NotFoundException('Lit introuvable');
    }
    const activeAffectation = await this.affectationLitRepository.findOne({
      where: { idLit, dateFinAffectation: IsNull() },
      order: { dateDebutAffectation: 'DESC' },
    });

    if (input.statut === StatutLit.OCCUPE) {
      throw new UnprocessableEntityException(
        "Statut OCCUPE reserve au flux d'affectation de lit d'hospitalisation",
      );
    }
    if (activeAffectation) {
      throw new UnprocessableEntityException(
        'Statut lit non modifiable tant qu une affectation active existe',
      );
    }

    lit.statut = input.statut;
    return this.litRepository.save(lit);
  }

  async assertHospitalisationExists(id: string): Promise<void> {
    const entity = await this.findHospitalisationById(id);
    if (!entity) {
      throw new NotFoundException('Hospitalisation introuvable');
    }
  }

  private async assertServiceRefExists(id: string): Promise<void> {
    const service = await this.serviceRefRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(
        "Service introuvable. Creez d'abord la reference via POST /hospitalisations/seed/service-ref.",
      );
    }
  }

  async createAffectationLit(input: CreateAffectationLitDto): Promise<AffectationLitEntity> {
    const hospitalisation = await this.hospitalisationRepository.findOne({
      where: { id: input.idHospitalisation },
    });
    if (!hospitalisation) {
      throw new NotFoundException('Hospitalisation introuvable');
    }

    const lit = await this.litRepository.findOne({ where: { id: input.idLit } });
    if (!lit) {
      throw new NotFoundException('Lit introuvable');
    }
    const chambre = await this.chambreRepository.findOne({ where: { id: lit.idChambre } });
    if (!chambre || chambre.serviceId !== hospitalisation.serviceId) {
      throw new UnprocessableEntityException('Le lit doit appartenir au service courant de hospitalisation');
    }

    const activeAffectation = await this.affectationLitRepository.findOne({
      where: { idHospitalisation: input.idHospitalisation, dateFinAffectation: IsNull() },
      order: { dateDebutAffectation: 'DESC' },
    });
    if (activeAffectation) {
      activeAffectation.dateFinAffectation = new Date();
      await this.affectationLitRepository.save(activeAffectation);
      const oldLit = await this.litRepository.findOne({ where: { id: activeAffectation.idLit } });
      if (oldLit) {
        oldLit.statut = StatutLit.DISPONIBLE;
        await this.litRepository.save(oldLit);
      }
    }

    await this.affecterLit(input.idHospitalisation, input.idLit);
    const nouvelleAffectation = await this.affectationLitRepository.findOne({
      where: { idHospitalisation: input.idHospitalisation, dateFinAffectation: IsNull() },
      order: { dateDebutAffectation: 'DESC' },
    });

    if (!nouvelleAffectation) {
      throw new UnprocessableEntityException('Affectation non creee');
    }
    return nouvelleAffectation;
  }

  private async findAvailableLitForService(serviceId: string, preferredLitId?: string): Promise<LitEntity> {
    if (preferredLitId) {
      const lit = await this.litRepository.findOne({ where: { id: preferredLitId } });
      if (!lit) {
        throw new NotFoundException('Lit cible introuvable');
      }
      const chambre = await this.chambreRepository.findOne({ where: { id: lit.idChambre } });
      if (!chambre || chambre.serviceId !== serviceId) {
        throw new UnprocessableEntityException('Le lit cible ne correspond pas au service cible');
      }
      if (lit.statut !== StatutLit.DISPONIBLE) {
        throw new UnprocessableEntityException('Le lit cible nest pas disponible');
      }
      return lit;
    }

    const lit = await this.litRepository
      .createQueryBuilder('lit')
      .innerJoin(ChambreEntity, 'chambre', 'chambre.id_chambre = lit.id_chambre')
      .where('chambre.id_service = :serviceId', { serviceId })
      .andWhere('lit.statut = :statut', { statut: StatutLit.DISPONIBLE })
      .orderBy('lit.code_lit', 'ASC')
      .getOne();

    if (!lit) {
      throw new UnprocessableEntityException('Aucun lit disponible dans le service cible');
    }

    return lit;
  }

  private async affecterLit(idHospitalisation: string, idLit: string): Promise<void> {
    const lit = await this.litRepository.findOne({ where: { id: idLit } });
    if (!lit || lit.statut !== StatutLit.DISPONIBLE) {
      throw new UnprocessableEntityException("Affectation impossible: lit indisponible");
    }

    lit.statut = StatutLit.OCCUPE;
    await this.litRepository.save(lit);

    const affectation = this.affectationLitRepository.create({
      idHospitalisation,
      idLit,
      dateDebutAffectation: new Date(),
      dateFinAffectation: null,
    });
    await this.affectationLitRepository.save(affectation);
  }

  private async effectuerTransfert(demande: DemandeTransfertEntity, idLitDestination: string): Promise<void> {
    const hospitalisation = await this.hospitalisationRepository.findOne({
      where: { id: demande.idHospitalisation },
    });
    if (!hospitalisation) {
      throw new NotFoundException('Hospitalisation introuvable pour transfert');
    }

    const activeAffectation = await this.affectationLitRepository.findOne({
      where: { idHospitalisation: demande.idHospitalisation, dateFinAffectation: IsNull() },
      order: { dateDebutAffectation: 'DESC' },
    });

    if (activeAffectation) {
      activeAffectation.dateFinAffectation = new Date();
      await this.affectationLitRepository.save(activeAffectation);
      const oldLit = await this.litRepository.findOne({ where: { id: activeAffectation.idLit } });
      if (oldLit) {
        oldLit.statut = StatutLit.DISPONIBLE;
        await this.litRepository.save(oldLit);
      }
    }

    await this.affecterLit(demande.idHospitalisation, idLitDestination);

    hospitalisation.serviceId = demande.serviceDestination;
    await this.hospitalisationRepository.save(hospitalisation);

    const transfert = this.transfertRepository.create({
      idDemande: demande.id,
      dateTransfert: new Date(),
    });
    await this.transfertRepository.save(transfert);
  }

  private startAvisNotification(demandeId: string): void {
    if (this.demandeAvisIntervals.has(demandeId)) {
      return;
    }
    const interval = setInterval(async () => {
      const demande = await this.demandeAvisRepository.findOne({ where: { id: demandeId } });
      if (!demande || demande.statut === StatutDemande.CONSULTEE) {
        this.stopAvisNotification(demandeId);
        return;
      }
      this.logger.warn(`Notification DemandeAvis ${demandeId}: en attente de consultation`);
    }, 5 * 60 * 1000);
    this.demandeAvisIntervals.set(demandeId, interval);
  }

  private stopAvisNotification(demandeId: string): void {
    const interval = this.demandeAvisIntervals.get(demandeId);
    if (interval) {
      clearInterval(interval);
      this.demandeAvisIntervals.delete(demandeId);
    }
  }

  onModuleDestroy(): void {
    for (const demandeId of this.demandeAvisIntervals.keys()) {
      this.stopAvisNotification(demandeId);
    }
  }

  private normalizeLimit(limit: number): number {
    if (!Number.isFinite(limit) || limit <= 0) {
      return HospitalisationService.DEFAULT_LIMIT;
    }

    return Math.min(limit, HospitalisationService.MAX_LIMIT);
  }
}
