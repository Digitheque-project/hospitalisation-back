import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { CreateChambreDto, UpdateChambreDto } from './chambre.dto';
import { buildChambreId } from '../../common/utils/ids';

@Injectable()
export class ChambreService {
  constructor(
    @InjectRepository(ChambreEntity)
    private readonly chambreRepository: Repository<ChambreEntity>,
  ) {}

  async createChambre(input: CreateChambreDto): Promise<ChambreEntity> {
    const chambre = this.chambreRepository.create({
      id: input.id ?? buildChambreId({
        numeroChambre: input.numeroChambre,
      }),
      serviceId: input.serviceId,
      chuId: input.chuId,
      numeroChambre: input.numeroChambre,
      type: input.type,
    });

    return this.chambreRepository.save(chambre);
  }

  async listChambres(serviceId: string, chuId: string): Promise<ChambreEntity[]> {
    return this.chambreRepository.find({
      where: { serviceId, chuId },
      order: { numeroChambre: 'ASC' },
    });
  }

  async getChambreById(id: string, chuId: string): Promise<ChambreEntity> {
    const chambre = await this.chambreRepository.findOne({
      where: { id, chuId },
      relations: ['lits'],
    });
    if (!chambre) {
      throw new NotFoundException('Chambre introuvable');
    }
    return chambre;
  }

  async updateChambre(id: string, input: UpdateChambreDto): Promise<ChambreEntity> {
    const chambre = await this.getChambreById(id, input.chuId);
    if (input.numeroChambre !== undefined) {
      chambre.numeroChambre = input.numeroChambre;
    }
    if (input.type !== undefined) {
      chambre.type = input.type;
    }
    return this.chambreRepository.save(chambre);
  }
}
