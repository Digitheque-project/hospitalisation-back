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
exports.CpaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const uuid_1 = require("../../common/utils/uuid");
const cpa_entity_1 = require("./cpa.entity");
const cpa_service_1 = require("./cpa.service");
const create_cpa_input_1 = require("./create-cpa.input");
class CpaStatsResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], CpaStatsResponse.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CpaStatsResponse.prototype, "urgent", void 0);
class ExternalConsultationItem {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '8b6ae0d9-62f9-4e4e-80ad-9e2b2d0a96e0' }),
    __metadata("design:type", String)
], ExternalConsultationItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' }),
    __metadata("design:type", String)
], ExternalConsultationItem.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chirurgie digestive' }),
    __metadata("design:type", String)
], ExternalConsultationItem.prototype, "typeChirurgie", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr. Pierre' }),
    __metadata("design:type", String)
], ExternalConsultationItem.prototype, "chirurgien", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], ExternalConsultationItem.prototype, "asaScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ExternalConsultationItem.prototype, "urgence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-11T08:15:00.000Z' }),
    __metadata("design:type", String)
], ExternalConsultationItem.prototype, "createdAt", void 0);
let CpaController = class CpaController {
    constructor(cpaService) {
        this.cpaService = cpaService;
    }
    async getStats() {
        return this.cpaService.getStats();
    }
    async getExternalConsultations(limit) {
        const items = await this.cpaService.getRecent(this.parseLimit(limit));
        return items.map((item) => ({
            id: item.id,
            patientId: item.patientId,
            typeChirurgie: item.typeChirurgie,
            chirurgien: item.chirurgien,
            asaScore: item.asaScore,
            urgence: item.urgence,
            createdAt: item.createdAt.toISOString(),
        }));
    }
    create(body) {
        return this.cpaService.create(body);
    }
    async getById(id) {
        if (!(0, uuid_1.isUuidV4)(id)) {
            return {};
        }
        return (await this.cpaService.findById(id)) ?? {};
    }
    async getLatestByPatient(patientId) {
        if (!(0, uuid_1.isUuidV4)(patientId)) {
            return {};
        }
        return (await this.cpaService.findLatestByPatient(patientId)) ?? {};
    }
    markRealise(id) {
        return this.cpaService.markAsRealise(id);
    }
    parseLimit(raw) {
        if (!raw) {
            return Number.NaN;
        }
        const parsed = Number.parseInt(raw, 10);
        return Number.isNaN(parsed) ? Number.NaN : parsed;
    }
};
exports.CpaController = CpaController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer les indicateurs CPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Indicateurs CPA retournes', type: CpaStatsResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CpaController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('external-consultations'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les consultations externes (CPA)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 6 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des consultations externes', type: ExternalConsultationItem, isArray: true }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CpaController.prototype, "getExternalConsultations", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une CPA' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'CPA creee', type: cpa_entity_1.CpaEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cpa_input_1.CreateCpaInput]),
    __metadata("design:returntype", void 0)
], CpaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer une CPA par identifiant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant de la CPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CPA retournee', type: cpa_entity_1.CpaEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CpaController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/latest'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer la derniere CPA dun patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Identifiant patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Derniere CPA retournee', type: cpa_entity_1.CpaEntity }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CpaController.prototype, "getLatestByPatient", null);
__decorate([
    (0, common_1.Patch)(':id/realise'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer la CPA comme REALISEE' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant de la CPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CPA mise a jour', type: cpa_entity_1.CpaEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CpaController.prototype, "markRealise", null);
exports.CpaController = CpaController = __decorate([
    (0, swagger_1.ApiTags)('CPA'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cpa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [cpa_service_1.CpaService])
], CpaController);
//# sourceMappingURL=cpa.controller.js.map