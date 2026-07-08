import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import {
  CloseHospitalisationEpisodeDto,
  CreateHospitalisationEpisodeDto,
  HospitalisationEpisodeQuery,
  UpdateHospitalisationStatusDto,
  AttributeLitDto,
  UpdateExeatableDto,
} from './hospitalisation.dto';
import { HospitalisationService } from './hospitalisation.service';
​
@ApiTags('Hospitalisation')
@Controller('hospitalisations')
export class HospitalisationController {
  constructor(private readonly hospitalisationService: HospitalisationService) {}
​
  @Post()
  @ApiOperation({
    summary: 'Creer un episode d hospitalisation',
    description: 'Un episode est rattache a un patient et un service. Le lit doit etre disponible si fourni.',
  })
  @ApiBody({
    schema: {
      example: {
        patientId: 'patient-123',
        serviceId: 'service-123',
        motifAdmission: 'Observation clinique',
        createdBy: 'agent-45',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Episode cree', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 400, description: 'Donnees invalides ou lit indisponible' })
  @ApiResponse({ status: 404, description: 'Lit introuvable ou patient inconnu' })
  createEpisode(@Body() body: CreateHospitalisationEpisodeDto) {
    return this.hospitalisationService.createEpisode(body);
  }
​
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
​
  // [Ajout requete UI] Persiste l'etat "exeatable" d'un episode (toggle carte lit).
  // Survit au rafraichissement et a la deconnexion.
  @Patch(':id/exeatable')
  updateExeatable(@Param('id') id: string, @Body() body: UpdateExeatableDto) {
    return this.hospitalisationService.updateExeatable(id, body);
  }
​
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
​
  @Patch('assign-lit')
  @ApiOperation({
    summary: 'Attribuer un lit a un patient',
    description: 'Attribution d\'un lit disponible pour un patient hospitalise dans un service.',
  })
  @ApiBody({
    schema: {
      example: {
        chuId: 'chu-01',
        serviceId: 'service-123',
        patientId: 'patient-123',
        litId: 'lit-CHU-Andr-2026-chambre-CHU-Andr-2026-service-123-101-A1',
        updatedBy: 'agent-45',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Lit attribue', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 404, description: 'Episode ou lit introuvable' })
  @ApiResponse({ status: 400, description: 'Donnees invalides ou lit indisponible' })
  assignLit(@Body() body: AttributeLitDto) {
    return this.hospitalisationService.assignLit(body);
  }
​
  @Get('stats')
  @ApiOperation({
    summary: 'Statistiques des hospitalisations',
    description: 'Retourne le total des patients hospitalises actifs et les nouvelles admissions du jour pour un CHU.',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiResponse({ status: 200, description: 'Statistiques retournees' })
  @ApiResponse({ status: 400, description: 'chuId obligatoire' })
  getStats(@Query('chuId') chuId?: string) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.hospitalisationService.getStats(chuId);
  }
​
  @Get('actives')
  @ApiOperation({
    summary: 'Lister les episodes actifs',
    description: 'Retourne les episodes en statut ADMIS, EN_COURS ou TRANSFERE avec limit optionnel.',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Episodes actifs', type: HospitalisationEpisodeEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'chuId obligatoire' })
  getActives(
    @Query('chuId') chuId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.hospitalisationService.getActives(chuId, serviceId, limit);
  }
​
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
​
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
​