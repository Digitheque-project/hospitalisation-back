import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HistoriqueService } from './historique.service';
import { CreateHistoriqueDto } from './dto/create-historique.dto';

@Controller('patients/:patientId/historique')
export class HistoriqueController {
  constructor(private readonly service: HistoriqueService) {}

  @Post()
  create(@Param('patientId') patientId: string, @Body() createDto: CreateHistoriqueDto) {
    return this.service.create({ ...createDto, patientId });
  }

  @Get()
  findAll(@Param('patientId') patientId: string) {
    return this.service.findAllByPatient(patientId);
  }
}
