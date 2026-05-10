import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignatureService } from '../signature/signature.service';
import {
  AvisMedicalEntity,
  DemandeAvisEntity,
  DiagnosticsEntity,
  HospitalisationEntity,
  ModeSortieEntity,
  StatutDemande,
  StatutHospitalisation,
} from './hospitalisation.entities';
import {
  CreateAvisMedicalDto,
  CreateDemandeAvisDto,
  CreateDiagnosticsDto,
  CreateHospitalisationDto,
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

    const entity = this.hospitalisationRepository.create({
      ...input,
      dateEntrer: new Date(input.dateEntrer),
      modeSortie,
      idModeSortie: input.idModeSortie ?? null,
      statutHospitalisation: StatutHospitalisation.EN_COURS,
    });
    return this.hospitalisationRepository.save(entity);
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

  async findHospitalisationById(id: string): Promise<HospitalisationEntity | null> {
    return this.hospitalisationRepository.findOne({ where: { id } });
  }

  async assertHospitalisationExists(id: string): Promise<void> {
    const entity = await this.findHospitalisationById(id);
    if (!entity) {
      throw new NotFoundException('Hospitalisation introuvable');
    }
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
