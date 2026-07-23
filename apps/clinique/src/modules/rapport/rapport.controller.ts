import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/auth/decorators/permissions.decorator';
import {
  RapportHebdoQuery,
  RapportListQuery,
  UpdateRapportDto,
  UpsertRapportDto,
} from './rapport.dto';
import { RapportService } from './rapport.service';
import { StatutRapport } from '../../domain/entities/rapport.entity';

@ApiTags('Rapport')
@Controller('rapports')
export class RapportController {
  constructor(private readonly rapportService: RapportService) {}

  @Get('hebdo')
  @Permissions('rapport:read')
  @ApiOperation({
    summary: 'Agregation hebdomadaire (auto-remplissage VOLET ACTIVITES)',
    description:
      'Calcule, par jour de la periode, les admissions, existants, sortants, deces, sorties contre avis et consultations externes a partir des episodes.',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'serviceIdDest', required: true })
  @ApiQuery({ name: 'from', required: true, example: '2026-06-08' })
  @ApiQuery({ name: 'to', required: true, example: '2026-06-14' })
  getHebdo(@Query() query: RapportHebdoQuery) {
    return this.rapportService.getHebdo({
      chuId: query.chuId,
      serviceIdDest: query.serviceIdDest,
      from: query.from,
      to: query.to,
    });
  }

  @Get()
  @Permissions('rapport:read')
  @ApiOperation({ summary: 'Liste / historique des rapports du service' })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'statut', required: false, enum: StatutRapport })
  list(@Query() query: RapportListQuery) {
    return this.rapportService.list(query);
  }

  @Get(':id')
  @Permissions('rapport:read')
  @ApiOperation({ summary: 'Charger un rapport' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.rapportService.findOne(id);
  }

  @Post()
  @Permissions('rapport:write')
  @ApiOperation({ summary: 'Creer un rapport (brouillon)' })
  create(@Body() body: UpsertRapportDto) {
    return this.rapportService.create(body);
  }

  @Patch(':id')
  @Permissions('rapport:write')
  @ApiOperation({
    summary: 'Mettre a jour un rapport (auto-save / finalisation)',
  })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() body: UpdateRapportDto) {
    return this.rapportService.update(id, body);
  }

  @Delete(':id')
  @Permissions('rapport:write')
  @ApiOperation({ summary: 'Supprimer un rapport (brouillon)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.rapportService.remove(id);
  }
}
