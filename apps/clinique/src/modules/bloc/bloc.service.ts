import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VpaService } from '../vpa/vpa.service';
import { VpaStatus } from '../vpa/vpa.entity';
import { BlocOperatoireEntity } from './bloc.entity';
import { PlanifierBlocInput } from './planifier-bloc.input';

@Injectable()
export class BlocService {
  constructor(
    @InjectRepository(BlocOperatoireEntity)
    private readonly blocRepository: Repository<BlocOperatoireEntity>,
    private readonly vpaService: VpaService,
  ) {}

  async planifier(input: PlanifierBlocInput): Promise<BlocOperatoireEntity> {
    const vpa = await this.vpaService.findById(input.vpaId);
    if (!vpa) {
      throw new NotFoundException('VPA referencee introuvable');
    }

    if (vpa.status !== VpaStatus.VALIDEE) {
      throw new UnprocessableEntityException(
        'Planification Bloc interdite tant que la VPA n\'est pas VALIDEE',
      );
    }

    const bloc = this.blocRepository.create(input);
    return this.blocRepository.save(bloc);
  }

  async findLatestByPatient(patientId: string): Promise<BlocOperatoireEntity | null> {
    return this.blocRepository.findOne({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }
}
