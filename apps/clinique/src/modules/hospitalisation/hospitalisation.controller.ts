import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HospitalisationEpisodeEntity,
  ModeSortie,
  StatutHospitalisation,
} from '../../domain/entities/hospitalisation-episode.entity';
import {
  CloseHospitalisationEpisodeDto,
  CreateHospitalisationEpisodeDto,
  HospitalisationEpisodeQuery,
  UpdateHospitalisationStatusDto,
  UpdateExeatableDto,
  AttributeLitDto,
} from './hospitalisation.dto';
import { HospitalisationService } from './hospitalisation.service';
import { Permissions } from '../../common/auth/decorators/permissions.decorator';
​
@ApiTags('Hospitalisation')
@Controller('hospitalisations')
export class HospitalisationController {
  constructor(private readonly hospitalisationService: HospitalisationService) {}
​
  @Post()
  @Permissions('hospitalisation:create')
  @ApiOperation({
    summary: 'Creer un episode d hospitalisation',
    description: 'Un episode est rattache a un patient et un service. Le lit doit etre disponible si fourni.',
  })
  @ApiBody({
    schema: {
      example: {
        patientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        serviceIdDest: '75f995a2-40e9-4285-84e4-a72501d37bfd',
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
        motifAdmission: 'Observation clinique',
        createdBy: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Episode cree', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 400, description: 'Donnees invalides ou lit indisponible' })
  @ApiResponse({ status: 404, description: 'Lit introuvable ou patient inconnu' })
  createEpisode(@Body() body: CreateHospitalisationEpisodeDto) {
    return this.hospitalisationService.createEpisode(body, body.chuId);
  }
​
  @Patch(':id/status')
  @Permissions('hospitalisation:update')
  @ApiOperation({
    summary: 'Mettre a jour le statut de l episode',
    description: 'Cette route est reservee aux statuts non cloturants. Utiliser /close pour une sortie.',
  })
  @ApiParam({ name: 'id', description: 'Identifiant episode' })
  @ApiBody({
    schema: {
      example: {
        statut: 'EN_COURS',
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
        updatedBy: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Statut mis a jour', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 404, description: 'Episode introuvable' })
  updateStatus(@Param('id') id: string, @Body() body: UpdateHospitalisationStatusDto) {
    return this.hospitalisationService.updateStatus(id, body);
  }
​
  @Patch(':id/exeatable')
  @Permissions('hospitalisation:update')
  @ApiOperation({
    summary: "Persister l'etat exeatable d'un episode",
    description: "Met a jour le drapeau exeatable (toggle du plan des lits, front clinique).",
  })
  @ApiParam({ name: 'id', description: 'Identifiant episode' })
  @ApiBody({
    schema: {
      example: {
        exeatable: true,
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Etat exeatable mis a jour', type: HospitalisationEpisodeEntity })
  @ApiResponse({ status: 404, description: 'Episode introuvable' })
  updateExeatable(@Param('id') id: string, @Body() body: UpdateExeatableDto) {
    return this.hospitalisationService.setExeatable(id, body);
  }
​
  @Patch(':id/close')
  @Permissions('hospitalisation:close')
  @ApiOperation({
    summary: 'Cloturer un episode d hospitalisation',
    description: 'La cloture valide la sortie effective, renseigne les donnees medicales/administratives, archive le dossier et passe le lit a A_NETTOYER.',
  })
  @ApiParam({ name: 'id', description: 'Identifiant episode' })
  @ApiBody({
    schema: {
      example: {
        statutFinal: 'SORTIE',
        commentaireSortie: 'Sortie reguliere',
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
        updatedBy: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909',
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
  @Permissions('hospitalisation:update')
  @ApiOperation({
    summary: 'Attribuer un lit a un patient',
    description: 'Attribution d\'un lit disponible pour un patient hospitalise dans un service.',
  })
  @ApiBody({
    schema: {
      example: {
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
        serviceIdDest: '75f995a2-40e9-4285-84e4-a72501d37bfd',
        patientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        litId: 'lit-CHU-Andr-2026-chambre-CHU-Andr-2026-service-123-101-A1',
        updatedBy: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909',
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
  @Permissions('hospitalisation:read')
  @ApiOperation({
    summary: 'Statistiques des hospitalisations',
    description: 'Retourne le total des patients hospitalises actifs et les nouvelles admissions du jour pour un CHU.',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'serviceIdDest', required: false })
  @ApiResponse({ status: 200, description: 'Statistiques retournees' })
  @ApiResponse({ status: 400, description: 'chuId obligatoire' })
  getStats(
    @Query('chuId') chuId?: string,
    @Query('serviceIdDest') serviceIdDest?: string,
  ) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.hospitalisationService.getStats(chuId, serviceIdDest);
  }
​
  @Get('actives')
  @Permissions('hospitalisation:read')
  @ApiOperation({
    summary: 'Lister les episodes actifs',
    description: 'Retourne les episodes en statut ADMIS, EN_COURS ou TRANSFERE avec limit optionnel.',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'serviceIdDest', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Episodes actifs', type: HospitalisationEpisodeEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'chuId obligatoire' })
  getActives(
    @Query('chuId') chuId?: string,
    @Query('serviceIdDest') serviceIdDest?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.hospitalisationService.getActives(chuId, serviceIdDest, limit);
  }
​
  @Get('archives')
  @Permissions('hospitalisation:read')
  @ApiOperation({
    summary: 'Archive du service (episodes clotures)',
    description:
      'Liste paginee des hospitalisations cloturees (SORTIE, TRANSFERE, DECEDE, EVADE) du service, avec recherche plein-texte, filtres statut/mode/date et statistiques.',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'serviceIdDest', required: true })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'statut', required: false, enum: StatutHospitalisation })
  @ApiQuery({ name: 'modeSortie', required: false, enum: ModeSortie })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Borne basse sur la date de sortie (ISO ou AAAA-MM-JJ)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'Borne haute sur la date de sortie (ISO ou AAAA-MM-JJ)',
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiResponse({ status: 200, description: 'Archive paginee retournee' })
  @ApiResponse({ status: 400, description: 'chuId et serviceId obligatoires' })
  getArchives(
    @Query('chuId') chuId?: string,
    @Query('serviceIdDest') serviceIdDest?: string,
    @Query('search') search?: string,
    @Query('statut') statut?: string,
    @Query('modeSortie') modeSortie?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    if (!chuId || !serviceIdDest) {
      throw new BadRequestException('chuId et serviceId obligatoires');
    }
    return this.hospitalisationService.getArchives({
      chuId,
      serviceIdDest,
      search,
      statut,
      modeSortie,
      from,
      to,
      limit,
      offset,
    });
  }

  @Get(':id')
  @Permissions('hospitalisation:read')
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
  @Permissions('hospitalisation:read')
  @ApiOperation({
    summary: 'Lister les episodes d hospitalisation',
    description: 'Le filtre serviceId est obligatoire. patientId et statut sont optionnels.',
  })
  @ApiQuery({ name: 'serviceIdDest', required: true })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'statut', required: false })
  @ApiResponse({ status: 200, description: 'Liste des episodes', type: HospitalisationEpisodeEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'serviceId et chuId obligatoires' })
  listEpisodes(@Query() query: HospitalisationEpisodeQuery) {
    if (!query.serviceIdDest || !query.chuId) {
      throw new BadRequestException('serviceId et chuId obligatoires');
    }
    return this.hospitalisationService.listEpisodes(query);
  }
}
​