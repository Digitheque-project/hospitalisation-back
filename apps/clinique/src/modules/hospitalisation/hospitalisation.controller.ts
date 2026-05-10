import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HospitalisationService } from './hospitalisation.service';
import {
  CreateAvisMedicalDto,
  CreateDemandeAvisDto,
  CreateDiagnosticsDto,
  CreateHospitalisationDto,
} from './hospitalisation.dto';

@ApiTags('Hospitalisation')
@Controller('hospitalisations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HospitalisationController {
  constructor(private readonly hospitalisationService: HospitalisationService) {}

  @Post()
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une hospitalisation' })
  @ApiResponse({ status: 200, description: 'Hospitalisation creee' })
  createHospitalisation(@Body() body: CreateHospitalisationDto) {
    return this.hospitalisationService.createHospitalisation(body);
  }

  @Post('demandes-avis')
  @Roles('ONM')
  @ApiOperation({ summary: "Creer une demande d'avis medical" })
  @ApiResponse({ status: 200, description: "Demande d'avis creee" })
  createDemandeAvis(@Body() body: CreateDemandeAvisDto) {
    return this.hospitalisationService.createDemandeAvis(body);
  }

  @Patch('demandes-avis/:id/consulter')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: "Marquer une demande d'avis comme consultee" })
  @ApiResponse({ status: 200, description: "Demande d'avis mise a jour" })
  consulterDemandeAvis(@Param('id') id: string) {
    return this.hospitalisationService.consulterDemandeAvis(id);
  }

  @Post('diagnostics')
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer un diagnostic signe' })
  @ApiResponse({ status: 200, description: 'Diagnostic cree' })
  createDiagnostics(@Body() body: CreateDiagnosticsDto, @Req() req: { user?: { orderNumber?: string } }) {
    return this.hospitalisationService.createDiagnostics(body, req.user ?? null);
  }

  @Post('avis-medical')
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer un avis medical signe' })
  @ApiResponse({ status: 200, description: 'Avis medical cree' })
  createAvisMedical(@Body() body: CreateAvisMedicalDto, @Req() req: { user?: { orderNumber?: string } }) {
    return this.hospitalisationService.createAvisMedical(body, req.user ?? null);
  }
}
