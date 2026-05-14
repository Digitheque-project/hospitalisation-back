import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrOperatoire } from './cr-operatoire.entity';

@Injectable()
export class CrOperatoireService {
  constructor(
    @InjectRepository(CrOperatoire)
    private repo: Repository<CrOperatoire>,
  ) {}

  async findByPatient(patientId: string): Promise<CrOperatoire[]> {
    return this.repo.find({ where: { patientId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<CrOperatoire> {
    const cr = await this.repo.findOne({ where: { id } });
    if (!cr) throw new NotFoundException('CR opératoire introuvable');
    return cr;
  }

  async create(patientId: string, data: Partial<CrOperatoire>): Promise<CrOperatoire> {
    const cr = this.repo.create({ ...data, patientId, statut: 'PLANIFIE' });
    return this.repo.save(cr);
  }

  async update(id: string, data: Partial<CrOperatoire>): Promise<CrOperatoire> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
