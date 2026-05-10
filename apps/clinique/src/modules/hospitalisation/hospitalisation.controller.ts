import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { isUuidV4 } from '../../common/utils/uuid';
import {
  AffectationLitEntity,
  AvisMedicalEntity,
  ChambreEntity,
  DemandeAvisEntity,
  DemandeTransfertEntity,
  DiagnosticsEntity,
  HospitalisationEntity,
  LitEntity,
  PrescriptionMedicaleEntity,
} from './hospitalisation.entities';
import { HospitalisationService } from './hospitalisation.service';
import {
  CloturerHospitalisationDto,
  CreateAffectationLitDto,
  CreateChambreDto,
  CreateAvisMedicalDto,
  CreateDemandeAvisDto,
  CreateDemandeTransfertDto,
  CreateDiagnosticsDto,
  CreateHospitalisationDto,
  CreateLitDto,
  CreatePrescriptionMedicaleDto,
  TraiterDemandeTransfertDto,
  UpdateLitStatutDto,
} from './hospitalisation.dto';

@ApiTags('Hospitalisation')
@ApiBearerAuth()
@Controller('hospitalisations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HospitalisationController {
  constructor(private readonly hospitalisationService: HospitalisationService) {}

  @Post()
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une hospitalisation' })
  @ApiResponse({ status: 201, description: 'Hospitalisation creee', type: HospitalisationEntity })
  createHospitalisation(@Body() body: CreateHospitalisationDto) {
    return this.hospitalisationService.createHospitalisation(body);
  }

  @Get('id/:id')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer une hospitalisation par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant hospitalisation' })
  @ApiResponse({ status: 200, description: 'Hospitalisation retournee', type: HospitalisationEntity })
  async getHospitalisationById(@Param('id') id: string) {
    if (!isUuidV4(id)) {
      return {};
    }
    return (await this.hospitalisationService.findHospitalisationById(id)) ?? {};
  }

  @Get('services/:serviceId/lits/disponibles')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Lister les lits disponibles dun service' })
  @ApiParam({ name: 'serviceId', description: 'Identifiant service' })
  @ApiResponse({ status: 200, description: 'Liste des lits disponibles', type: LitEntity, isArray: true })
  getAvailableLitsByService(@Param('serviceId') serviceId: string) {
    if (!isUuidV4(serviceId)) {
      return [];
    }
    return this.hospitalisationService.findAvailableLitsByService(serviceId);
  }

  @Post('chambres')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Creer une chambre' })
  @ApiResponse({ status: 201, description: 'Chambre creee', type: ChambreEntity })
  createChambre(@Body() body: CreateChambreDto) {
    return this.hospitalisationService.createChambre(body);
  }

  @Post('lits')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Creer un lit' })
  @ApiResponse({ status: 201, description: 'Lit cree', type: LitEntity })
  createLit(@Body() body: CreateLitDto) {
    return this.hospitalisationService.createLit(body);
  }

  @Get('lits/:id')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer un lit par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant du lit' })
  @ApiResponse({ status: 200, description: 'Lit retourne', type: LitEntity })
  async getLitById(@Param('id') id: string) {
    if (!isUuidV4(id)) {
      return {};
    }
    return (await this.hospitalisationService.findLitById(id)) ?? {};
  }

  @Get('chambres/:idChambre/lits')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Lister les lits dune chambre' })
  @ApiParam({ name: 'idChambre', description: 'Identifiant de la chambre' })
  @ApiResponse({ status: 200, description: 'Liste des lits de la chambre', type: LitEntity, isArray: true })
  getLitsByChambre(@Param('idChambre') idChambre: string) {
    if (!isUuidV4(idChambre)) {
      return [];
    }
    return this.hospitalisationService.findLitsByChambre(idChambre);
  }

  @Patch('lits/:id/statut')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Mettre a jour le statut dun lit' })
  @ApiParam({ name: 'id', description: 'Identifiant du lit' })
  @ApiResponse({ status: 200, description: 'Statut du lit mis a jour', type: LitEntity })
  updateLitStatut(@Param('id') id: string, @Body() body: UpdateLitStatutDto) {
    return this.hospitalisationService.updateLitStatut(id, body);
  }

  @Post('affectations-lits')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Affecter un lit a une hospitalisation' })
  @ApiResponse({ status: 201, description: 'Affectation de lit creee', type: AffectationLitEntity })
  createAffectationLit(@Body() body: CreateAffectationLitDto) {
    return this.hospitalisationService.createAffectationLit(body);
  }

  @Post('demandes-avis')
  @Roles('ONM')
  @ApiOperation({ summary: "Creer une demande d'avis medical" })
  @ApiResponse({ status: 201, description: "Demande d'avis creee", type: DemandeAvisEntity })
  createDemandeAvis(@Body() body: CreateDemandeAvisDto) {
    return this.hospitalisationService.createDemandeAvis(body);
  }

  @Get('demandes-avis/:id')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: "Recuperer une demande d'avis par identifiant" })
  @ApiParam({ name: 'id', description: "Identifiant de la demande d'avis" })
  @ApiResponse({ status: 200, description: "Demande d'avis retournee", type: DemandeAvisEntity })
  async getDemandeAvisById(@Param('id') id: string) {
    if (!isUuidV4(id)) {
      return {};
    }
    return (await this.hospitalisationService.findDemandeAvisById(id)) ?? {};
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
  @ApiResponse({ status: 201, description: 'Diagnostic cree', type: DiagnosticsEntity })
  createDiagnostics(@Body() body: CreateDiagnosticsDto, @Req() req: { user?: { orderNumber?: string } }) {
    return this.hospitalisationService.createDiagnostics(body, req.user ?? null);
  }

  @Post('avis-medical')
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer un avis medical signe' })
  @ApiResponse({ status: 201, description: 'Avis medical cree', type: AvisMedicalEntity })
  createAvisMedical(@Body() body: CreateAvisMedicalDto, @Req() req: { user?: { orderNumber?: string } }) {
    return this.hospitalisationService.createAvisMedical(body, req.user ?? null);
  }

  @Post('prescriptions')
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une prescription medicale signee' })
  @ApiResponse({ status: 201, description: 'Prescription creee', type: PrescriptionMedicaleEntity })
  createPrescription(
    @Body() body: CreatePrescriptionMedicaleDto,
    @Req() req: { user?: { orderNumber?: string } },
  ) {
    return this.hospitalisationService.createPrescriptionMedicale(body, req.user ?? null);
  }

  @Post('demandes-transfert')
  @Roles('ONM')
  @ApiOperation({ summary: 'Creer une demande de transfert' })
  @ApiResponse({ status: 201, description: 'Demande de transfert creee', type: DemandeTransfertEntity })
  createDemandeTransfert(@Body() body: CreateDemandeTransfertDto) {
    return this.hospitalisationService.createDemandeTransfert(body);
  }

  @Get('demandes-transfert/:id')
  @Roles('ONM', 'ONIM')
  @ApiOperation({ summary: 'Recuperer une demande de transfert par identifiant' })
  @ApiParam({ name: 'id', description: 'Identifiant demande transfert' })
  @ApiResponse({
    status: 200,
    description: 'Demande de transfert retournee',
    type: DemandeTransfertEntity,
  })
  async getDemandeTransfertById(@Param('id') id: string) {
    if (!isUuidV4(id)) {
      return {};
    }
    return (await this.hospitalisationService.findDemandeTransfertById(id)) ?? {};
  }

  @Patch('demandes-transfert/:id')
  @Roles('ONM')
  @ApiOperation({ summary: 'Traiter une demande de transfert' })
  @ApiResponse({ status: 200, description: 'Demande de transfert traitee' })
  traiterDemandeTransfert(@Param('id') id: string, @Body() body: TraiterDemandeTransfertDto) {
    return this.hospitalisationService.traiterDemandeTransfert(id, body);
  }

  @Patch(':id/cloture')
  @Roles('ONM')
  @ApiOperation({ summary: 'Cloturer une hospitalisation' })
  @ApiResponse({ status: 200, description: 'Hospitalisation cloturee' })
  cloturerHospitalisation(@Param('id') id: string, @Body() body: CloturerHospitalisationDto) {
    return this.hospitalisationService.cloturerHospitalisation(id, body);
  }
}
