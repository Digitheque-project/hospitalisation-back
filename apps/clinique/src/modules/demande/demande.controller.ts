import { Body, Controller, Get, Param, Patch, Post, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DemandeEntity } from '../../domain/entities/demande.entity';
import { CreateDemandeDto, UpdateDemandeDto, DemandeQuery } from './demande.dto';
import { DemandeService } from './demande.service';
import { Permissions } from '../../common/auth/decorators/permissions.decorator';
​
@ApiTags('Demande')
@Controller('demandes')
export class DemandeController {
  constructor(private readonly demandeService: DemandeService) {}
​
  @Post()
  @Permissions('demande:create')
  @ApiOperation({
    summary: 'Créer une demande',
    description: 'Créer une nouvelle demande d\'hospitalisation avec motif, patient, service et CHU.',
  })
  @ApiBody({
    schema: {
      example: {
        motif: 'Demande d\'hospitalisation pour chirurgie',
        patientId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        serviceIdSource: '75f995a2-40e9-4285-84e4-a72501d37bfd',
        serviceIdDest: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
        infoComplementaire: 'Patient allergique aux pénicillines',
        createdBy: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Demande créée', type: DemandeEntity })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() body: CreateDemandeDto) {
    return this.demandeService.create(body);
  }
​
  @Get(':id')
  @Permissions('demande:read')
  @ApiOperation({ summary: 'Récupérer une demande par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant demande' })
  @ApiQuery({ name: 'chuId', required: false })
  @ApiResponse({ status: 200, description: 'Demande retournée', type: DemandeEntity })
  @ApiResponse({ status: 404, description: 'Demande introuvable' })
  findById(@Param('id') id: string, @Query('chuId') chuId?: string) {
    return this.demandeService.findById(id, chuId);
  }
​
  @Get()
  @Permissions('demande:read')
  @ApiOperation({
    summary: 'Lister les demandes',
    description: 'Filtrer par chuId, serviceIdSource, serviceIdDest, patientId et/ou statut. Tous les filtres sont optionnels.',
  })
  @ApiQuery({ name: 'chuId', required: false })
  @ApiQuery({ name: 'serviceIdSource', required: false })
  @ApiQuery({ name: 'serviceIdDest', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'statut', required: false })
  @ApiResponse({ status: 200, description: 'Liste des demandes', type: DemandeEntity, isArray: true })
  findAll(@Query() query: DemandeQuery) {
    return this.demandeService.findAll(query);
  }
​
  @Patch(':id')
  @Permissions('demande:update')
  @ApiOperation({
    summary: 'Mettre à jour une demande',
    description: 'Mettre à jour le motif, le statut ou les informations complémentaires d\'une demande.',
  })
  @ApiParam({ name: 'id', description: 'Identifiant demande' })
  @ApiQuery({ name: 'chuId', required: false })
  @ApiBody({
    schema: {
      example: {
        motif: 'Demande d\'hospitalisation pour chirurgie cardiaque',
        statut: 'ACCEPTE',
        infoComplementaire: 'Patient allergique aux pénicillines',
        updatedBy: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Demande mise à jour', type: DemandeEntity })
  @ApiResponse({ status: 404, description: 'Demande introuvable' })
  update(@Param('id') id: string, @Body() body: UpdateDemandeDto, @Query('chuId') chuId?: string) {
    return this.demandeService.update(id, body, chuId);
  }
​
  @Delete(':id')
  @Permissions('demande:delete')
  @ApiOperation({ summary: 'Supprimer une demande' })
  @ApiParam({ name: 'id', description: 'Identifiant demande' })
  @ApiQuery({ name: 'chuId', required: false })
  @ApiResponse({ status: 204, description: 'Demande supprimée' })
  @ApiResponse({ status: 404, description: 'Demande introuvable' })
  async delete(@Param('id') id: string, @Query('chuId') chuId?: string) {
    await this.demandeService.delete(id, chuId);
  }
}
​