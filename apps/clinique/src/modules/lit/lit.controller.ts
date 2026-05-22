import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LitEntity, StatutLit } from '../../domain/entities/lit.entity';
import { CreateLitsDto, LitQueryDto, PlanLitsQueryDto, PlanLitsResponseDto, UpdateLitDto } from './lit.dto';
import { LitService } from './lit.service';

@ApiTags('Lits')
@Controller()
export class LitController {
  constructor(private readonly litService: LitService) {}

  @Post('chambres/:chambreId/lits')
  @ApiOperation({
    summary: 'Creer un ou plusieurs lits',
    description: 'Les lits sont toujours rattaches a une chambre existante.',
  })
  @ApiParam({ name: 'chambreId', description: 'Identifiant chambre' })
  @ApiBody({
    schema: {
      example: {
        lits: [
          { codeLit: 'A1', statut: 'DISPONIBLE' },
          { codeLit: 'A2', statut: 'MAINTENANCE' },
        ],
        chuId: 'chu-01',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Lits crees', type: LitEntity, isArray: true })
  @ApiResponse({ status: 404, description: 'Chambre introuvable' })
  createLits(@Param('chambreId') chambreId: string, @Body() body: CreateLitsDto) {
    return this.litService.createLits(chambreId, body);
  }

  @Get('lits')
  @ApiOperation({
    summary: 'Lister les lits',
    description: 'Filtrer par chambreId ou serviceId (via chambre).',
  })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'chambreId', required: false })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiResponse({ status: 200, description: 'Liste des lits', type: LitEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'chuId et chambreId ou serviceId obligatoires' })
  listLits(@Query() query: LitQueryDto) {
    if (!query.chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.litService.listLits(query);
  }

  @Get('lits/:id')
  @ApiOperation({ summary: 'Recuperer un lit' })
  @ApiParam({ name: 'id', description: 'Identifiant lit' })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiResponse({ status: 200, description: 'Lit retourne', type: LitEntity })
  @ApiResponse({ status: 404, description: 'Lit introuvable' })
  getLit(@Param('id') id: string, @Query('chuId') chuId?: string) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.litService.getLitById(id, chuId);
  }

  @Patch('lits/:id')
  @ApiOperation({
    summary: 'Modifier un lit',
    description: 'Le statut est contraint par les episodes actifs associes au lit.',
  })
  @ApiParam({ name: 'id', description: 'Identifiant lit' })
  @ApiBody({
    schema: {
      example: {
        chuId: 'chu-01',
        statut: 'MAINTENANCE',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Lit mis a jour', type: LitEntity })
  @ApiResponse({ status: 400, description: 'Changement de statut interdit' })
  @ApiResponse({ status: 404, description: 'Lit introuvable' })
  updateLit(@Param('id') id: string, @Body() body: UpdateLitDto) {
    return this.litService.updateLit(id, body);
  }

  @Get('plan-lits')
  @ApiOperation({
    summary: 'Plan de lits complet',
    description: 'Retourne toutes les chambres d un service avec leurs lits et statut actuel.',
  })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiQuery({ name: 'statutLit', required: false, enum: StatutLit })
  @ApiResponse({ status: 200, description: 'Plan de lits', type: PlanLitsResponseDto })
  @ApiResponse({ status: 400, description: 'serviceId et chuId obligatoires' })
  planLits(@Query() query: PlanLitsQueryDto) {
    if (!query.serviceId || !query.chuId) {
      throw new BadRequestException('serviceId et chuId obligatoires');
    }
    return this.litService.planLits(query);
  }
}
