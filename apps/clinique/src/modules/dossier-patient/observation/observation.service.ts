import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from './entities/observation.entity';
import { UpdateObservationDto } from './dto/update-observation.dto';

@Injectable()
export class ObservationService {
  constructor(
    @InjectRepository(Observation)
    private observationRepo: Repository<Observation>,
  ) {}

  async getByPatient(patientId: string): Promise<Observation> {
    let observation = await this.observationRepo.findOne({ where: { patientId } });
    if (!observation) {
      observation = this.observationRepo.create({ patientId, data: {}, statut: 'brouillon' });
      await this.observationRepo.save(observation);
    }
    return observation;
  }

  async upsert(patientId: string, updateDto: UpdateObservationDto): Promise<Observation> {
    let observation = await this.observationRepo.findOne({ where: { patientId } });
    if (!observation) {
      observation = this.observationRepo.create({ patientId, ...updateDto });
    } else {
      Object.assign(observation, updateDto);
    }
    return this.observationRepo.save(observation);
  }
}
