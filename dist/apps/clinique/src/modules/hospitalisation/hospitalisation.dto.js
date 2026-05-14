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
exports.PlanLitsResponse = exports.PlanLitsStats = exports.PlanLitRoomItem = exports.PlanLitBedItem = exports.PlanLitBedHospitalisation = exports.HospitalisationNotificationItem = exports.ActiveHospitalisationItem = exports.HospitalisationStatsResponse = exports.UpdateHospitalisationStatusDto = exports.UpdateLitStatutDto = exports.CreateLitDto = exports.CreateChambreDto = exports.CreateAffectationLitDto = exports.CloturerHospitalisationDto = exports.TraiterDemandeTransfertDto = exports.CreateDemandeTransfertDto = exports.CreatePrescriptionMedicaleDto = exports.CreateAvisMedicalDto = exports.CreateDiagnosticsDto = exports.CreateDemandeAvisDto = exports.CreateHospitalisationDto = exports.CreateServiceRefDto = exports.CreatePersonnelRefDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const hospitalisation_entities_1 = require("./hospitalisation.entities");
class CreatePersonnelRefDto {
}
exports.CreatePersonnelRefDto = CreatePersonnelRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'dr-jean-pierre', description: 'Identifiant du personnel' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonnelRefDto.prototype, "id", void 0);
class CreateServiceRefDto {
}
exports.CreateServiceRefDto = CreateServiceRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'chirurgie', description: 'Identifiant du service' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceRefDto.prototype, "id", void 0);
let CreateHospitalisationDto = class CreateHospitalisationDto {
};
exports.CreateHospitalisationDto = CreateHospitalisationDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant patient', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant service', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "serviceId", void 0);
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
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Type d'hospitalisation",
        required: false,
        default: 'Hospitalisation',
        enum: ['Hospitalisation'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Hospitalisation']),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant mode sortie', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "idModeSortie", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Commentaire medical', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "commentaire", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Identifiant du lit à affecter à la création. Si omis ou null, aucune affectation de lit n'est créée.",
        required: false,
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHospitalisationDto.prototype, "idLit", void 0);
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
let CreatePrescriptionMedicaleDto = class CreatePrescriptionMedicaleDto {
};
exports.CreatePrescriptionMedicaleDto = CreatePrescriptionMedicaleDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Hospitalisation reference', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionMedicaleDto.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Medecin prescripteur', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionMedicaleDto.prototype, "idMedecin", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: "Contenu de l'ordonnance", required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionMedicaleDto.prototype, "contenuPrescription", void 0);
exports.CreatePrescriptionMedicaleDto = CreatePrescriptionMedicaleDto = __decorate([
    (0, graphql_1.InputType)()
], CreatePrescriptionMedicaleDto);
let CreateDemandeTransfertDto = class CreateDemandeTransfertDto {
};
exports.CreateDemandeTransfertDto = CreateDemandeTransfertDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Hospitalisation reference', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeTransfertDto.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Service source', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeTransfertDto.prototype, "serviceSource", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Service destination', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeTransfertDto.prototype, "serviceDestination", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Motif du transfert', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDemandeTransfertDto.prototype, "motifDemandeTransfert", void 0);
exports.CreateDemandeTransfertDto = CreateDemandeTransfertDto = __decorate([
    (0, graphql_1.InputType)()
], CreateDemandeTransfertDto);
let TraiterDemandeTransfertDto = class TraiterDemandeTransfertDto {
};
exports.TraiterDemandeTransfertDto = TraiterDemandeTransfertDto;
__decorate([
    (0, graphql_1.Field)(() => hospitalisation_entities_1.StatutDemandeTransfert),
    (0, swagger_1.ApiProperty)({
        enum: hospitalisation_entities_1.StatutDemandeTransfert,
        description: 'Decision sur la demande de transfert',
        required: true,
    }),
    (0, class_validator_1.IsEnum)(hospitalisation_entities_1.StatutDemandeTransfert),
    __metadata("design:type", String)
], TraiterDemandeTransfertDto.prototype, "statut", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Justification de la decision', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraiterDemandeTransfertDto.prototype, "justification", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Lit destination specifique', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TraiterDemandeTransfertDto.prototype, "idLitDestination", void 0);
exports.TraiterDemandeTransfertDto = TraiterDemandeTransfertDto = __decorate([
    (0, graphql_1.InputType)()
], TraiterDemandeTransfertDto);
let CloturerHospitalisationDto = class CloturerHospitalisationDto {
};
exports.CloturerHospitalisationDto = CloturerHospitalisationDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Mode de sortie', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CloturerHospitalisationDto.prototype, "idModeSortie", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Commentaire de sortie', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CloturerHospitalisationDto.prototype, "commentaire", void 0);
exports.CloturerHospitalisationDto = CloturerHospitalisationDto = __decorate([
    (0, graphql_1.InputType)()
], CloturerHospitalisationDto);
let CreateAffectationLitDto = class CreateAffectationLitDto {
};
exports.CreateAffectationLitDto = CreateAffectationLitDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Hospitalisation reference', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAffectationLitDto.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Lit a affecter', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAffectationLitDto.prototype, "idLit", void 0);
exports.CreateAffectationLitDto = CreateAffectationLitDto = __decorate([
    (0, graphql_1.InputType)()
], CreateAffectationLitDto);
let CreateChambreDto = class CreateChambreDto {
};
exports.CreateChambreDto = CreateChambreDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Service de rattachement', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChambreDto.prototype, "serviceId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Numero de chambre', required: true }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateChambreDto.prototype, "numeroChambre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Type de chambre', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChambreDto.prototype, "type", void 0);
exports.CreateChambreDto = CreateChambreDto = __decorate([
    (0, graphql_1.InputType)()
], CreateChambreDto);
let CreateLitDto = class CreateLitDto {
};
exports.CreateLitDto = CreateLitDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Chambre de rattachement', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLitDto.prototype, "idChambre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Code unique du lit', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLitDto.prototype, "codeLit", void 0);
exports.CreateLitDto = CreateLitDto = __decorate([
    (0, graphql_1.InputType)()
], CreateLitDto);
let UpdateLitStatutDto = class UpdateLitStatutDto {
};
exports.UpdateLitStatutDto = UpdateLitStatutDto;
__decorate([
    (0, graphql_1.Field)(() => hospitalisation_entities_1.StatutLit),
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutLit, description: 'Nouveau statut du lit', required: true }),
    (0, class_validator_1.IsEnum)(hospitalisation_entities_1.StatutLit),
    __metadata("design:type", String)
], UpdateLitStatutDto.prototype, "statut", void 0);
exports.UpdateLitStatutDto = UpdateLitStatutDto = __decorate([
    (0, graphql_1.InputType)()
], UpdateLitStatutDto);
let UpdateHospitalisationStatusDto = class UpdateHospitalisationStatusDto {
};
exports.UpdateHospitalisationStatusDto = UpdateHospitalisationStatusDto;
__decorate([
    (0, graphql_1.Field)(() => hospitalisation_entities_1.StatutDemande),
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutDemande, description: 'Nouveau statut de la demande', required: true }),
    (0, class_validator_1.IsEnum)(hospitalisation_entities_1.StatutDemande),
    __metadata("design:type", String)
], UpdateHospitalisationStatusDto.prototype, "status", void 0);
exports.UpdateHospitalisationStatusDto = UpdateHospitalisationStatusDto = __decorate([
    (0, graphql_1.InputType)()
], UpdateHospitalisationStatusDto);
class HospitalisationStatsResponse {
}
exports.HospitalisationStatsResponse = HospitalisationStatsResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], HospitalisationStatsResponse.prototype, "hospitalizedTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], HospitalisationStatsResponse.prototype, "hospitalizedNewToday", void 0);
class ActiveHospitalisationItem {
}
exports.ActiveHospitalisationItem = ActiveHospitalisationItem;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5b2b1b80-0f71-4bb1-9f5b-8d521d3d0b33' }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-11T08:15:00.000Z' }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "dateEntrer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Appendicectomie laparoscopique' }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "motifHospitalisation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'service-123' }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hospitalisation' }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutHospitalisation }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "statutHospitalisation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutDemande }),
    __metadata("design:type", String)
], ActiveHospitalisationItem.prototype, "statusDemande", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A1', required: false, nullable: true }),
    __metadata("design:type", Object)
], ActiveHospitalisationItem.prototype, "litCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, required: false, nullable: true }),
    __metadata("design:type", Object)
], ActiveHospitalisationItem.prototype, "chambreNumero", void 0);
class HospitalisationNotificationItem {
}
exports.HospitalisationNotificationItem = HospitalisationNotificationItem;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5b2b1b80-0f71-4bb1-9f5b-8d521d3d0b33' }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-11T08:15:00.000Z' }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "dateEntrer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Appendicectomie laparoscopique' }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "motifHospitalisation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'service-123' }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hospitalisation' }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutHospitalisation }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "statutHospitalisation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutDemande }),
    __metadata("design:type", String)
], HospitalisationNotificationItem.prototype, "statusDemande", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A1', required: false, nullable: true }),
    __metadata("design:type", Object)
], HospitalisationNotificationItem.prototype, "litCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, required: false, nullable: true }),
    __metadata("design:type", Object)
], HospitalisationNotificationItem.prototype, "chambreNumero", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Object)
], HospitalisationNotificationItem.prototype, "commentaire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, required: false }),
    __metadata("design:type", Object)
], HospitalisationNotificationItem.prototype, "patient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1715492100000 }),
    __metadata("design:type", Number)
], HospitalisationNotificationItem.prototype, "receivedAt", void 0);
class PlanLitBedHospitalisation {
}
exports.PlanLitBedHospitalisation = PlanLitBedHospitalisation;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5b2b1b80-0f71-4bb1-9f5b-8d521d3d0b33' }),
    __metadata("design:type", String)
], PlanLitBedHospitalisation.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' }),
    __metadata("design:type", String)
], PlanLitBedHospitalisation.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-11T08:15:00.000Z' }),
    __metadata("design:type", String)
], PlanLitBedHospitalisation.prototype, "dateEntrer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Appendicectomie laparoscopique' }),
    __metadata("design:type", String)
], PlanLitBedHospitalisation.prototype, "motifHospitalisation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutHospitalisation }),
    __metadata("design:type", String)
], PlanLitBedHospitalisation.prototype, "statutHospitalisation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cholécystite lithiasique', required: false, nullable: true }),
    __metadata("design:type", Object)
], PlanLitBedHospitalisation.prototype, "diagnostic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PlanLitBedHospitalisation.prototype, "soinsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Object)
], PlanLitBedHospitalisation.prototype, "patient", void 0);
class PlanLitBedItem {
}
exports.PlanLitBedItem = PlanLitBedItem;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9a1b2c3d-4e5f-6789-abcd-ef0123456789' }),
    __metadata("design:type", String)
], PlanLitBedItem.prototype, "litId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A1' }),
    __metadata("design:type", String)
], PlanLitBedItem.prototype, "codeLit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: hospitalisation_entities_1.StatutLit }),
    __metadata("design:type", String)
], PlanLitBedItem.prototype, "statut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PlanLitBedHospitalisation, required: false, nullable: true }),
    __metadata("design:type", Object)
], PlanLitBedItem.prototype, "hospitalisation", void 0);
class PlanLitRoomItem {
}
exports.PlanLitRoomItem = PlanLitRoomItem;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1a2b3c4d-5e6f-7890-abcd-ef0123456789' }),
    __metadata("design:type", String)
], PlanLitRoomItem.prototype, "chambreId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101 }),
    __metadata("design:type", Number)
], PlanLitRoomItem.prototype, "numeroChambre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Standard' }),
    __metadata("design:type", String)
], PlanLitRoomItem.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PlanLitBedItem] }),
    __metadata("design:type", Array)
], PlanLitRoomItem.prototype, "lits", void 0);
class PlanLitsStats {
}
exports.PlanLitsStats = PlanLitsStats;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24 }),
    __metadata("design:type", Number)
], PlanLitsStats.prototype, "totalLits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18 }),
    __metadata("design:type", Number)
], PlanLitsStats.prototype, "litsOccupes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18 }),
    __metadata("design:type", Number)
], PlanLitsStats.prototype, "totalPatients", void 0);
class PlanLitsResponse {
}
exports.PlanLitsResponse = PlanLitsResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'service-123' }),
    __metadata("design:type", String)
], PlanLitsResponse.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PlanLitRoomItem] }),
    __metadata("design:type", Array)
], PlanLitsResponse.prototype, "chambres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PlanLitsStats }),
    __metadata("design:type", PlanLitsStats)
], PlanLitsResponse.prototype, "stats", void 0);
//# sourceMappingURL=hospitalisation.dto.js.map