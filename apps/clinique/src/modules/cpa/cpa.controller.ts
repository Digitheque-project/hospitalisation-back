import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { isUuidV4 } from '../../common/utils/uuid';
import { CpaEntity } from './cpa.entity';
import { CpaService } from './cpa.service';
import { CreateCpaInput } from './create-cpa.input';

class CpaStatsResponse {
  @ApiProperty({ example: 4 })
  total: number;

  @ApiProperty({ example: 1 })
  urgent: number;
}

class ExternalConsultationItem {
  @ApiProperty({ example: '8b6ae0d9-62f9-4e4e-80ad-9e2b2d0a96e0' })
  id: string;

  @ApiProperty({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' })
  patientId: string;

  @ApiProperty({ example: 'Chirurgie digestive' })
  typeChirurgie: string;

  @ApiProperty({ example: 'Dr. Pierre' })
  chirurgien: string;

  @ApiProperty({ example: 2 })
  asaScore: number;

  @ApiProperty({ example: true })
  urgence: boolean;

  @ApiProperty({ example: '2026-05-11T08:15:00.000Z' })
  createdAt: string;
}

@ApiTags('CPA')
@ApiBearerAuth()
@Controller('cpa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CpaController {
  constructor(private readonly cpaService: CpaService) {}

  @Get('stats')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer les indicateurs CPA' })
  @ApiResponse({ status: 200, description: 'Indicateurs CPA retournes', type: CpaStatsResponse })
  async getStats(): Promise<CpaStatsResponse> {
    return this.cpaService.getStats();
  }

  @Get('external-consultations')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Lister les consultations externes (CPA)' })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  @ApiResponse({ status: 200, description: 'Liste des consultations externes', type: ExternalConsultationItem, isArray: true })
  async getExternalConsultations(@Query('limit') limit?: string): Promise<ExternalConsultationItem[]> {
    const items = await this.cpaService.getRecent(this.parseLimit(limit));
    return items.map((item) => ({
      id: item.id,
      patientId: item.patientId,
      typeChirurgie: item.typeChirurgie,
      chirurgien: item.chirurgien,
      asaScore: item.asaScore,
      urgence: item.urgence,
      createdAt: item.createdAt.toISOString(),
    }));
  }

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

  private parseLimit(raw?: string): number {
    if (!raw) {
      return Number.NaN;
    }

    const parsed = Number.parseInt(raw, 10);

    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }
}
