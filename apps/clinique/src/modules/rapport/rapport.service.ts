import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  RapportEntity,
  StatutRapport,
} from '../../domain/entities/rapport.entity';
import {
  HospitalisationEpisodeEntity,
  ModeSortie,
  StatutHospitalisation,
} from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity } from '../../domain/entities/lit.entity';
import {
  RapportListQuery,
  UpdateRapportDto,
  UpsertRapportDto,
} from './rapport.dto';
import {
  JOURS_SEMAINE,
  RapportHebdoData,
  RapportHebdoJour,
} from './rapport.types';

/** Duree de vie d'un brouillon abandonne (jamais finalise), en jours. */
const RAPPORT_DRAFT_TTL_DAYS = 30;

@Injectable()
export class RapportService {
  constructor(
    @InjectRepository(RapportEntity)
    private readonly rapportRepository: Repository<RapportEntity>,
    @InjectRepository(HospitalisationEpisodeEntity)
    private readonly hospitalisationRepository: Repository<HospitalisationEpisodeEntity>,
    @InjectRepository(LitEntity)
    private readonly litRepository: Repository<LitEntity>,
  ) {}

  /* ---------------------------------------------------------------------- */
  /*  CRUD rapports                                                         */
  /* ---------------------------------------------------------------------- */

  /** Cree un rapport (brouillon par defaut). Purge d'abord les brouillons expires. */
  async create(dto: UpsertRapportDto): Promise<RapportEntity> {
    await this.purgeExpiredDrafts().catch(() => undefined);

    const entity = this.rapportRepository.create({
      id: randomUUID(),
      chuId: dto.chuId,
      serviceId: dto.serviceId,
      title: dto.title,
      templateId: dto.templateId,
      periodType: dto.periodType,
      periodLabel: dto.periodLabel ?? null,
      dateFrom: dto.dateFrom ?? null,
      dateTo: dto.dateTo ?? null,
      statut: StatutRapport.BROUILLON,
      includeGraphiques: dto.includeGraphiques ?? false,
      content: dto.content ?? null,
      createdBy: dto.createdBy ?? null,
    });
    return this.rapportRepository.save(entity);
  }

  /** Met a jour un rapport (auto-save d'un brouillon, ou finalisation). */
  async update(id: string, dto: UpdateRapportDto): Promise<RapportEntity> {
    const rapport = await this.rapportRepository.findOne({ where: { id } });
    if (!rapport) {
      throw new NotFoundException('Rapport introuvable');
    }

    if (dto.title !== undefined) rapport.title = dto.title;
    if (dto.periodLabel !== undefined) rapport.periodLabel = dto.periodLabel;
    if (dto.dateFrom !== undefined) rapport.dateFrom = dto.dateFrom;
    if (dto.dateTo !== undefined) rapport.dateTo = dto.dateTo;
    if (dto.includeGraphiques !== undefined)
      rapport.includeGraphiques = dto.includeGraphiques;
    if (dto.content !== undefined) rapport.content = dto.content;

    if (dto.statut !== undefined && dto.statut !== rapport.statut) {
      rapport.statut = dto.statut;
      rapport.finalizedAt =
        dto.statut === StatutRapport.FINALISE ? new Date() : null;
    }

    return this.rapportRepository.save(rapport);
  }

  async findOne(id: string): Promise<RapportEntity> {
    const rapport = await this.rapportRepository.findOne({ where: { id } });
    if (!rapport) {
      throw new NotFoundException('Rapport introuvable');
    }
    return rapport;
  }

