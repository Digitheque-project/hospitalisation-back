import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnostic } from './entities/diagnostic.entity';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';

@Injectable()
export class DiagnosticService {
  constructor(
    @InjectRepository(Diagnostic)
    private diagnosticRepo: Repository<Diagnostic>,
  ) {}

  async create(patientId: string, createDto: CreateDiagnosticDto): Promise<Diagnostic> {
    const diagnostic = this.diagnosticRepo.create({ patientId, ...createDto });
    return this.diagnosticRepo.save(diagnostic);
  }

  async findAllByPatient(patientId: string): Promise<Diagnostic[]> {
    return this.diagnosticRepo.find({ where: { patientId } });
  }

  async findActiveByPatient(patientId: string): Promise<Diagnostic[]> {
    return this.diagnosticRepo.find({ where: { patientId, actif: true } });
  }

  async findOne(id: string, patientId: string): Promise<Diagnostic | null> {
    return this.diagnosticRepo.findOne({ where: { id, patientId } });
  }

  async update(id: string, patientId: string, updateDto: UpdateDiagnosticDto): Promise<Diagnostic> {
    const diagnostic = await this.findOne(id, patientId);
    if (!diagnostic) {
      throw new NotFoundException(`Diagnostic avec id ${id} non trouvé`);
    }
    Object.assign(diagnostic, updateDto);
    return this.diagnosticRepo.save(diagnostic);
  }

  async remove(id: string, patientId: string): Promise<void> {
    const diagnostic = await this.findOne(id, patientId);
    if (diagnostic) {
      await this.diagnosticRepo.remove(diagnostic);
    }
  }
}
