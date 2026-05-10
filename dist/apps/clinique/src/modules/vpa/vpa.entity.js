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
exports.VpaEntity = exports.VpaStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const hospitalisation_entities_1 = require("../hospitalisation/hospitalisation.entities");
var VpaStatus;
(function (VpaStatus) {
    VpaStatus["EN_ATTENTE"] = "EN_ATTENTE";
    VpaStatus["VALIDEE"] = "VALIDEE";
})(VpaStatus || (exports.VpaStatus = VpaStatus = {}));
(0, graphql_1.registerEnumType)(VpaStatus, { name: 'VpaStatus' });
let VpaEntity = class VpaEntity {
};
exports.VpaEntity = VpaEntity;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VpaEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VpaEntity.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ name: 'hospitalisation_id', type: 'uuid' }),
    __metadata("design:type", String)
], VpaEntity.prototype, "hospitalisationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hospitalisation_entities_1.HospitalisationEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'hospitalisation_id' }),
    __metadata("design:type", hospitalisation_entities_1.HospitalisationEntity)
], VpaEntity.prototype, "hospitalisation", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VpaEntity.prototype, "cpaId", void 0);
__decorate([
    (0, graphql_1.Field)(() => VpaStatus),
    (0, typeorm_1.Column)({ type: 'varchar', default: VpaStatus.EN_ATTENTE }),
    __metadata("design:type", String)
], VpaEntity.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VpaEntity.prototype, "createdAt", void 0);
exports.VpaEntity = VpaEntity = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('vpa')
], VpaEntity);
//# sourceMappingURL=vpa.entity.js.map