  /** Liste / historique des rapports d'un service. */
  async list(query: RapportListQuery): Promise<RapportEntity[]> {
    return this.rapportRepository.find({
      where: {
        chuId: query.chuId,
        serviceId: query.serviceId,
        ...(query.statut ? { statut: query.statut } : {}),
      },
      order: { updatedAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.rapportRepository.delete(id);
    return { id };
  }

  /** Supprime les brouillons non finalises plus vieux que le TTL. */
  async purgeExpiredDrafts(): Promise<number> {
    const limit = new Date();
    limit.setDate(limit.getDate() - RAPPORT_DRAFT_TTL_DAYS);
    const result = await this.rapportRepository
      .createQueryBuilder()
      .delete()
      .from(RapportEntity)
      .where('statut = :statut', { statut: StatutRapport.BROUILLON })
      .andWhere('"updatedAt" < :limit', { limit })
      .execute();
    return result.affected ?? 0;
  }

  /* ---------------------------------------------------------------------- */
  /*  Agregation hebdomadaire (auto-remplissage VOLET ACTIVITES)            */
  /* ---------------------------------------------------------------------- */

  async getHebdo(options: {
    chuId: string;
    serviceIdDest: string;
    from: string;
    to: string;
  }): Promise<RapportHebdoData> {
    const fromDate = this.startOfDay(new Date(options.from));
    const toDate = this.endOfDay(new Date(options.to));

    // Episodes potentiellement concernes : admis avant la fin de periode et
    // (toujours actifs OU sortis apres le debut de periode).
    const episodes = await this.hospitalisationRepository.find({
      where: { chuId: options.chuId, serviceIdDest: options.serviceIdDest },
    });

    const nbLits = await this.litRepository.count({
      where: { chuId: options.chuId },
    });

    const jours: RapportHebdoJour[] = [];
    for (
      let d = new Date(fromDate);
      d <= toDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayStart = this.startOfDay(new Date(d));
      const dayEnd = this.endOfDay(new Date(d));

      let nbAdmissions = 0;
      let existants = 0;
      let sortants = 0;
      let deces = 0;
      let sortiesContreAvis = 0;
      let consultationExterne = 0;

      for (const ep of episodes) {
        const adm = ep.dateAdmission ? new Date(ep.dateAdmission) : null;
        const sortie = ep.dateSortie ? new Date(ep.dateSortie) : null;

        if (adm && adm >= dayStart && adm <= dayEnd) {
          nbAdmissions += 1;
          if (ep.serviceIdSource) consultationExterne += 1;
        }
        if (sortie && sortie >= dayStart && sortie <= dayEnd) {
          sortants += 1;
          if (ep.statut === StatutHospitalisation.DECEDE) deces += 1;
          if (ep.modeSortie === ModeSortie.SORTIE_CONTRE_AVIS)
            sortiesContreAvis += 1;
        }
        // Present ce jour : admis avant la fin du jour et pas encore sorti
        // (ou sorti apres la fin du jour).
        if (adm && adm <= dayEnd && (!sortie || sortie > dayEnd)) {
          existants += 1;
        }
      }

      jours.push({
        date: this.toISODate(dayStart),
        libelle: JOURS_SEMAINE[dayStart.getDay()],
        nbAdmissions,
        existants,
        sortants,
        deces,
        sortiesContreAvis,
        consultationExterne,
      });
    }

    const totals = jours.reduce(
      (acc, j) => ({
        nbLits,
        nbAdmissions: acc.nbAdmissions + j.nbAdmissions,
        sortants: acc.sortants + j.sortants,
        deces: acc.deces + j.deces,
        sortiesContreAvis: acc.sortiesContreAvis + j.sortiesContreAvis,
        consultationExterne: acc.consultationExterne + j.consultationExterne,
      }),
      {
        nbLits,
        nbAdmissions: 0,
        sortants: 0,
        deces: 0,
        sortiesContreAvis: 0,
        consultationExterne: 0,
      },
    );

    return {
      from: options.from,
      to: options.to,
      nbLits,
      jours,
      totals,
    };
  }

  /* ---------------------------------------------------------------------- */
  /*  Helpers dates                                                         */
  /* ---------------------------------------------------------------------- */

  private startOfDay(d: Date): Date {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private endOfDay(d: Date): Date {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy;
  }

  private toISODate(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
