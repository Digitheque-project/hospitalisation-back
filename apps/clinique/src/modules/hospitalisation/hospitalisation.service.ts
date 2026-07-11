import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
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
import { AccueilPatientApiService } from '../../infrastructure/http-clients/accueil-patient-api.service';
import { DossierPatientApiService } from '../../infrastructure/http-clients/dossier-patient-api.service';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';
import { buildEpisodeId } from '../../common/utils/ids';
​
@Injectable()
export class HospitalisationService {
  constructor(
    @InjectRepository(HospitalisationEpisodeEntity)
    private readonly hospitalisationRepository: Repository<HospitalisationEpisodeEntity>,
    @InjectRepository(LitEntity)
    private readonly litRepository: Repository<LitEntity>,
    private readonly accueilPatientApi: AccueilPatientApiService,
    private readonly dossierPatientApi: DossierPatientApiService,
    private readonly kafkaService: KafkaService,
  ) {}
​
  async createEpisode(
    input: CreateHospitalisationEpisodeDto,
    chuId: string,
  ): Promise<HospitalisationEpisodeEntity> {
    await this.accueilPatientApi.ensurePatientExistsAtAccueil(input.patientId);
​
​
    const admissionDate = input.dateAdmission ? new Date(input.dateAdmission) : new Date();
​
    let lit: LitEntity | null = null;
    if (input.litId) {
      lit = await this.findAvailableLit(input.litId, input.serviceId, chuId);
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
      serviceId: input.serviceId,
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
      serviceId: saved.serviceId,
      dateAdmission: saved.dateAdmission.toISOString(),
      statut: saved.statut,
      createdBy: saved.createdBy,
      litId: saved.litId ?? null,
      litCode: saved.litCode ?? null,
    });
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
      serviceId: saved.serviceId,
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
      serviceId: saved.serviceId,
      patientId: saved.patientId,
      episodeId: saved.id,
    });
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
    where.serviceId = query.serviceId;
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
  async getStats(chuId: string, serviceId?: string): Promise<{
    hospitalizedTotal: number;
    hospitalizedNewToday: number;
  }> {
    const activeStatuts = this.activeStatuses();
​
    const [total, newToday] = await Promise.all([
      this.hospitalisationRepository.count({
        where: { chuId, statut: In(activeStatuts), ...(serviceId ? { serviceId } : {}) },
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
            serviceId ? 'ep."serviceId" = :serviceId' : '1=1',
            serviceId ? { serviceId } : {},
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
    serviceId?: string,
    limit = 50,
  ): Promise<HospitalisationEpisodeEntity[]> {
    const where: FindOptionsWhere<HospitalisationEpisodeEntity> = {
      chuId,
      statut: In(this.activeStatuses()),
    };
    if (serviceId) {
      where.serviceId = serviceId;
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
    serviceId: string,
    chuId: string,
  ): Promise<HospitalisationEpisodeEntity | null> {
    return this.hospitalisationRepository.findOne({
      where: {
        patientId,
        serviceId,
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
      input.serviceId,
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
    const lit = await this.findAvailableLit(input.litId, input.serviceId, input.chuId);
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
      serviceId: saved.serviceId,
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
    return [
      StatutHospitalisation.TRANSFERE,
      StatutHospitalisation.SORTIE,
      StatutHospitalisation.DECEDE,
      StatutHospitalisation.EVADE,
    ].includes(statut);
  }
}
​