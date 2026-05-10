import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { isUuidV4 } from '../../common/utils/uuid';
import { CpaEntity } from './cpa.entity';
import { CpaService } from './cpa.service';
import { CreateCpaInput } from './create-cpa.input';

@ApiTags('CPA')
@ApiBearerAuth()
@Controller('cpa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CpaController {
  constructor(private readonly cpaService: CpaService) {}

  @Post()
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une CPA' })
  @ApiResponse({ status: 201, description: 'CPA creee', type: CpaEntity })
  create(@Body() body: CreateCpaInput) {
    return this.cpaService.create(body);
  }

  @Get(':id')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer une CPA par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant de la CPA' })
  @ApiResponse({ status: 200, description: 'CPA retournee', type: CpaEntity })
  async getById(@Param('id') id: string) {
    if (!isUuidV4(id)) {
      return {};
    }
    return (await this.cpaService.findById(id)) ?? {};
  }

  @Get('patient/:patientId/latest')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer la derniere CPA dun patient' })
  @ApiParam({ name: 'patientId', description: 'Identifiant patient' })
  @ApiResponse({ status: 200, description: 'Derniere CPA retournee', type: CpaEntity })
  async getLatestByPatient(@Param('patientId') patientId: string) {
    if (!isUuidV4(patientId)) {
      return {};
    }
    return (await this.cpaService.findLatestByPatient(patientId)) ?? {};
  }

  @Patch(':id/realise')
  @Roles('ONM')
  @ApiOperation({ summary: 'Marquer la CPA comme REALISEE' })
  @ApiParam({ name: 'id', description: 'Identifiant de la CPA' })
  @ApiResponse({ status: 200, description: 'CPA mise a jour', type: CpaEntity })
  markRealise(@Param('id') id: string) {
    return this.cpaService.markAsRealise(id);
  }
}
