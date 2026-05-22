import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { HospitalisationEpisodeEntity, StatutHospitalisation } from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity, StatutLit } from '../../domain/entities/lit.entity';
import { CreateLitsDto, PlanLitsQueryDto, UpdateLitDto } from './lit.dto';

@Injectable()
export class LitService {
  constructor(
    @InjectRepository(LitEntity)
    private readonly litRepository: Repository<LitEntity>,
    @InjectRepository(ChambreEntity)
    private readonly chambreRepository: Repository<ChambreEntity>,
    @InjectRepository(HospitalisationEpisodeEntity)
    private readonly hospitalisationRepository: Repository<HospitalisationEpisodeEntity>,
  ) {}

  async createLits(chambreId: string, input: CreateLitsDto): Promise<LitEntity[]> {
    const chambre = await this.chambreRepository.findOne({ where: { id: chambreId } });
    if (!chambre) {
      throw new NotFoundException('Chambre introuvable');
    }

    const entities = input.lits.map((lit) =>
      this.litRepository.create({
        chambreId: chambre.id,
        codeLit: lit.codeLit,
        statut: lit.statut ?? StatutLit.DISPONIBLE,
      }),
    );

    return this.litRepository.save(entities);
  }

  async listLits(query: { chambreId?: string; serviceId?: string }): Promise<LitEntity[]> {
    if (!query.chambreId && !query.serviceId) {
      throw new BadRequestException('chambreId ou serviceId obligatoire');
    }

    if (query.chambreId) {
      return this.litRepository.find({
        where: { chambreId: query.chambreId },
        relations: ['chambre'],
        order: { codeLit: 'ASC' },
      });
    }

    return this.litRepository.find({
      where: { chambre: { serviceId: query.serviceId } },
      relations: ['chambre'],
      order: { codeLit: 'ASC' },
    });
  }

  async getLitById(id: string): Promise<LitEntity> {
    const lit = await this.litRepository.findOne({ where: { id }, relations: ['chambre'] });
    if (!lit) {
      throw new NotFoundException('Lit introuvable');
    }
    return lit;
  }

  async updateLit(id: string, input: UpdateLitDto): Promise<LitEntity> {
    const lit = await this.getLitById(id);

    if (input.codeLit !== undefined) {
      lit.codeLit = input.codeLit;
    }

    if (input.statut !== undefined) {
      await this.assertStatutChange(lit, input.statut);
      lit.statut = input.statut;
    }

    return this.litRepository.save(lit);
  }

  async planLits(query: PlanLitsQueryDto) {
    const chambres = await this.chambreRepository.find({
      where: { serviceId: query.serviceId },
      relations: ['lits'],
      order: { numeroChambre: 'ASC' },
    });

    const filtered = chambres.map((chambre) => ({
      chambreId: chambre.id,
      numeroChambre: chambre.numeroChambre,
      type: chambre.type,
      lits: (chambre.lits ?? [])
        .filter((lit) => (query.statutLit ? lit.statut === query.statutLit : true))
        .map((lit) => ({
          id: lit.id,
          codeLit: lit.codeLit,
          statut: lit.statut,
        })),
    }));

    return {
      serviceId: query.serviceId,
      chambres: filtered,
    };
  }

  private async assertStatutChange(lit: LitEntity, statut: StatutLit): Promise<void> {
    const activeStatuts = [
      StatutHospitalisation.ADMIS,
      StatutHospitalisation.EN_COURS,
      StatutHospitalisation.TRANSFERE,
    ];

    if (statut === StatutLit.OCCUPE) {
      const activeEpisode = await this.hospitalisationRepository.findOne({
        where: {
          litId: lit.id,
          statut: In(activeStatuts),
        },
      });
      if (!activeEpisode) {
        throw new BadRequestException(
          'Impossible de passer le lit en OCCUPE sans episode actif associe',
        );
      }
    }

    if (statut === StatutLit.DISPONIBLE) {
      const activeEpisode = await this.hospitalisationRepository.findOne({
        where: {
          litId: lit.id,
          statut: In(activeStatuts),
        },
      });
      if (activeEpisode) {
        throw new BadRequestException(
          'Impossible de passer le lit en DISPONIBLE tant qu un episode actif est associe',
        );
      }
    }
  }
}
