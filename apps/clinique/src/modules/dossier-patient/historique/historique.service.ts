import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historique } from './entities/historique.entity';
import { CreateHistoriqueDto } from './dto/create-historique.dto';

@Injectable()
export class HistoriqueService {
  constructor(
    @InjectRepository(Historique)
    private historiqueRepo: Repository<Historique>,
  ) {}

  async create(createDto: CreateHistoriqueDto): Promise<Historique> {
    const entry = this.historiqueRepo.create(createDto);
    return this.historiqueRepo.save(entry);
  }

  async findAllByPatient(patientId: string): Promise<Historique[]> {
    return this.historiqueRepo.find({
      where: { patientId },
      order: { dateAction: 'DESC' },
    });
  }
}
