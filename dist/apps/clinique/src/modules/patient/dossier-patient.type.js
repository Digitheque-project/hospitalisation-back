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
exports.DossierPatientUnique = void 0;
const graphql_1 = require("@nestjs/graphql");
const cpa_entity_1 = require("../cpa/cpa.entity");
const vpa_entity_1 = require("../vpa/vpa.entity");
let DossierPatientUnique = class DossierPatientUnique {
};
exports.DossierPatientUnique = DossierPatientUnique;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DossierPatientUnique.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(() => cpa_entity_1.CpaEntity, { nullable: true }),
    __metadata("design:type", Object)
], DossierPatientUnique.prototype, "cpa", void 0);
__decorate([
    (0, graphql_1.Field)(() => vpa_entity_1.VpaEntity, { nullable: true }),
    __metadata("design:type", Object)
], DossierPatientUnique.prototype, "vpa", void 0);
exports.DossierPatientUnique = DossierPatientUnique = __decorate([
    (0, graphql_1.ObjectType)()
], DossierPatientUnique);
//# sourceMappingURL=dossier-patient.type.js.map