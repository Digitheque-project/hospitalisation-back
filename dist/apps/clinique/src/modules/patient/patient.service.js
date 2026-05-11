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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const cpa_service_1 = require("../cpa/cpa.service");
const vpa_service_1 = require("../vpa/vpa.service");
const accueil_patient_api_service_1 = require("../accueil/accueil-patient-api.service");
let PatientService = class PatientService {
    constructor(cpaService, vpaService, accueilPatientApi) {
        this.cpaService = cpaService;
        this.vpaService = vpaService;
        this.accueilPatientApi = accueilPatientApi;
    }
    async getDossier(patientId) {
        const [informationsPatient, cpa, vpa] = await Promise.all([
            this.accueilPatientApi.getPatientById(patientId),
            this.cpaService.findLatestByPatient(patientId),
            this.vpaService.findLatestByPatient(patientId),
        ]);
        return { patientId, informationsPatient, cpa, vpa };
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cpa_service_1.CpaService,
        vpa_service_1.VpaService,
        accueil_patient_api_service_1.AccueilPatientApiService])
], PatientService);
//# sourceMappingURL=patient.service.js.map