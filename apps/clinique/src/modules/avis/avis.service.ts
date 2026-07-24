import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AvisEntity, StatutAvis, UrgenceAvis } from '../../domain/entities/avis.entity';
import { CreateAvisDto, UpdateAvisDto, AvisQuery } from './avis.dto';
import { buildAvisId } from '../../common/utils/ids';
import { ServiceChuApiService } from '../../infrastructure/http-clients/service-chu-api.service';
import { NotificationApiService } from '../../infrastructure/http-clients/notification-api.service';

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

    const entity = this.avisRepository.create({
      id: buildAvisId({ chuId: input.chuId, createdAt: new Date() }),
      motif: input.motif,
      patientId: input.patientId,
      serviceIdSource: input.serviceIdSource,
      serviceIdDest: input.serviceIdDest,
      chuId: input.chuId,
      urgence: input.urgence ?? UrgenceAvis.PROGRAMMEE,
      statut: StatutAvis.EN_ATTENTE,
      infoComplementaire: input.infoComplementaire ?? null,
      createdBy: input.createdBy,
    });

    const saved = await this.avisRepository.save(entity);

    // Notifie le service destinataire (le consultant) qu'un avis est demande.
    await this.safeNotify({
      serviceId: saved.serviceIdDest,
      title: "Nouvelle demande d'avis",
      message: `Un avis (${saved.urgence}) est demande pour le patient ${saved.patientId}.`,
      type: 'avis_created',
      source: 'hospitalisation-back',
      data: {
        avisId: saved.id,
        patientId: saved.patientId,
        serviceIdSource: saved.serviceIdSource,
        serviceIdDest: saved.serviceIdDest,
        urgence: saved.urgence,
        statut: saved.statut,
        motif: saved.motif,
      },
    });

    return saved;
  }

  async findById(id: string, chuId?: string): Promise<AvisEntity> {
    const where: FindOptionsWhere<AvisEntity> = chuId ? { id, chuId } : { id };
    const avis = await this.avisRepository.findOne({ where });
    if (!avis) {
      throw new NotFoundException('Avis introuvable');
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
    if (query.statut) {
      where.statut = query.statut;
    }

    return this.avisRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, input: UpdateAvisDto, chuId?: string): Promise<AvisEntity> {
    const avis = await this.findById(id, chuId);

    if (input.motif !== undefined) {
      avis.motif = input.motif;
    }
    if (input.statut !== undefined) {
      avis.statut = input.statut;
    }
    if (input.reponse !== undefined) {
      avis.reponse = input.reponse;
    }
    if (input.motifRefus !== undefined) {
      avis.motifRefus = input.motifRefus;
    }
    if (input.infoComplementaire !== undefined) {
      avis.infoComplementaire = input.infoComplementaire;
    }
    avis.updatedBy = input.updatedBy;

    const saved = await this.avisRepository.save(avis);

    // Notifications best-effort selon la transition de statut.
    // Contrairement a une demande d'hospitalisation, aucun episode n'est cree.
    if (input.statut === StatutAvis.PRISE_EN_CHARGE) {
      await this.notifySource(saved, {
        title: "Avis pris en charge",
        message: `Votre demande d'avis pour le patient ${saved.patientId} est prise en charge.`,
        type: 'avis_taken',
      });
    }

    if (input.statut === StatutAvis.REPONDUE) {
      await this.notifySource(saved, {
        title: "Reponse a votre demande d'avis",
        message: `Le consultant a repondu pour le patient ${saved.patientId}.`,
        type: 'avis_answered',
      });
    }

    if (input.statut === StatutAvis.REFUSEE) {
      await this.notifySource(saved, {
        title: "Demande d'avis refusee",
        message: `Votre demande d'avis pour le patient ${saved.patientId} a ete refusee.`
          + `${saved.motifRefus ? ` Motif : ${saved.motifRefus}` : ''}`,
        type: 'avis_refused',
      });
    }

    return saved;
  }

  async delete(id: string, chuId?: string): Promise<void> {
    const avis = await this.findById(id, chuId);
    await this.avisRepository.remove(avis);
  }

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
      source: 'hospitalisation-back',
      data: {
        avisId: avis.id,
        patientId: avis.patientId,
        serviceIdSource: avis.serviceIdSource,
        serviceIdDest: avis.serviceIdDest,
        statut: avis.statut,
        motifRefus: avis.motifRefus ?? null,
      },
    });
  }

  /** Notification best-effort : ne doit jamais faire echouer l'operation metier. */
  private async safeNotify(
    payload: Parameters<NotificationApiService['sendToService']>[0],
  ): Promise<void> {
    try {
      await this.notificationApi.sendToService(payload);
    } catch (err) {
      this.logger.warn(
        `Avis: notification non envoyee : ${(err as Error)?.message ?? err}`,
      );
    }
  }
}
