"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalisationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const signature_module_1 = require("../signature/signature.module");
const hospitalisation_controller_1 = require("./hospitalisation.controller");
const hospitalisation_entities_1 = require("./hospitalisation.entities");
const hospitalisation_resolver_1 = require("./hospitalisation.resolver");
const hospitalisation_service_1 = require("./hospitalisation.service");
let HospitalisationModule = class HospitalisationModule {
};
exports.HospitalisationModule = HospitalisationModule;
exports.HospitalisationModule = HospitalisationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                hospitalisation_entities_1.HospitalisationEntity,
                hospitalisation_entities_1.PatientRefEntity,
                hospitalisation_entities_1.ServiceRefEntity,
                hospitalisation_entities_1.DemandeHospitalisationRefEntity,
                hospitalisation_entities_1.PersonnelRefEntity,
                hospitalisation_entities_1.ObservationMedicalEntity,
                hospitalisation_entities_1.DiagnosticsEntity,
                hospitalisation_entities_1.PrescriptionMedicaleEntity,
                hospitalisation_entities_1.SoinsEntity,
                hospitalisation_entities_1.ChambreEntity,
                hospitalisation_entities_1.LitEntity,
                hospitalisation_entities_1.AffectationLitEntity,
                hospitalisation_entities_1.AffectationMedecinEntity,
                hospitalisation_entities_1.DemandeTransfertEntity,
                hospitalisation_entities_1.TransfertEntity,
                hospitalisation_entities_1.DemandeAvisEntity,
                hospitalisation_entities_1.AvisMedicalEntity,
                hospitalisation_entities_1.ModeSortieEntity,
            ]),
            signature_module_1.SignatureModule,
        ],
        controllers: [hospitalisation_controller_1.HospitalisationController],
        providers: [hospitalisation_service_1.HospitalisationService, hospitalisation_resolver_1.HospitalisationResolver],
        exports: [hospitalisation_service_1.HospitalisationService],
    })
], HospitalisationModule);
//# sourceMappingURL=hospitalisation.module.js.map