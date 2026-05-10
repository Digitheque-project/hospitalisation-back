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
exports.CreateCpaInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let CreateCpaInput = class CreateCpaInput {
};
exports.CreateCpaInput = CreateCpaInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant patient', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCpaInput.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant hospitalisation', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCpaInput.prototype, "hospitalisationId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Score ASA', required: true }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateCpaInput.prototype, "asaScore", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Type de chirurgie', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCpaInput.prototype, "typeChirurgie", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Nom du chirurgien', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCpaInput.prototype, "chirurgien", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Duree prevue en minutes', required: true }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCpaInput.prototype, "dureePrevueMinutes", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Risque hemorragique', required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCpaInput.prototype, "risqueHemorragique", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Intervention en urgence', required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCpaInput.prototype, "urgence", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Decision anesthesique', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCpaInput.prototype, "decisionAnesthesique", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Protocole et instructions pre-anesthesiques',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCpaInput.prototype, "protocoleInstructions", void 0);
exports.CreateCpaInput = CreateCpaInput = __decorate([
    (0, graphql_1.InputType)()
], CreateCpaInput);
//# sourceMappingURL=create-cpa.input.js.map