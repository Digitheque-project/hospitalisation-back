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
  PrescriptionMedicaleEntity,
  StatutDemandeTransfert,
  StatutDemande,
  StatutHospitalisation,
  StatutLit,
  TransfertEntity,
} from './hospitalisation.entities';
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

@Injectable()
export class HospitalisationService implements OnModuleDestroy {
  private readonly logger = new Logger(HospitalisationService.name);
  private readonly demandeAvisIntervals = new Map<string, NodeJS.Timeout>();

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
    private readonly signatureService: SignatureService,
  ) {}

  async createHospitalisation(input: CreateHospitalisationDto): Promise<HospitalisationEntity> {
    let modeSortie: ModeSortieEntity | null = null;
    if (input.idModeSortie) {
      modeSortie = await this.modeSortieRepository.findOne({ where: { id: input.idModeSortie } });
      if (!modeSortie) {
        throw new NotFoundException('Mode de sortie introuvable');
      }
    }

    const litDisponible = await this.findAvailableLitForService(input.idService, input.idLit);
    const entity = this.hospitalisationRepository.create({
      idPatient: input.idPatient,
      idService: input.idService,
      idDemandeHospitalisation: input.idDemandeHospitalisation,
      motifHospitalisation: input.motifHospitalisation,
      commentaire: input.commentaire ?? null,
      dateEntrer: new Date(input.dateEntrer),
      modeSortie,
      idModeSortie: input.idModeSortie ?? null,
      statutHospitalisation: StatutHospitalisation.EN_COURS,
    });
    const saved = await this.hospitalisationRepository.save(entity);
    await this.affecterLit(saved.id, litDisponible.id);
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
    if (hospitalisation.idService !== input.serviceSource) {
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
    const exists = await this.chambreRepository.findOne({
      where: { idService: input.idService, numeroChambre: input.numeroChambre },
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
    if (!chambre || chambre.idService !== hospitalisation.idService) {
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
      if (!chambre || chambre.idService !== serviceId) {
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

    hospitalisation.idService = demande.serviceDestination;
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
}
