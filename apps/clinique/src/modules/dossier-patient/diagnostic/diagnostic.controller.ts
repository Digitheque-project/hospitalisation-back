import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiagnosticService } from './diagnostic.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';

@ApiTags('Diagnostics')
@Controller('patients/:patientId/diagnostics')
export class DiagnosticController {
  constructor(private readonly service: DiagnosticService) {}

  @Get()
  @ApiOperation({ summary: 'Tous les diagnostics du patient' })
  findAll(@Param('patientId') patientId: string) {
    return this.service.findAllByPatient(patientId);
  }

  @Get('actif')
  @ApiOperation({ summary: 'Diagnostic actif' })
  findActive(@Param('patientId') patientId: string) {
    return this.service.findActiveByPatient(patientId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un diagnostic' })
  create(@Param('patientId') patientId: string, @Body() dto: CreateDiagnosticDto) {
    return this.service.create(patientId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un diagnostic' })
  update(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: CreateDiagnosticDto,
  ) {
    return this.service.update(patientId, id, dto);
  }
}
