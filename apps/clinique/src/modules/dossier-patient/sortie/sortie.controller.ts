import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { SortieService } from './sortie.service';
import { Sortie } from './sortie.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sortie')
@Controller('patients/:patientId/sortie')
export class SortieController {
  constructor(private readonly service: SortieService) {}

  @Get()
  findAll(@Param('patientId') patientId: string) {
    return this.service.findByPatient(patientId);
  }

  @Post()
  upsert(@Param('patientId') patientId: string, @Body() body: Partial<Sortie>) {
    return this.service.upsert(patientId, body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Sortie>) {
    return this.service.update(id, body);
  }

  @Put(':id/valider')
  valider(@Param('id') id: string, @Body() body: { signatureData: string }) {
    return this.service.valider(id, body.signatureData);
  }
}
