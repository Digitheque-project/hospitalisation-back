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
exports.BlocOperatoireEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const hospitalisation_entities_1 = require("../hospitalisation/hospitalisation.entities");
const vpa_entity_1 = require("../vpa/vpa.entity");
let BlocOperatoireEntity = class BlocOperatoireEntity {
};
exports.BlocOperatoireEntity = BlocOperatoireEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'hospitalisation_id', type: 'uuid' }),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "hospitalisationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hospitalisation_entities_1.HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'hospitalisation_id' }),
    __metadata("design:type", hospitalisation_entities_1.HospitalisationEntity)
], BlocOperatoireEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "vpaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vpa_entity_1.VpaEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'vpaId', referencedColumnName: 'id' }),
    __metadata("design:type", vpa_entity_1.VpaEntity)
], BlocOperatoireEntity.prototype, "vpa", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BlocOperatoireEntity.prototype, "checklistAvantInduction", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BlocOperatoireEntity.prototype, "checklistAvantIncision", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BlocOperatoireEntity.prototype, "checklistSortieBloc", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "protocoleOperatoire", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "prescriptionPostOperatoire", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BlocOperatoireEntity.prototype, "reperesPostOperatoires", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BlocOperatoireEntity.prototype, "scoreSccre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BlocOperatoireEntity.prototype, "sortieSalleReveilAutorisee", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlocOperatoireEntity.prototype, "createdAt", void 0);
exports.BlocOperatoireEntity = BlocOperatoireEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('bloc_operatoire')
], BlocOperatoireEntity);
//# sourceMappingURL=bloc.entity.js.map