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
exports.PlanifierBlocInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let PlanifierBlocInput = class PlanifierBlocInput {
};
exports.PlanifierBlocInput = PlanifierBlocInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant patient', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanifierBlocInput.prototype, "patientId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant hospitalisation', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanifierBlocInput.prototype, "hospitalisationId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Identifiant VPA', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanifierBlocInput.prototype, "vpaId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Checklist OMS avant induction', required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PlanifierBlocInput.prototype, "checklistAvantInduction", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Checklist OMS avant incision', required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PlanifierBlocInput.prototype, "checklistAvantIncision", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Checklist OMS en sortie bloc', required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PlanifierBlocInput.prototype, "checklistSortieBloc", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Protocole operatoire', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanifierBlocInput.prototype, "protocoleOperatoire", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Prescription post-operatoire', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanifierBlocInput.prototype, "prescriptionPostOperatoire", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: String, description: 'Reperes post-operatoires', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanifierBlocInput.prototype, "reperesPostOperatoires", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Score SCCRE (0-10)', required: true }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], PlanifierBlocInput.prototype, "scoreSccre", void 0);
exports.PlanifierBlocInput = PlanifierBlocInput = __decorate([
    (0, graphql_1.InputType)()
], PlanifierBlocInput);
//# sourceMappingURL=planifier-bloc.input.js.map