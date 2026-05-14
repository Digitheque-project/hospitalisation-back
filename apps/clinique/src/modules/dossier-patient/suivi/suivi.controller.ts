import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SuiviService } from './suivi.service';
import { CreateSuiviDto } from './dto/create-suivi.dto';

@ApiTags('Suivi')
@Controller('patients/:patientId/suivis')
export class SuiviController {
  constructor(private readonly service: SuiviService) {}

  @Get()
  @ApiOperation({ summary: 'Toutes les observations de suivi' })
  findAll(@Param('patientId') patientId: string) {
    return this.service.findAllByPatient(patientId);
  }

  @Post()
  @ApiOperation({ summary: 'Ajouter une observation de suivi' })
  create(@Param('patientId') patientId: string, @Body() dto: CreateSuiviDto) {
    return this.service.create(patientId, dto);
  }
}
