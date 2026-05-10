import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalisationService } from '../hospitalisation/hospitalisation.service';
import { CpaEntity, CpaStatus } from './cpa.entity';
import { CreateCpaInput } from './create-cpa.input';

@Injectable()
export class CpaService {
  constructor(
    @InjectRepository(CpaEntity)
    private readonly cpaRepository: Repository<CpaEntity>,
    private readonly hospitalisationService: HospitalisationService,
  ) {}

  async create(input: CreateCpaInput): Promise<CpaEntity> {
    await this.hospitalisationService.assertHospitalisationExists(input.hospitalisationId);
    const cpa = this.cpaRepository.create({
      patientId: input.patientId,
      hospitalisationId: input.hospitalisationId,
      asaScore: input.asaScore,
      status: CpaStatus.PLANIFIE,
    });
    return this.cpaRepository.save(cpa);
  }

  async markAsRealise(id: string): Promise<CpaEntity> {
    const cpa = await this.cpaRepository.findOne({ where: { id } });
    if (!cpa) {
      throw new NotFoundException('CPA introuvable');
    }

    cpa.status = CpaStatus.REALISE;
    return this.cpaRepository.save(cpa);
  }

  async findLatestByPatient(patientId: string): Promise<CpaEntity | null> {
    return this.cpaRepository.findOne({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CpaEntity | null> {
    return this.cpaRepository.findOne({ where: { id } });
  }
}
