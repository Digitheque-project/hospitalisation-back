import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { ChambreQueryDto, CreateChambreDto, UpdateChambreDto } from './chambre.dto';
import { ChambreService } from './chambre.service';

@ApiTags('Chambres')
@Controller('chambres')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

  @Post()
  @ApiOperation({
    summary: 'Creer une chambre',
    description: 'Une chambre appartient toujours a un service donne.',
  })
  @ApiBody({
    schema: {
      example: {
        serviceId: 'service-123',
        numeroChambre: 101,
        type: 'Standard',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Chambre creee', type: ChambreEntity })
  @ApiResponse({ status: 400, description: 'Requete invalide' })
  createChambre(@Body() body: CreateChambreDto) {
    return this.chambreService.createChambre(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les chambres',
    description: 'Le filtre serviceId est obligatoire pour limiter la recherche.',
  })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiResponse({ status: 200, description: 'Liste des chambres', type: ChambreEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'serviceId obligatoire' })
  listChambres(@Query() query: ChambreQueryDto) {
    if (!query.serviceId) {
      throw new BadRequestException('serviceId obligatoire');
    }
    return this.chambreService.listChambres(query.serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperer une chambre avec ses lits' })
  @ApiParam({ name: 'id', description: 'Identifiant chambre' })
  @ApiResponse({ status: 200, description: 'Chambre retournee', type: ChambreEntity })
  @ApiResponse({ status: 404, description: 'Chambre introuvable' })
  getChambre(@Param('id') id: string) {
    return this.chambreService.getChambreById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une chambre' })
  @ApiParam({ name: 'id', description: 'Identifiant chambre' })
  @ApiBody({
    schema: {
      example: {
        numeroChambre: 202,
        type: 'Isolation',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Chambre mise a jour', type: ChambreEntity })
  @ApiResponse({ status: 404, description: 'Chambre introuvable' })
  updateChambre(@Param('id') id: string, @Body() body: UpdateChambreDto) {
    return this.chambreService.updateChambre(id, body);
  }
}
