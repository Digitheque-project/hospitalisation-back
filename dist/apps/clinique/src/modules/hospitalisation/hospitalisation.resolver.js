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
exports.HospitalisationResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const hospitalisation_entities_1 = require("./hospitalisation.entities");
const hospitalisation_service_1 = require("./hospitalisation.service");
const hospitalisation_dto_1 = require("./hospitalisation.dto");
let HospitalisationResolver = class HospitalisationResolver {
    constructor(hospitalisationService) {
        this.hospitalisationService = hospitalisationService;
    }
    createHospitalisation(input) {
        return this.hospitalisationService.createHospitalisation(input);
    }
    hospitalisation(id) {
        return this.hospitalisationService.findHospitalisationById(id);
    }
    createDemandeAvis(input) {
        return this.hospitalisationService.createDemandeAvis(input);
    }
    consulterDemandeAvis(id) {
        return this.hospitalisationService.consulterDemandeAvis(id);
    }
    createDiagnostic(input, context) {
        return this.hospitalisationService.createDiagnostics(input, context?.req?.user ?? null);
    }
    createAvisMedical(input, context) {
        return this.hospitalisationService.createAvisMedical(input, context?.req?.user ?? null);
    }
};
exports.HospitalisationResolver = HospitalisationResolver;
__decorate([
    (0, graphql_1.Mutation)(() => hospitalisation_entities_1.HospitalisationEntity),
    (0, roles_decorator_1.Roles)('ONM'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateHospitalisationDto]),
    __metadata("design:returntype", void 0)
], HospitalisationResolver.prototype, "createHospitalisation", null);
__decorate([
    (0, graphql_1.Query)(() => hospitalisation_entities_1.HospitalisationEntity, { nullable: true }),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationResolver.prototype, "hospitalisation", null);
__decorate([
    (0, graphql_1.Mutation)(() => hospitalisation_entities_1.DemandeAvisEntity),
    (0, roles_decorator_1.Roles)('ONM'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateDemandeAvisDto]),
    __metadata("design:returntype", void 0)
], HospitalisationResolver.prototype, "createDemandeAvis", null);
__decorate([
    (0, graphql_1.Mutation)(() => hospitalisation_entities_1.DemandeAvisEntity),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalisationResolver.prototype, "consulterDemandeAvis", null);
__decorate([
    (0, graphql_1.Mutation)(() => hospitalisation_entities_1.DiagnosticsEntity),
    (0, roles_decorator_1.Roles)('ONM'),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateDiagnosticsDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationResolver.prototype, "createDiagnostic", null);
__decorate([
    (0, graphql_1.Mutation)(() => hospitalisation_entities_1.AvisMedicalEntity),
    (0, roles_decorator_1.Roles)('ONM'),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hospitalisation_dto_1.CreateAvisMedicalDto, Object]),
    __metadata("design:returntype", void 0)
], HospitalisationResolver.prototype, "createAvisMedical", null);
exports.HospitalisationResolver = HospitalisationResolver = __decorate([
    (0, graphql_1.Resolver)(() => hospitalisation_entities_1.HospitalisationEntity),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [hospitalisation_service_1.HospitalisationService])
], HospitalisationResolver);
//# sourceMappingURL=hospitalisation.resolver.js.map