import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { isUuidV4 } from '../../common/utils/uuid';
import { CreateVpaInput } from './create-vpa.input';
import { VpaEntity } from './vpa.entity';
import { VpaService } from './vpa.service';

class VpaStatsResponse {
  @ApiProperty({ example: 32 })
  pending: number;
}

@ApiTags('VPA')
@ApiBearerAuth()
@Controller('vpa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VpaController {
  constructor(private readonly vpaService: VpaService) {}

  @Get('stats')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer les indicateurs VPA' })
  @ApiResponse({ status: 200, description: 'Indicateurs VPA retournes', type: VpaStatsResponse })
  async getStats(): Promise<VpaStatsResponse> {
    const pending = await this.vpaService.getPendingCount();
    return { pending };
  }

  @Post()
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une VPA' })
  @ApiResponse({ status: 201, description: 'VPA creee', type: VpaEntity })
  create(@Body() body: CreateVpaInput) {
    return this.vpaService.create(body);
  }

  @Get(':id')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer une VPA par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant de la VPA' })
  @ApiResponse({ status: 200, description: 'VPA retournee', type: VpaEntity })
  async getById(@Param('id') id: string) {
    if (!isUuidV4(id)) {
      return {};
    }
    return (await this.vpaService.findById(id)) ?? {};
  }

  @Get('patient/:patientId/latest')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer la derniere VPA dun patient' })
  @ApiParam({ name: 'patientId', description: 'Identifiant patient' })
  @ApiResponse({ status: 200, description: 'Derniere VPA retournee', type: VpaEntity })
  async getLatestByPatient(@Param('patientId') patientId: string) {
    if (!isUuidV4(patientId)) {
      return {};
    }
    return (await this.vpaService.findLatestByPatient(patientId)) ?? {};
  }

  @Patch(':id/validate')
  @Roles('ONM')
  @ApiOperation({ summary: 'Valider la VPA' })
  @ApiParam({ name: 'id', description: 'Identifiant de la VPA' })
  @ApiResponse({ status: 200, description: 'VPA validee', type: VpaEntity })
  validate(@Param('id') id: string) {
    return this.vpaService.validate(id);
  }
}
