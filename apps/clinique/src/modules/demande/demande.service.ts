import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DemandeEntity, StatutDemande } from '../../domain/entities/demande.entity';
import { CreateDemandeDto, UpdateDemandeDto, DemandeQuery } from './demande.dto';
import { buildEpisodeId } from '../../common/utils/ids';

@Injectable()
export class DemandeService {
  constructor(
    @InjectRepository(DemandeEntity)
    private readonly demandeRepository: Repository<DemandeEntity>,
  ) {}

  async create(input: CreateDemandeDto): Promise<DemandeEntity> {
    const entity = this.demandeRepository.create({
      id: buildEpisodeId({
        chuId: input.chuId,
        dateAdmission: new Date(),
      }),
      motif: input.motif,
      patientId: input.patientId,
      serviceId: input.serviceId,
      chuId: input.chuId,
      statut: StatutDemande.EN_ATTENTE,
      infoComplementaire: input.infoComplementaire ?? null,
      createdBy: input.createdBy,
    });

    return this.demandeRepository.save(entity);
  }

  async findById(id: string, chuId?: string): Promise<DemandeEntity> {
    const where: FindOptionsWhere<DemandeEntity> = chuId ? { id, chuId } : { id };
    const demande = await this.demandeRepository.findOne({ where });
    if (!demande) {
      throw new NotFoundException('Demande introuvable');
    }
    return demande;
  }

  async findAll(query: DemandeQuery): Promise<DemandeEntity[]> {
    const where: FindOptionsWhere<DemandeEntity> = {};
    if (query.chuId) {
      where.chuId = query.chuId;
    }
    if (query.serviceId) {
      where.serviceId = query.serviceId;
    }
    if (query.patientId) {
      where.patientId = query.patientId;
    }
    if (query.statut) {
      where.statut = query.statut;
    }

    return this.demandeRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, input: UpdateDemandeDto, chuId?: string): Promise<DemandeEntity> {
    const demande = await this.findById(id, chuId);

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

    return this.demandeRepository.save(demande);
  }

  async delete(id: string, chuId?: string): Promise<void> {
    const demande = await this.findById(id, chuId);
    await this.demandeRepository.remove(demande);
  }
}
