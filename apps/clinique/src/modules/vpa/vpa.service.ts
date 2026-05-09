import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CpaService } from '../cpa/cpa.service';
import { CpaStatus } from '../cpa/cpa.entity';
import { CreateVpaInput } from './create-vpa.input';
import { VpaEntity, VpaStatus } from './vpa.entity';

@Injectable()
export class VpaService {
  constructor(
    @InjectRepository(VpaEntity)
    private readonly vpaRepository: Repository<VpaEntity>,
    private readonly cpaService: CpaService,
  ) {}

  async create(input: CreateVpaInput): Promise<VpaEntity> {
    const cpa = await this.cpaService.findById(input.cpaId);
    if (!cpa) {
      throw new NotFoundException('CPA referencee introuvable');
    }

    if (cpa.status !== CpaStatus.REALISE) {
      throw new UnprocessableEntityException(
        'VPA interdite tant que la CPA n\'est pas REALISEE',
      );
    }

    const vpa = this.vpaRepository.create({
      patientId: input.patientId,
      cpaId: input.cpaId,
      status: VpaStatus.EN_ATTENTE,
    });

    return this.vpaRepository.save(vpa);
  }

  async validate(id: string): Promise<VpaEntity> {
    const vpa = await this.vpaRepository.findOne({ where: { id } });
    if (!vpa) {
      throw new NotFoundException('VPA introuvable');
    }

    vpa.status = VpaStatus.VALIDEE;
    return this.vpaRepository.save(vpa);
  }

  async findById(id: string): Promise<VpaEntity | null> {
    return this.vpaRepository.findOne({ where: { id } });
  }

  async findLatestByPatient(patientId: string): Promise<VpaEntity | null> {
    return this.vpaRepository.findOne({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }
}
