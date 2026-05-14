import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CrOperatoireService } from './cr-operatoire.service';
import { CrOperatoire } from './cr-operatoire.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CR Opératoire')
@Controller('patients/:patientId/cr-operatoire')
export class CrOperatoireController {
  constructor(private readonly service: CrOperatoireService) {}

  @Get()
  findAll(@Param('patientId') patientId: string) {
    return this.service.findByPatient(patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Param('patientId') patientId: string, @Body() body: Partial<CrOperatoire>) {
    return this.service.create(patientId, body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<CrOperatoire>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
