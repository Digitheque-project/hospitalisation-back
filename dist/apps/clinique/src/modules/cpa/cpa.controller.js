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
const cpa_service_1 = require("./cpa.service");
const create_cpa_input_1 = require("./create-cpa.input");
let CpaController = class CpaController {
    constructor(cpaService) {
        this.cpaService = cpaService;
    }
    create(body) {
        return this.cpaService.create(body);
    }
    markRealise(id) {
        return this.cpaService.markAsRealise(id);
    }
};
exports.CpaController = CpaController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Creer une CPA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CPA creee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cpa_input_1.CreateCpaInput]),
    __metadata("design:returntype", void 0)
], CpaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/realise'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer la CPA comme REALISEE' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CPA mise a jour' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CpaController.prototype, "markRealise", null);
exports.CpaController = CpaController = __decorate([
    (0, swagger_1.ApiTags)('CPA'),
    (0, common_1.Controller)('cpa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [cpa_service_1.CpaService])
], CpaController);
//# sourceMappingURL=cpa.controller.js.map