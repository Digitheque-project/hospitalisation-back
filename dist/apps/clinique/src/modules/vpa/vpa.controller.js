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
exports.VpaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const uuid_1 = require("../../common/utils/uuid");
const create_vpa_input_1 = require("./create-vpa.input");
const vpa_entity_1 = require("./vpa.entity");
const vpa_service_1 = require("./vpa.service");
class VpaStatsResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 32 }),
    __metadata("design:type", Number)
], VpaStatsResponse.prototype, "pending", void 0);
let VpaController = class VpaController {
    constructor(vpaService) {
        this.vpaService = vpaService;
    }
    async getStats() {
        const pending = await this.vpaService.getPendingCount();
        return { pending };
    }
    create(body) {
        return this.vpaService.create(body);
    }
    async getById(id) {
        if (!(0, uuid_1.isUuidV4)(id)) {
            return {};
        }
        return (await this.vpaService.findById(id)) ?? {};
    }
    async getLatestByPatient(patientId) {
        if (!(0, uuid_1.isUuidV4)(patientId)) {
            return {};
        }
        return (await this.vpaService.findLatestByPatient(patientId)) ?? {};
    }
    validate(id) {
        return this.vpaService.validate(id);
    }
};
exports.VpaController = VpaController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer les indicateurs VPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Indicateurs VPA retournes', type: VpaStatsResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VpaController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une VPA' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'VPA creee', type: vpa_entity_1.VpaEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vpa_input_1.CreateVpaInput]),
    __metadata("design:returntype", void 0)
], VpaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer une VPA par identifiant' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant de la VPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VPA retournee', type: vpa_entity_1.VpaEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VpaController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/latest'),
    (0, roles_decorator_1.Roles)('ONM', 'ONIM'),
    (0, swagger_1.ApiOperation)({ summary: 'Recuperer la derniere VPA dun patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Identifiant patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Derniere VPA retournee', type: vpa_entity_1.VpaEntity }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VpaController.prototype, "getLatestByPatient", null);
__decorate([
    (0, common_1.Patch)(':id/validate'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Valider la VPA' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identifiant de la VPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VPA validee', type: vpa_entity_1.VpaEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VpaController.prototype, "validate", null);
exports.VpaController = VpaController = __decorate([
    (0, swagger_1.ApiTags)('VPA'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('vpa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [vpa_service_1.VpaService])
], VpaController);
//# sourceMappingURL=vpa.controller.js.map