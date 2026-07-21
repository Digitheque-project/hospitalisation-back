import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { ChambreQueryDto, CreateChambreDto, UpdateChambreDto } from './chambre.dto';
import { ChambreService } from './chambre.service';
import { Permissions } from '../../common/auth/decorators/permissions.decorator';

@ApiTags('Chambres')
@Controller('chambres')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

  @Post()
  @Permissions('chambre:create')
  @ApiOperation({
    summary: 'Creer une chambre',
    description:
      'Une chambre appartient toujours a un service et a un CHU donnes. '
      + 'Le serviceId et le chuId sont fournis dans le corps de la requete : '
      + 'tout utilisateur porteur d\'un token valide peut creer une chambre. '
      + 'Le service est valide aupres du service CHU externe.',
  })
  @ApiBody({
    schema: {
      example: {
        serviceId: '75f995a2-40e9-4285-84e4-a72501d37bfd',
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
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
  @Permissions('chambre:read')
  @ApiOperation({
    summary: 'Lister les chambres',
    description: 'Le filtre serviceId est obligatoire pour limiter la recherche.',
  })
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiResponse({ status: 200, description: 'Liste des chambres', type: ChambreEntity, isArray: true })
  @ApiResponse({ status: 400, description: 'serviceId obligatoire' })
  listChambres(@Query() query: ChambreQueryDto) {
    if (!query.serviceId || !query.chuId) {
      throw new BadRequestException('serviceId et chuId obligatoires');
    }
    return this.chambreService.listChambres(query.serviceId, query.chuId);
  }

  @Get(':id')
  @Permissions('chambre:read')
  @ApiOperation({ summary: 'Recuperer une chambre avec ses lits' })
  @ApiParam({ name: 'id', description: 'Identifiant chambre' })
  @ApiQuery({ name: 'chuId', required: true })
  @ApiResponse({ status: 200, description: 'Chambre retournee', type: ChambreEntity })
  @ApiResponse({ status: 404, description: 'Chambre introuvable' })
  getChambre(@Param('id') id: string, @Query('chuId') chuId?: string) {
    if (!chuId) {
      throw new BadRequestException('chuId obligatoire');
    }
    return this.chambreService.getChambreById(id, chuId);
  }

  @Patch(':id')
  @Permissions('chambre:update')
  @ApiOperation({ summary: 'Modifier une chambre' })
  @ApiParam({ name: 'id', description: 'Identifiant chambre' })
  @ApiBody({
    schema: {
      example: {
        chuId: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
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
