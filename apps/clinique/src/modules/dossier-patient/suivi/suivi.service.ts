import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suivi } from './suivi.entity';
import { CreateSuiviDto } from './dto/create-suivi.dto';

@Injectable()
export class SuiviService {
  constructor(
    @InjectRepository(Suivi)
    private readonly repo: Repository<Suivi>,
  ) {}

  async findAllByPatient(patientId: string): Promise<Suivi[]> {
    return this.repo.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(patientId: string, dto: CreateSuiviDto): Promise<Suivi> {
    const suivi = this.repo.create({ patientId, ...dto });
    return this.repo.save(suivi);
  }
}
