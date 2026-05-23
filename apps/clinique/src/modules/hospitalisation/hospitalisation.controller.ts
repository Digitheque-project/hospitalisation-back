import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import {
  CloseHospitalisationEpisodeDto,
  CreateHospitalisationEpisodeDto,
  HospitalisationEpisodeQuery,
  UpdateHospitalisationStatusDto,
} from './hospitalisation.dto';
import { HospitalisationService } from './hospitalisation.service';

@ApiTags('Hospitalisation')
@Controller('hospitalisations')
export class HospitalisationController {
  constructor(private readonly hospitalisationService: HospitalisationService) {}

  @Post()
  @ApiOperation({
    summary: 'Creer un episode d hospitalisation',
    description: 'Un episode est rattache a un patient et un service. Le lit doit etre disponible si fourni.',
  })
  @ApiBody({
    schema: {
      example: {
        patientId: 'patient-123',
        chuId: 'chu-01',
        serviceId: 'service-123',
        dateAdmission: '2026-05-22T10:00:00.000Z',
        motifAdmission: 'Observation clinique',
        createdBy: 'agent-45',
        litId: 'lit-CHU-Andr-2026-chambre-CHU-Andr-2026-service-123-101-A1',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Episode cree', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 400, description: 'Donnees invalides ou lit indisponible' })
  @ApiResponse({ status: 404, description: 'Lit introuvable ou patient inconnu' })
  createEpisode(@Body() body: CreateHospitalisationEpisodeDto) {
    return this.hospitalisationService.createEpisode(body);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Mettre a jour le statut de l episode',
    description: 'Les statuts de cloture liberent automatiquement le lit associe.',
  })
  @ApiParam({ name: 'id', description: 'Identifiant episode' })
  @ApiBody({
    schema: {
      example: {
        statut: 'EN_COURS',
        chuId: 'chu-01',
        updatedBy: 'agent-45',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Statut mis a jour', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 404, description: 'Episode introuvable' })
  updateStatus(@Param('id') id: string, @Body() body: UpdateHospitalisationStatusDto) {
    return this.hospitalisationService.updateStatus(id, body);
  }

  @Patch(':id/close')
  @ApiOperation({
    summary: 'Cloturer un episode d hospitalisation',
    description: 'La cloture positionne le statut final et libere le lit associe.',
  })
  @ApiParam({ name: 'id', description: 'Identifiant episode' })
  @ApiBody({
    schema: {
      example: {
        statutFinal: 'SORTIE',
        commentaireSortie: 'Sortie reguliere',
        chuId: 'chu-01',
        updatedBy: 'agent-45',
        dateSortie: '2026-05-23T09:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Episode cloture', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 404, description: 'Episode introuvable' })
  closeEpisode(@Param('id') id: string, @Body() body: CloseHospitalisationEpisodeDto) {
    return this.hospitalisationService.closeEpisode(id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperer un episode par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant episode' })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiResponse({ status: 200, description: 'Episode retourne', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 404, description: 'Episode introuvable' })
  getById(@Param('id') id: string, @Query('chuId') chuId?: string) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.hospitalisationService.findEpisodeById(id, chuId);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les episodes d hospitalisation',
    description: 'Le filtre serviceId est obligatoire. patientId et statut sont optionnels.',
  })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'statut', required: false })
  @ApiResponse({ status: 200, description: 'Liste des episodes', type: HospitalisationEpisodeEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'serviceId et chuId obligatoires' })
  listEpisodes(@Query() query: HospitalisationEpisodeQuery) {
    if (!query.serviceId || !query.chuId) {
      throw new BadRequestException('serviceId et chuId obligatoires');
    }
    return this.hospitalisationService.listEpisodes(query);
  }
}
