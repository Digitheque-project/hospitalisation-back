"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalisationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const uuid_1 = require("../../common/utils/uuid");
const hospitalisation_entities_1 = require("./hospitalisation.entities");
const hospitalisation_service_1 = require("./hospitalisation.service");
const hospitalisation_dto_1 = require("./hospitalisation.dto");
let HospitalisationController = class HospitalisationController {
    constructor(hospitalisationService) {
        this.hospitalisationService = hospitalisationService;
    }
    createPersonnelRef(body) {
        return this.hospitalisationService.createPersonnelRef(body.id);
    }
    createServiceRef(body) {
        return this.hospitalisationService.createServiceRef(body.id);
    }
    getHospitalisationStats() {
        return this.hospitalisationService.getHospitalisationStats();
    }
    getActiveHospitalisations(limit) {
        return this.hospitalisationService.getActiveHospitalisations(this.parseLimit(limit));
    }
    getHospitalisationNotifications(limit) {
        return this.hospitalisationService.getHospitalisationNotifications(this.parseLimit(limit));
    }
    getPlanLits(serviceId) {
        const id = serviceId?.trim();
        if (!id) {
            return { serviceId: serviceId ?? '', chambres: [], stats: { totalLits: 0, litsOccupes: 0, totalPatients: 0 } };
        }
        return this.hospitalisationService.getPlanLitsByService(id);
    }
    createHospitalisation(body) {
        return this.hospitalisationService.createHospitalisation(body);
    }
    updateStatus(id, body) {
        return this.hospitalisationService.updateStatus(id, body.status);
    }
    async getHospitalisationById(id) {
        if (!(0, uuid_1.isUuidV4)(id)) {
            return {};
        }
        return (await this.hospitalisationService.findHospitalisationById(id)) ?? {};
    }
    getAvailableLitsByService(serviceId) {
        const id = serviceId?.trim();
        if (!id) {
            return [];
        }
        return this.hospitalisationService.findAvailableLitsByService(id);
    }
    createChambre(body) {
        return this.hospitalisationService.createChambre(body);
    }
    createLit(body) {
        return this.hospitalisationService.createLit(body);
    }
    async getLitById(id) {
        if (!(0, uuid_1.isUuidV4)(id)) {
            return {};
        }
        return (await this.hospitalisationService.findLitById(id)) ?? {};
    }
    getLitsByChambre(idChambre) {
        if (!(0, uuid_1.isUuidV4)(idChambre)) {
            return [];
        }
        return this.hospitalisationService.findLitsByChambre(idChambre);
    }
    updateLitStatut(id, body) {
        return this.hospitalisationService.updateLitStatut(id, body);
    }
    createAffectationLit(body) {
        return this.hospitalisationService.createAffectationLit(body);
    }
    createDemandeAvis(body) {
        return this.hospitalisationService.createDemandeAvis(body);
    }
    async getDemandeAvisById(id) {
        if (!(0, uuid_1.isUuidV4)(id)) {
            return {};
        }
        return (await this.hospitalisationService.findDemandeAvisById(id)) ?? {};
    }
    consulterDemandeAvis(id) {
        return this.hospitalisationService.consulterDemandeAvis(id);
    }
    createDiagnostics(body, req) {
        return this.hospitalisationService.createDiagnostics(body, req.user ?? null);
    }
    createAvisMedical(body, req) {
        return this.hospitalisationService.createAvisMedical(body, req.user ?? null);
    }
    createPrescription(body, req) {
        return this.hospitalisationService.createPrescriptionMedicale(body, req.user ?? null);
    }
    createDemandeTransfert(body) {
        return this.hospitalisationService.createDemandeTransfert(body);
    }
    async getDemandeTransfertById(id) {
        if (!(0, uuid_1.isUuidV4)(id)) {
            return {};
        }
        return (await this.hospitalisationService.findDemandeTransfertById(id)) ?? {};
    }
    traiterDemandeTransfert(id, body) {
        return this.hospitalisationService.traiterDemandeTransfert(id, body);
    }
    cloturerHospitalisation(id, body) {
        return this.hospitalisationService.cloturerHospitalisation(id, body);
    }
    parseLimit(raw) {
        if (!raw) {
            return Number.NaN;
        }
        const parsed = Number.parseInt(raw, 10);
        return Number.isNaN(parsed) ? Number.NaN : parsed;
    }
};
exports.HospitalisationController = HospitalisationController;
__decorate([
    (0, common_1.Post)('seed/personnel-ref'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une reference de personnel (seed)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Personnel reference cree', type: hospitalisation_entities_1.PersonnelRefEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreatePersonnelRefDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createPersonnelRef", null);
__decorate([
    (0, common_1.Post)('seed/service-ref'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une reference de service (seed)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Service reference cree', type: hospitalisation_entities_1.ServiceRefEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateServiceRefDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createServiceRef", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer les indicateurs hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Indicateurs hospitalisation retournes', type: hospitalisation_dto_1.HospitalisationStatsResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "getHospitalisationStats", null);
__decorate([
    (0, common_1.Get)('actives'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les hospitalisations actives' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 6 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des hospitalisations actives', type: hospitalisation_dto_1.ActiveHospitalisationItem, isArray: true }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "getActiveHospitalisations", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les notifications hospitalisation' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Liste des notifications enrichies',
        type: hospitalisation_dto_1.HospitalisationNotificationItem,
        isArray: true,
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "getHospitalisationNotifications", null);
__decorate([
    (0, common_1.Get)('plan-lits/:serviceId'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer le plan des lits dun service' }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Identifiant du service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plan des lits du service', type: hospitalisation_dto_1.PlanLitsResponse }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "getPlanLits", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hospitalisation creee', type: hospitalisation_entities_1.HospitalisationEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateHospitalisationDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createHospitalisation", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre a jour le statut de la demande hospitalisation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut hospitalisation mis a jour', type: hospitalisation_entities_1.HospitalisationEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hospitalisation_dto_1.UpdateHospitalisationStatusDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer une hospitalisation par identifiant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hospitalisation retournee', type: hospitalisation_entities_1.HospitalisationEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalisationController.prototype, "getHospitalisationById", null);
__decorate([
    (0, common_1.Get)('services/:serviceId/lits/disponibles'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les lits disponibles dun service' }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Identifiant service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des lits disponibles', type: hospitalisation_entities_1.LitEntity, isArray: true }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "getAvailableLitsByService", null);
__decorate([
    (0, common_1.Post)('chambres'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une chambre' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chambre creee', type: hospitalisation_entities_1.ChambreEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateChambreDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createChambre", null);
__decorate([
    (0, common_1.Post)('lits'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer un lit' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lit cree', type: hospitalisation_entities_1.LitEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateLitDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createLit", null);
__decorate([
    (0, common_1.Get)('lits/:id'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer un lit par identifiant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant du lit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lit retourne', type: hospitalisation_entities_1.LitEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalisationController.prototype, "getLitById", null);
__decorate([
    (0, common_1.Get)('chambres/:idChambre/lits'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les lits dune chambre' }),
    (0, swagger_1.ApiParam)({ name: 'idChambre', description: 'Identifiant de la chambre' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des lits de la chambre', type: hospitalisation_entities_1.LitEntity, isArray: true }),
    __param(0, (0, common_1.Param)('idChambre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "getLitsByChambre", null);
__decorate([
    (0, common_1.Patch)('lits/:id/statut'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre a jour le statut dun lit' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant du lit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut du lit mis a jour', type: hospitalisation_entities_1.LitEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hospitalisation_dto_1.UpdateLitStatutDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "updateLitStatut", null);
__decorate([
    (0, common_1.Post)('affectations-lits'),
    (0, swagger_1.ApiOperation)({ summary: 'Affecter un lit a une hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Affectation de lit creee', type: hospitalisation_entities_1.AffectationLitEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateAffectationLitDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createAffectationLit", null);
__decorate([
    (0, common_1.Post)('demandes-avis'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: "Creer une demande d'avis medical" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Demande d'avis creee", type: hospitalisation_entities_1.DemandeAvisEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateDemandeAvisDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createDemandeAvis", null);
__decorate([
    (0, common_1.Get)('demandes-avis/:id'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: "Recuperer une demande d'avis par identifiant" }),
    (0, swagger_1.ApiParam)({ name: 'id', description: "Identifiant de la demande d'avis" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Demande d'avis retournee", type: hospitalisation_entities_1.DemandeAvisEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalisationController.prototype, "getDemandeAvisById", null);
__decorate([
    (0, common_1.Patch)('demandes-avis/:id/consulter'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: "Marquer une demande d'avis comme consultee" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Demande d'avis mise a jour" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "consulterDemandeAvis", null);
__decorate([
    (0, common_1.Post)('diagnostics'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer un diagnostic signe' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnostic cree', type: hospitalisation_entities_1.DiagnosticsEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateDiagnosticsDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createDiagnostics", null);
__decorate([
    (0, common_1.Post)('avis-medical'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer un avis medical signe' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Avis medical cree', type: hospitalisation_entities_1.AvisMedicalEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateAvisMedicalDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createAvisMedical", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une prescription medicale signee' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription creee', type: hospitalisation_entities_1.PrescriptionMedicaleEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreatePrescriptionMedicaleDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Post)('demandes-transfert'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une demande de transfert' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Demande de transfert creee', type: hospitalisation_entities_1.DemandeTransfertEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateDemandeTransfertDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createDemandeTransfert", null);
__decorate([
    (0, common_1.Get)('demandes-transfert/:id'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer une demande de transfert par identifiant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant demande transfert' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Demande de transfert retournee',
        type: hospitalisation_entities_1.DemandeTransfertEntity,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalisationController.prototype, "getDemandeTransfertById", null);
__decorate([
    (0, common_1.Patch)('demandes-transfert/:id'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Traiter une demande de transfert' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demande de transfert traitee' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hospitalisation_dto_1.TraiterDemandeTransfertDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "traiterDemandeTransfert", null);
__decorate([
    (0, common_1.Patch)(':id/cloture'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Cloturer une hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hospitalisation cloturee' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hospitalisation_dto_1.CloturerHospitalisationDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "cloturerHospitalisation", null);
exports.HospitalisationController = HospitalisationController = __decorate([
    (0, swagger_1.ApiTags)('Hospitalisation'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('hospitalisations'),
    __metadata("design:paramtypes", [hospitalisation_service_1.HospitalisationService])
], HospitalisationController);
//# sourceMappingURL=hospitalisation.controller.js.map