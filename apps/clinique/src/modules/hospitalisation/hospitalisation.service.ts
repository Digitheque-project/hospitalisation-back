import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HospitalisationEpisodeEntity, StatutHospitalisation } from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity, StatutLit } from '../../domain/entities/lit.entity';
import {
  CloseHospitalisationEpisodeDto,
  CreateHospitalisationEpisodeDto,
  HospitalisationEpisodeQuery,
  UpdateHospitalisationStatusDto,
} from './hospitalisation.dto';
import { AccueilPatientApiService } from '../../infrastructure/http-clients/accueil-patient-api.service';
import { ServiceChuApiService } from '../../infrastructure/http-clients/service-chu-api.service';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';
import { buildEpisodeId } from '../../common/utils/ids';

@Injectable()
export class HospitalisationService {
  constructor(
    @InjectRepository(HospitalisationEpisodeEntity)
    private readonly hospitalisationRepository: Repository<HospitalisationEpisodeEntity>,
    @InjectRepository(LitEntity)
    private readonly litRepository: Repository<LitEntity>,
    private readonly accueilPatientApi: AccueilPatientApiService,
    private readonly serviceChuApi: ServiceChuApiService,
    private readonly kafkaService: KafkaService,
  ) {}

  async createEpisode(
    input: CreateHospitalisationEpisodeDto,
  ): Promise<HospitalisationEpisodeEntity> {
    await this.accueilPatientApi.ensurePatientExistsAtAccueil(input.patientId);

    const serviceInfo = await this.serviceChuApi.getServiceById(input.serviceId);
    const chuId = serviceInfo.chuId;

    const admissionDate = input.dateAdmission ? new Date(input.dateAdmission) : new Date();

    let lit: LitEntity | null = null;
    if (input.litId) {
      lit = await this.findAvailableLit(input.litId, input.serviceId, chuId);
      lit.statut = StatutLit.OCCUPE;
      await this.litRepository.save(lit);
    }

    const entity = this.hospitalisationRepository.create({
      id: buildEpisodeId({
        chuId,
        dateAdmission: admissionDate,
      }),
      patientId: input.patientId,
      chuId,
      serviceId: input.serviceId,
      dateAdmission: admissionDate,
      motifAdmission: input.motifAdmission ?? null,
      createdBy: input.createdBy,
      litId: lit?.id ?? null,
      litCode: lit?.codeLit ?? null,
      statut: StatutHospitalisation.ADMIS,
    });

    const saved = await this.hospitalisationRepository.save(entity);

    await this.kafkaService.emit('hospitalisation.episode.created', {
      id: saved.id,
      patientId: saved.patientId,
      chuId: saved.chuId,
      serviceId: saved.serviceId,
      dateAdmission: saved.dateAdmission.toISOString(),
      statut: saved.statut,
      createdBy: saved.createdBy,
      litId: saved.litId ?? null,
      litCode: saved.litCode ?? null,
    });

    return saved;
  }

  async updateStatus(
    id: string,
    input: UpdateHospitalisationStatusDto,
  ): Promise<HospitalisationEpisodeEntity> {
    const episode = await this.findEpisodeById(id, input.chuId);
    episode.statut = input.statut;
    episode.updatedBy = input.updatedBy;

    if (this.isClosedStatus(input.statut)) {
      episode.dateSortie = episode.dateSortie ?? new Date();
      await this.releaseLitIfNeeded(episode.litId);
    }

    const saved = await this.hospitalisationRepository.save(episode);

    await this.kafkaService.emit('hospitalisation.episode.status.updated', {
      id: saved.id,
      chuId: saved.chuId,
      statut: saved.statut,
      updatedBy: saved.updatedBy ?? null,
      dateSortie: saved.dateSortie ? saved.dateSortie.toISOString() : null,
    });

    return saved;
  }

  async closeEpisode(
    id: string,
    input: CloseHospitalisationEpisodeDto,
  ): Promise<HospitalisationEpisodeEntity> {
    const episode = await this.findEpisodeById(id, input.chuId);

    const finalStatus = input.statutFinal ?? StatutHospitalisation.SORTIE;
    episode.statut = finalStatus;
    episode.updatedBy = input.updatedBy;
    episode.commentaireSortie = input.commentaireSortie ?? null;
    episode.dateSortie = input.dateSortie ? new Date(input.dateSortie) : new Date();

    await this.releaseLitIfNeeded(episode.litId);

    const saved = await this.hospitalisationRepository.save(episode);

    await this.kafkaService.emit('hospitalisation.episode.closed', {
      id: saved.id,
      chuId: saved.chuId,
      statut: saved.statut,
      updatedBy: saved.updatedBy ?? null,
      dateSortie: saved.dateSortie ? saved.dateSortie.toISOString() : null,
      commentaireSortie: saved.commentaireSortie ?? null,
    });

    return saved;
  }

  async findEpisodeById(id: string, chuId?: string): Promise<HospitalisationEpisodeEntity> {
    if (chuId) {
      await this.serviceChuApi.ensureChuExists(chuId);
    }
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

  async listEpisodes(query: HospitalisationEpisodeQuery): Promise<HospitalisationEpisodeEntity[]> {
    await this.serviceChuApi.ensureChuExists(query.chuId);

    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = {};
    where.serviceId = query.serviceId;
    where.chuId = query.chuId;
    if (query.patientId) {
      where.patientId = query.patientId;
    }
    if (query.statut) {
      where.statut = query.statut;
    }

    const episodes = await this.hospitalisationRepository.find({
      where,
      order: { dateAdmission: 'DESC' },
    });

    for (const episode of episodes) {
      const patientInfo = await this.accueilPatientApi.getPatientById(episode.patientId);
      if (patientInfo) {
        episode.patient = patientInfo;
      }
    }

    return episodes;
  }

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

  private async releaseLitIfNeeded(litId?: string | null): Promise<void> {
    if (!litId) {
      return;
    }
    const lit = await this.litRepository.findOne({ where: { id: litId } });
    if (!lit) {
      return;
    }
    lit.statut = StatutLit.DISPONIBLE;
    await this.litRepository.save(lit);
  }

  private isClosedStatus(statut: StatutHospitalisation): boolean {
    return [
      StatutHospitalisation.SORTIE,
      StatutHospitalisation.DECEDE,
      StatutHospitalisation.EVADE,
    ].includes(statut);
  }
}
