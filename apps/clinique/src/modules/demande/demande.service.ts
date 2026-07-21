import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DemandeEntity, StatutDemande } from '../../domain/entities/demande.entity';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import { CreateDemandeDto, UpdateDemandeDto, DemandeQuery } from './demande.dto';
import { buildEpisodeId } from '../../common/utils/ids';
import { ServiceChuApiService } from '../../infrastructure/http-clients/service-chu-api.service';
import { NotificationApiService } from '../../infrastructure/http-clients/notification-api.service';
import { HospitalisationService } from '../hospitalisation/hospitalisation.service';

/** Reponse du PATCH quand la demande est acceptee : la demande + l'episode cree/retrouve. */
export type DemandeUpdateResult = DemandeEntity & {
  episode?: HospitalisationEpisodeEntity | null;
};
​
@Injectable()
export class DemandeService {
  constructor(
    @InjectRepository(DemandeEntity)
    private readonly demandeRepository: Repository<DemandeEntity>,
    private readonly serviceChuApi: ServiceChuApiService,
    private readonly notificationApi: NotificationApiService,
    private readonly hospitalisationService: HospitalisationService,
  ) {}
​
  async create(input: CreateDemandeDto): Promise<DemandeEntity> {
    // Le service destination n'est pas porte par le token : on le valide
    // via le service CHU externe (SERVICE_CHU_API_BASE_URL).
    await this.serviceChuApi.getServiceById(input.serviceIdDest);
​
    const entity = this.demandeRepository.create({
      id: buildEpisodeId({
        chuId: input.chuId,
        dateAdmission: new Date(),
      }),
      motif: input.motif,
      patientId: input.patientId,
      serviceIdSource: input.serviceIdSource,
      serviceIdDest: input.serviceIdDest,
      chuId: input.chuId,
      statut: StatutDemande.EN_ATTENTE,
      infoComplementaire: input.infoComplementaire ?? null,
      createdBy: input.createdBy,
    });
​
    const saved = await this.demandeRepository.save(entity);

    await this.notificationApi.sendToService({
      serviceId: saved.serviceIdDest,
      title: 'Nouvelle demande d\'hospitalisation',
      message: `Une demande pour le patient ${saved.patientId} nécessite votre attention.`,
      type: 'demande_created',
      source: 'hospitalisation-back',
      data: {
        demandeId: saved.id,
        patientId: saved.patientId,
        serviceIdSource: saved.serviceIdSource,
        serviceIdDest: saved.serviceIdDest,
        statut: saved.statut,
        motif: saved.motif,
      },
    });

    return saved;
  }
​
  async findById(id: string, chuId?: string): Promise<DemandeEntity> {
    const where: FindOptionsWhere<DemandeEntity> = chuId ? { id, chuId } : { id };
    const demande = await this.demandeRepository.findOne({ where });
    if (!demande) {
      throw new NotFoundException('Demande introuvable');
    }
    return demande;
  }
​
  async findAll(query: DemandeQuery): Promise<DemandeEntity[]> {
    const where: FindOptionsWhere<DemandeEntity> = {};
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
​
    return this.demandeRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
​
  /**
   * Marque comme CONSULTEE toutes les demandes encore EN_ATTENTE d'un service
   * destination. Etat PARTAGE (persiste) : une fois consultees, elles ne
   * comptent plus dans le badge "non lues", pour TOUS les utilisateurs du
   * service, tout en restant traitables (Accepter / Refuser).
   *
   * Emet en TEMPS REEL un evenement 'demande_consulted' vers la room du service
   * (via le service de notifications), afin que le badge des autres utilisateurs
   * connectes se mette a jour instantanement, SANS polling cote front.
   */
  async marquerConsultees(
    serviceIdDest: string,
    chuId: string,
  ): Promise<{ updated: number }> {
    const result = await this.demandeRepository.update(
      { serviceIdDest, chuId, statut: StatutDemande.EN_ATTENTE },
      { statut: StatutDemande.CONSULTEE },
    );
    const updated = result.affected ?? 0;

    if (updated > 0) {
      // Best-effort : l'echec de la notification ne doit pas faire echouer le
      // marquage (l'etat est deja persiste en base).
      try {
        await this.notificationApi.sendToService({
          serviceId: serviceIdDest,
          title: 'Demandes consultees',
          message: 'Les demandes en attente ont ete consultees.',
          type: 'demande_consulted',
          source: 'hospitalisation-back',
          data: {
            serviceIdDest,
            chuId,
            updated,
          },
        });
      } catch (error) {
        console.error('[DemandeService] Echec notification demande_consulted:', error);
      }
    }

    return { updated };
  }

  async update(id: string, input: UpdateDemandeDto, chuId?: string): Promise<DemandeUpdateResult> {
    const demande = await this.findById(id, chuId);

    // L'acceptation cree l'episode d'hospitalisation AVANT de persister le statut :
    // si la creation echoue (patient inconnu a l'accueil, service indisponible...),
    // la demande reste EN_ATTENTE et reste visible/retraitable dans les notifications.
    // Idempotent : re-accepter une demande deja ACCEPTE sans episode actif le recree.
    let episode: HospitalisationEpisodeEntity | null = null;
    if (input.statut === StatutDemande.ACCEPTE) {
      episode = await this.hospitalisationService.findActiveEpisode(
        demande.patientId,
        demande.serviceIdDest,
        demande.chuId,
      );
      if (!episode) {
        episode = await this.hospitalisationService.createEpisode(
          {
            patientId: demande.patientId,
            serviceIdDest: demande.serviceIdDest,
            serviceIdSource: demande.serviceIdSource,
            motifAdmission: input.motif ?? demande.motif,
            createdBy: input.updatedBy,
          },
          demande.chuId,
          // L'acceptation d'une demande envoie deja ses propres notifications
          // (demande_accepted): on evite une double notification en attente de lit.
          { notifyServiceConcerne: false },
        );
      }
    }
​
    if (input.motif !== undefined) {
      demande.motif = input.motif;
    }
    if (input.statut !== undefined) {
      demande.statut = input.statut;
    }
    if (input.infoComplementaire !== undefined) {
      demande.infoComplementaire = input.infoComplementaire;
    }
    if (input.motifRefus !== undefined) {
      demande.motifRefus = input.motifRefus;
    }
    demande.updatedBy = input.updatedBy;
​
    const saved: DemandeUpdateResult = await this.demandeRepository.save(demande);
    if (episode) {
      saved.episode = episode;
    }

    if (input.statut === StatutDemande.ACCEPTE) {
      await this.notificationApi.sendToService({
        serviceId: demande.serviceIdSource,
        title: 'Demande d\'hospitalisation acceptée',
        message: `Votre demande pour le patient ${demande.patientId} a été acceptée par le service de destination.`,
        type: 'demande_accepted',
        source: 'hospitalisation-back',
        data: {
          demandeId: saved.id,
          patientId: saved.patientId,
          serviceIdSource: demande.serviceIdSource,
          serviceIdDest: demande.serviceIdDest,
          statut: saved.statut,
        },
      });
    }

    if (input.statut === StatutDemande.REFUSE) {
      await this.notificationApi.sendToService({
        serviceId: demande.serviceIdSource,
        title: 'Demande d\'hospitalisation refusée',
        message: `Votre demande pour le patient ${demande.patientId} a été refusée.${input.motifRefus ? ` Motif : ${input.motifRefus}` : ''}`,
        type: 'demande_refused',
        source: 'hospitalisation-back',
        data: {
          demandeId: saved.id,
          patientId: saved.patientId,
          serviceIdSource: demande.serviceIdSource,
          serviceIdDest: demande.serviceIdDest,
          statut: saved.statut,
          motifRefus: input.motifRefus ?? null,
        },
      });
    }

    return saved;
  }
​
  async delete(id: string, chuId?: string): Promise<void> {
    const demande = await this.findById(id, chuId);
    await this.demandeRepository.remove(demande);
  }
}