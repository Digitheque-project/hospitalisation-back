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
exports.AvisMedicalEntity = exports.DemandeAvisEntity = exports.TransfertEntity = exports.DemandeTransfertEntity = exports.AffectationMedecinEntity = exports.AffectationLitEntity = exports.LitEntity = exports.ChambreEntity = exports.SoinsEntity = exports.DiagnosticsEntity = exports.ObservationMedicalEntity = exports.PrescriptionMedicaleEntity = exports.HospitalisationEntity = exports.ModeSortieEntity = exports.PersonnelRefEntity = exports.ServiceRefEntity = exports.StatutDemandeTransfert = exports.StatutDemande = exports.StatutLit = exports.StatutHospitalisation = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
var StatutHospitalisation;
(function (StatutHospitalisation) {
    StatutHospitalisation["EN_COURS"] = "EN_COURS";
    StatutHospitalisation["CLOTUREE"] = "CLOTUREE";
})(StatutHospitalisation || (exports.StatutHospitalisation = StatutHospitalisation = {}));
var StatutLit;
(function (StatutLit) {
    StatutLit["DISPONIBLE"] = "DISPONIBLE";
    StatutLit["OCCUPE"] = "OCCUPE";
    StatutLit["MAINTENANCE"] = "MAINTENANCE";
})(StatutLit || (exports.StatutLit = StatutLit = {}));
var StatutDemande;
(function (StatutDemande) {
    StatutDemande["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemande["CONSULTEE"] = "CONSULTEE";
    StatutDemande["ACCEPTE"] = "ACCEPTE";
    StatutDemande["REFUSE"] = "REFUSE";
})(StatutDemande || (exports.StatutDemande = StatutDemande = {}));
var StatutDemandeTransfert;
(function (StatutDemandeTransfert) {
    StatutDemandeTransfert["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemandeTransfert["ACCEPTE"] = "ACCEPTE";
    StatutDemandeTransfert["REFUSE"] = "REFUSE";
})(StatutDemandeTransfert || (exports.StatutDemandeTransfert = StatutDemandeTransfert = {}));
(0, graphql_1.registerEnumType)(StatutHospitalisation, { name: 'StatutHospitalisation' });
(0, graphql_1.registerEnumType)(StatutLit, { name: 'StatutLit' });
(0, graphql_1.registerEnumType)(StatutDemande, { name: 'StatutDemande' });
(0, graphql_1.registerEnumType)(StatutDemandeTransfert, { name: 'StatutDemandeTransfert' });
let ServiceRefEntity = class ServiceRefEntity {
};
exports.ServiceRefEntity = ServiceRefEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryColumn)({ name: 'id_service', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], ServiceRefEntity.prototype, "id", void 0);
exports.ServiceRefEntity = ServiceRefEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('service_ref')
], ServiceRefEntity);
let PersonnelRefEntity = class PersonnelRefEntity {
};
exports.PersonnelRefEntity = PersonnelRefEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryColumn)({ name: 'id_personnel', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], PersonnelRefEntity.prototype, "id", void 0);
exports.PersonnelRefEntity = PersonnelRefEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('personnel_ref')
], PersonnelRefEntity);
let ModeSortieEntity = class ModeSortieEntity {
};
exports.ModeSortieEntity = ModeSortieEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_mode_sortie' }),
    __metadata("design:type", String)
], ModeSortieEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'nom_mode_sortie', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], ModeSortieEntity.prototype, "nomModeSortie", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HospitalisationEntity, (hospitalisation) => hospitalisation.modeSortie),
    __metadata("design:type", Array)
], ModeSortieEntity.prototype, "hospitalisations", void 0);
exports.ModeSortieEntity = ModeSortieEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('mode_sortie')
], ModeSortieEntity);
let HospitalisationEntity = class HospitalisationEntity {
};
exports.HospitalisationEntity = HospitalisationEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_hospitalisation' }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_patient', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_service', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ServiceRefEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_service', referencedColumnName: 'id' }),
    __metadata("design:type", ServiceRefEntity)
], HospitalisationEntity.prototype, "service", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_entrer', type: 'timestamp' }),
    __metadata("design:type", Date)
], HospitalisationEntity.prototype, "dateEntrer", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'date_sortie', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], HospitalisationEntity.prototype, "dateSortie", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'motif_hospitalisation', type: 'text' }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "motifHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'type_hospitalisation', type: 'varchar', length: 40, default: 'Hospitalisation' }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => StatutHospitalisation),
    (0, typeorm_1.Column)({ name: 'statut_hospitalisation', type: 'varchar', default: StatutHospitalisation.EN_COURS }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "statutHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(() => StatutDemande),
    (0, typeorm_1.Column)({ name: 'status_demande', type: 'varchar', default: StatutDemande.EN_ATTENTE }),
    __metadata("design:type", String)
], HospitalisationEntity.prototype, "statusDemande", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'commentaire', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], HospitalisationEntity.prototype, "commentaire", void 0);
__decorate([
    (0, graphql_1.Field)(() => ModeSortieEntity, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => ModeSortieEntity, (modeSortie) => modeSortie.hospitalisations, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_mode_sortie' }),
    __metadata("design:type", Object)
], HospitalisationEntity.prototype, "modeSortie", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_mode_sortie', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], HospitalisationEntity.prototype, "idModeSortie", void 0);
exports.HospitalisationEntity = HospitalisationEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('hospitalisation')
], HospitalisationEntity);
let PrescriptionMedicaleEntity = class PrescriptionMedicaleEntity {
};
exports.PrescriptionMedicaleEntity = PrescriptionMedicaleEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_prescription' }),
    __metadata("design:type", String)
], PrescriptionMedicaleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], PrescriptionMedicaleEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], PrescriptionMedicaleEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_medecin', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], PrescriptionMedicaleEntity.prototype, "idMedecin", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'contenu_prescription', type: 'text' }),
    __metadata("design:type", String)
], PrescriptionMedicaleEntity.prototype, "contenuPrescription", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_prescription', type: 'timestamp' }),
    __metadata("design:type", Date)
], PrescriptionMedicaleEntity.prototype, "datePrescription", void 0);
exports.PrescriptionMedicaleEntity = PrescriptionMedicaleEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('prescription_medicale')
], PrescriptionMedicaleEntity);
let ObservationMedicalEntity = class ObservationMedicalEntity {
};
exports.ObservationMedicalEntity = ObservationMedicalEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_observation' }),
    __metadata("design:type", String)
], ObservationMedicalEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], ObservationMedicalEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_personnel', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], ObservationMedicalEntity.prototype, "idPersonnel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PersonnelRefEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_personnel', referencedColumnName: 'id' }),
    __metadata("design:type", PersonnelRefEntity)
], ObservationMedicalEntity.prototype, "personnel", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_observation', type: 'timestamp' }),
    __metadata("design:type", Date)
], ObservationMedicalEntity.prototype, "dateObservation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'contenu_observation', type: 'text' }),
    __metadata("design:type", String)
], ObservationMedicalEntity.prototype, "contenuObservation", void 0);
exports.ObservationMedicalEntity = ObservationMedicalEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('observation_medical')
], ObservationMedicalEntity);
let DiagnosticsEntity = class DiagnosticsEntity {
};
exports.DiagnosticsEntity = DiagnosticsEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_diagnostic' }),
    __metadata("design:type", String)
], DiagnosticsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], DiagnosticsEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], DiagnosticsEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_personnel', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DiagnosticsEntity.prototype, "idPersonnel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PersonnelRefEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_personnel', referencedColumnName: 'id' }),
    __metadata("design:type", PersonnelRefEntity)
], DiagnosticsEntity.prototype, "personnel", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_diagnostics', type: 'timestamp' }),
    __metadata("design:type", Date)
], DiagnosticsEntity.prototype, "dateDiagnostics", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'description_diagnostic', type: 'text' }),
    __metadata("design:type", String)
], DiagnosticsEntity.prototype, "descriptionDiagnostic", void 0);
exports.DiagnosticsEntity = DiagnosticsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('diagnostics')
], DiagnosticsEntity);
let SoinsEntity = class SoinsEntity {
};
exports.SoinsEntity = SoinsEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_soins' }),
    __metadata("design:type", String)
], SoinsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], SoinsEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], SoinsEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_personnel', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], SoinsEntity.prototype, "idPersonnel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PersonnelRefEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_personnel', referencedColumnName: 'id' }),
    __metadata("design:type", PersonnelRefEntity)
], SoinsEntity.prototype, "personnel", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'type_soins', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], SoinsEntity.prototype, "typeSoins", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_soins', type: 'timestamp' }),
    __metadata("design:type", Date)
], SoinsEntity.prototype, "dateSoins", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'observations_soins', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SoinsEntity.prototype, "observationsSoins", void 0);
exports.SoinsEntity = SoinsEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('soins')
], SoinsEntity);
let ChambreEntity = class ChambreEntity {
};
exports.ChambreEntity = ChambreEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_chambre' }),
    __metadata("design:type", String)
], ChambreEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_service', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], ChambreEntity.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ServiceRefEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_service', referencedColumnName: 'id' }),
    __metadata("design:type", ServiceRefEntity)
], ChambreEntity.prototype, "service", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ name: 'numero_chambre', type: 'int' }),
    __metadata("design:type", Number)
], ChambreEntity.prototype, "numeroChambre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'type', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], ChambreEntity.prototype, "type", void 0);
exports.ChambreEntity = ChambreEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('chambre')
], ChambreEntity);
let LitEntity = class LitEntity {
};
exports.LitEntity = LitEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_lit' }),
    __metadata("design:type", String)
], LitEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_chambre', type: 'uuid' }),
    __metadata("design:type", String)
], LitEntity.prototype, "idChambre", void 0);
__decorate([
    (0, graphql_1.Field)(() => ChambreEntity),
    (0, typeorm_1.ManyToOne)(() => ChambreEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_chambre' }),
    __metadata("design:type", ChambreEntity)
], LitEntity.prototype, "chambre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'code_lit', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], LitEntity.prototype, "codeLit", void 0);
__decorate([
    (0, graphql_1.Field)(() => StatutLit),
    (0, typeorm_1.Column)({ name: 'statut', type: 'varchar', default: StatutLit.DISPONIBLE }),
    __metadata("design:type", String)
], LitEntity.prototype, "statut", void 0);
exports.LitEntity = LitEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('lit')
], LitEntity);
let AffectationLitEntity = class AffectationLitEntity {
};
exports.AffectationLitEntity = AffectationLitEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_affectation' }),
    __metadata("design:type", String)
], AffectationLitEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], AffectationLitEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(() => HospitalisationEntity),
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], AffectationLitEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_lit', type: 'uuid' }),
    __metadata("design:type", String)
], AffectationLitEntity.prototype, "idLit", void 0);
__decorate([
    (0, graphql_1.Field)(() => LitEntity),
    (0, typeorm_1.ManyToOne)(() => LitEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_lit' }),
    __metadata("design:type", LitEntity)
], AffectationLitEntity.prototype, "lit", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_debut_affectation', type: 'timestamp' }),
    __metadata("design:type", Date)
], AffectationLitEntity.prototype, "dateDebutAffectation", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'date_fin_affectation', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AffectationLitEntity.prototype, "dateFinAffectation", void 0);
exports.AffectationLitEntity = AffectationLitEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('affectation_lit')
], AffectationLitEntity);
let AffectationMedecinEntity = class AffectationMedecinEntity {
};
exports.AffectationMedecinEntity = AffectationMedecinEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_affectation' }),
    __metadata("design:type", String)
], AffectationMedecinEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], AffectationMedecinEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(() => HospitalisationEntity),
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], AffectationMedecinEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_personnel', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], AffectationMedecinEntity.prototype, "idPersonnel", void 0);
__decorate([
    (0, graphql_1.Field)(() => PersonnelRefEntity),
    (0, typeorm_1.ManyToOne)(() => PersonnelRefEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_personnel', referencedColumnName: 'id' }),
    __metadata("design:type", PersonnelRefEntity)
], AffectationMedecinEntity.prototype, "personnel", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_debut', type: 'timestamp' }),
    __metadata("design:type", Date)
], AffectationMedecinEntity.prototype, "dateDebut", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'date_fin', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AffectationMedecinEntity.prototype, "dateFin", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'role', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], AffectationMedecinEntity.prototype, "role", void 0);
exports.AffectationMedecinEntity = AffectationMedecinEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('affectation_medecin')
], AffectationMedecinEntity);
let DemandeTransfertEntity = class DemandeTransfertEntity {
};
exports.DemandeTransfertEntity = DemandeTransfertEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_demande_transfert' }),
    __metadata("design:type", String)
], DemandeTransfertEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], DemandeTransfertEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(() => HospitalisationEntity),
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], DemandeTransfertEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'service_source', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DemandeTransfertEntity.prototype, "serviceSource", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'service_destination', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DemandeTransfertEntity.prototype, "serviceDestination", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_demande', type: 'timestamp' }),
    __metadata("design:type", Date)
], DemandeTransfertEntity.prototype, "dateDemande", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'motif_demande_transfert', type: 'text' }),
    __metadata("design:type", String)
], DemandeTransfertEntity.prototype, "motifDemandeTransfert", void 0);
__decorate([
    (0, graphql_1.Field)(() => StatutDemandeTransfert),
    (0, typeorm_1.Column)({ name: 'statut', type: 'varchar', default: StatutDemandeTransfert.EN_ATTENTE }),
    __metadata("design:type", String)
], DemandeTransfertEntity.prototype, "statut", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'justification', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DemandeTransfertEntity.prototype, "justification", void 0);
exports.DemandeTransfertEntity = DemandeTransfertEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('demande_transfert')
], DemandeTransfertEntity);
let TransfertEntity = class TransfertEntity {
};
exports.TransfertEntity = TransfertEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_transfert' }),
    __metadata("design:type", String)
], TransfertEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => DemandeTransfertEntity),
    (0, typeorm_1.ManyToOne)(() => DemandeTransfertEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_demande' }),
    __metadata("design:type", DemandeTransfertEntity)
], TransfertEntity.prototype, "demande", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_demande', type: 'uuid' }),
    __metadata("design:type", String)
], TransfertEntity.prototype, "idDemande", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_transfert', type: 'timestamp' }),
    __metadata("design:type", Date)
], TransfertEntity.prototype, "dateTransfert", void 0);
exports.TransfertEntity = TransfertEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('transfert')
], TransfertEntity);
let DemandeAvisEntity = class DemandeAvisEntity {
};
exports.DemandeAvisEntity = DemandeAvisEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_demande' }),
    __metadata("design:type", String)
], DemandeAvisEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_hospitalisation', type: 'uuid' }),
    __metadata("design:type", String)
], DemandeAvisEntity.prototype, "idHospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(() => HospitalisationEntity),
    (0, typeorm_1.ManyToOne)(() => HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_hospitalisation' }),
    __metadata("design:type", HospitalisationEntity)
], DemandeAvisEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_medecin_demandeur', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DemandeAvisEntity.prototype, "idMedecinDemandeur", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_service_cible', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DemandeAvisEntity.prototype, "idServiceCible", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'motif', type: 'text' }),
    __metadata("design:type", String)
], DemandeAvisEntity.prototype, "motif", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_demande', type: 'timestamp' }),
    __metadata("design:type", Date)
], DemandeAvisEntity.prototype, "dateDemande", void 0);
__decorate([
    (0, graphql_1.Field)(() => StatutDemande),
    (0, typeorm_1.Column)({ name: 'statut', type: 'varchar', default: StatutDemande.EN_ATTENTE }),
    __metadata("design:type", String)
], DemandeAvisEntity.prototype, "statut", void 0);
exports.DemandeAvisEntity = DemandeAvisEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('demande_avis')
], DemandeAvisEntity);
let AvisMedicalEntity = class AvisMedicalEntity {
};
exports.AvisMedicalEntity = AvisMedicalEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id_avis' }),
    __metadata("design:type", String)
], AvisMedicalEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => DemandeAvisEntity),
    (0, typeorm_1.ManyToOne)(() => DemandeAvisEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_demande' }),
    __metadata("design:type", DemandeAvisEntity)
], AvisMedicalEntity.prototype, "demande", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_demande', type: 'uuid' }),
    __metadata("design:type", String)
], AvisMedicalEntity.prototype, "idDemande", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'id_medecin', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], AvisMedicalEntity.prototype, "idMedecin", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ name: 'date_avis', type: 'timestamp' }),
    __metadata("design:type", Date)
], AvisMedicalEntity.prototype, "dateAvis", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'conclusion', type: 'text' }),
    __metadata("design:type", String)
], AvisMedicalEntity.prototype, "conclusion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'recomandation', type: 'text' }),
    __metadata("design:type", String)
], AvisMedicalEntity.prototype, "recomandation", void 0);
exports.AvisMedicalEntity = AvisMedicalEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('avis_medical')
], AvisMedicalEntity);
//# sourceMappingURL=hospitalisation.entities.js.map