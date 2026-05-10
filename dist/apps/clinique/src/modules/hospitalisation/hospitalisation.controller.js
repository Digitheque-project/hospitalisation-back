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
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const hospitalisation_service_1 = require("./hospitalisation.service");
const hospitalisation_dto_1 = require("./hospitalisation.dto");
let HospitalisationController = class HospitalisationController {
    constructor(hospitalisationService) {
        this.hospitalisationService = hospitalisationService;
    }
    createHospitalisation(body) {
        return this.hospitalisationService.createHospitalisation(body);
    }
    createDemandeAvis(body) {
        return this.hospitalisationService.createDemandeAvis(body);
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
};
exports.HospitalisationController = HospitalisationController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une hospitalisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hospitalisation creee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateHospitalisationDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createHospitalisation", null);
__decorate([
    (0, common_1.Post)('demandes-avis'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: "Creer une demande d'avis medical" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Demande d'avis creee" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateDemandeAvisDto]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createDemandeAvis", null);
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnostic cree' }),
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Avis medical cree' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateAvisMedicalDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationController.prototype, "createAvisMedical", null);
exports.HospitalisationController = HospitalisationController = __decorate([
    (0, swagger_1.ApiTags)('Hospitalisation'),
    (0, common_1.Controller)('hospitalisations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [hospitalisation_service_1.HospitalisationService])
], HospitalisationController);
//# sourceMappingURL=hospitalisation.controller.js.map