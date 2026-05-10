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
exports.CreateAvisMedicalDto = exports.CreateDiagnosticsDto = exports.CreateDemandeAvisDto = exports.CreateHospitalisationDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let CreateHospitalisationDto = class CreateHospitalisationDto {
};
exports.CreateHospitalisationDto = CreateHospitalisationDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant patient', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "idPatient", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant service', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "idService", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant demande hospitalisation', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "idDemandeHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: "Date d'entree ISO", required: true }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "dateEntrer", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Motif hospitalisation', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "motifHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant mode sortie', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "idModeSortie", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Commentaire medical', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "commentaire", void 0);
exports.CreateHospitalisationDto = CreateHospitalisationDto = __decorate([
    (0, graphql_1.InputType)()
], CreateHospitalisationDto);
let CreateDemandeAvisDto = class CreateDemandeAvisDto {
};
exports.CreateDemandeAvisDto = CreateDemandeAvisDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Hospitalisation reference', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeAvisDto.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Medecin demandeur', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeAvisDto.prototype, "idMedecinDemandeur", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Service cible', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeAvisDto.prototype, "idServiceCible", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Motif de la demande', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeAvisDto.prototype, "motif", void 0);
exports.CreateDemandeAvisDto = CreateDemandeAvisDto = __decorate([
    (0, graphql_1.InputType)()
], CreateDemandeAvisDto);
let CreateDiagnosticsDto = class CreateDiagnosticsDto {
};
exports.CreateDiagnosticsDto = CreateDiagnosticsDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Hospitalisation reference', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosticsDto.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Personnel signataire', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosticsDto.prototype, "idPersonnel", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Description du diagnostic', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDiagnosticsDto.prototype, "descriptionDiagnostic", void 0);
exports.CreateDiagnosticsDto = CreateDiagnosticsDto = __decorate([
    (0, graphql_1.InputType)()
], CreateDiagnosticsDto);
let CreateAvisMedicalDto = class CreateAvisMedicalDto {
};
exports.CreateAvisMedicalDto = CreateAvisMedicalDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: "Demande d'avis reference", required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAvisMedicalDto.prototype, "idDemande", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Medecin signataire', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAvisMedicalDto.prototype, "idMedecin", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: "Conclusion de l'avis", required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAvisMedicalDto.prototype, "conclusion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Recommandation medicale', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAvisMedicalDto.prototype, "recomandation", void 0);
exports.CreateAvisMedicalDto = CreateAvisMedicalDto = __decorate([
    (0, graphql_1.InputType)()
], CreateAvisMedicalDto);
//# sourceMappingURL=hospitalisation.dto.js.map