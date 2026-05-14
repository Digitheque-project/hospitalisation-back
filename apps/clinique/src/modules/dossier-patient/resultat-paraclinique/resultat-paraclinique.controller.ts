import { Controller, Get, Post, Put, Delete, Patch, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ResultatParacliniqueService } from './resultat-paraclinique.service';
import { CreateResultatParacliniqueDto } from './dto/create-resultat-paraclinique.dto';
import { UpdateResultatParacliniqueDto } from './dto/update-resultat-paraclinique.dto';

@Controller('patients/:patientId/resultats')
export class ResultatParacliniqueController {
  constructor(private readonly service: ResultatParacliniqueService) {}

  @Post()
  create(@Param('patientId') patientId: string, @Body() createDto: CreateResultatParacliniqueDto) {
    return this.service.create({ ...createDto, patientId });
  }

  @Get()
  findAll(@Param('patientId') patientId: string) {
    return this.service.findAllByPatient(patientId);
  }

  @Get(':id')
  findOne(@Param('patientId') patientId: string, @Param('id') id: string) {
    return this.service.findOne(id, patientId);
  }

  @Put(':id')
  update(@Param('patientId') patientId: string, @Param('id') id: string, @Body() updateDto: UpdateResultatParacliniqueDto) {
    return this.service.update(id, patientId, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('patientId') patientId: string, @Param('id') id: string) {
    return this.service.remove(id, patientId);
  }

  @Patch(':id/lu')
  marquerLu(@Param('patientId') patientId: string, @Param('id') id: string) {
    return this.service.marquerLu(id, patientId);
  }
}
