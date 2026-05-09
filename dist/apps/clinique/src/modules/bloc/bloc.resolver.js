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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const bloc_entity_1 = require("./bloc.entity");
const bloc_service_1 = require("./bloc.service");
const planifier_bloc_input_1 = require("./planifier-bloc.input");
let BlocResolver = class BlocResolver {
    constructor(blocService) {
        this.blocService = blocService;
    }
    planifierBloc(input) {
        return this.blocService.planifier(input);
    }
    latestBloc(patientId) {
        return this.blocService.findLatestByPatient(patientId);
    }
};
exports.BlocResolver = BlocResolver;
__decorate([
    (0, graphql_1.Mutation)(() => bloc_entity_1.BlocOperatoireEntity),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [planifier_bloc_input_1.PlanifierBlocInput]),
    __metadata("design:returntype", void 0)
], BlocResolver.prototype, "planifierBloc", null);
__decorate([
    (0, graphql_1.Query)(() => bloc_entity_1.BlocOperatoireEntity, { nullable: true }),
    __param(0, (0, graphql_1.Args)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlocResolver.prototype, "latestBloc", null);
exports.BlocResolver = BlocResolver = __decorate([
    (0, graphql_1.Resolver)(() => bloc_entity_1.BlocOperatoireEntity),
    __metadata("design:paramtypes", [bloc_service_1.BlocService])
], BlocResolver);
//# sourceMappingURL=bloc.resolver.js.map