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
exports.PatientResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const common_1 = require("@nestjs/common");
const dossier_patient_type_1 = require("./dossier-patient.type");
const patient_service_1 = require("./patient.service");
let PatientResolver = class PatientResolver {
    constructor(patientService) {
        this.patientService = patientService;
    }
    dossierPatient(patientId) {
        return this.patientService.getDossier(patientId);
    }
};
exports.PatientResolver = PatientResolver;
__decorate([
    (0, graphql_1.Query)(() => dossier_patient_type_1.DossierPatientUnique),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    __param(0, (0, graphql_1.Args)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientResolver.prototype, "dossierPatient", null);
exports.PatientResolver = PatientResolver = __decorate([
    (0, graphql_1.Resolver)(() => dossier_patient_type_1.DossierPatientUnique),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [patient_service_1.PatientService])
], PatientResolver);
//# sourceMappingURL=patient.resolver.js.map