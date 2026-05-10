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
exports.CpaResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const cpa_entity_1 = require("./cpa.entity");
const cpa_service_1 = require("./cpa.service");
const create_cpa_input_1 = require("./create-cpa.input");
let CpaResolver = class CpaResolver {
    constructor(cpaService) {
        this.cpaService = cpaService;
    }
    createCpa(input) {
        return this.cpaService.create(input);
    }
    latestCpa(patientId) {
        return this.cpaService.findLatestByPatient(patientId);
    }
};
exports.CpaResolver = CpaResolver;
__decorate([
    (0, graphql_1.Mutation)(() => cpa_entity_1.CpaEntity),
    (0, roles_decorator_1.Roles)('ONM'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cpa_input_1.CreateCpaInput]),
    __metadata("design:returntype", void 0)
], CpaResolver.prototype, "createCpa", null);
__decorate([
    (0, graphql_1.Query)(() => cpa_entity_1.CpaEntity, { nullable: true }),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    __param(0, (0, graphql_1.Args)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CpaResolver.prototype, "latestCpa", null);
exports.CpaResolver = CpaResolver = __decorate([
    (0, graphql_1.Resolver)(() => cpa_entity_1.CpaEntity),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [cpa_service_1.CpaService])
], CpaResolver);
//# sourceMappingURL=cpa.resolver.js.map