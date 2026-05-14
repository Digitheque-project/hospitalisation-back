import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultatParaclinique, StatutResultat } from './entities/resultat-paraclinique.entity';
import { CreateResultatParacliniqueDto } from './dto/create-resultat-paraclinique.dto';
import { UpdateResultatParacliniqueDto } from './dto/update-resultat-paraclinique.dto';

@Injectable()
export class ResultatParacliniqueService {
  constructor(
    @InjectRepository(ResultatParaclinique)
    private resultatRepo: Repository<ResultatParaclinique>,
  ) {}

  async create(createDto: CreateResultatParacliniqueDto): Promise<ResultatParaclinique> {
    const newResultat = this.resultatRepo.create({
      ...createDto,
      statut: createDto.statut || StatutResultat.DEMANDE,
    });
    return this.resultatRepo.save(newResultat);
  }

  async findAllByPatient(patientId: string): Promise<ResultatParaclinique[]> {
    return this.resultatRepo.find({
      where: { patientId },
      order: { dateDemande: 'DESC' },
    });
  }

  async findOne(id: string, patientId: string): Promise<ResultatParaclinique> {
    const resultat = await this.resultatRepo.findOne({ where: { id, patientId } });
    if (!resultat) {
      throw new NotFoundException(`Résultat paraclinique avec id ${id} non trouvé pour ce patient`);
    }
    return resultat;
  }

  async update(id: string, patientId: string, updateDto: UpdateResultatParacliniqueDto): Promise<ResultatParaclinique> {
    const resultat = await this.findOne(id, patientId);
    Object.assign(resultat, updateDto);
    return this.resultatRepo.save(resultat);
  }

  async remove(id: string, patientId: string): Promise<void> {
    const resultat = await this.findOne(id, patientId);
    await this.resultatRepo.remove(resultat);
  }

  async marquerLu(id: string, patientId: string): Promise<ResultatParaclinique> {
    const resultat = await this.findOne(id, patientId);
    resultat.statut = StatutResultat.LU;
    return this.resultatRepo.save(resultat);
  }
}
