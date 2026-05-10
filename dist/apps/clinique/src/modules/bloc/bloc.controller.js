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
exports.BlocController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const bloc_service_1 = require("./bloc.service");
const planifier_bloc_input_1 = require("./planifier-bloc.input");
let BlocController = class BlocController {
    constructor(blocService) {
        this.blocService = blocService;
    }
    planifier(body) {
        return this.blocService.planifier(body);
    }
};
exports.BlocController = BlocController;
__decorate([
    (0, common_1.Post)('planifier'),
    (0, roles_decorator_1.Roles)('ONM'),
    (0, swagger_1.ApiOperation)({ summary: 'Planifier un passage au bloc' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Planification bloc creee' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [planifier_bloc_input_1.PlanifierBlocInput]),
    __metadata("design:returntype", void 0)
], BlocController.prototype, "planifier", null);
exports.BlocController = BlocController = __decorate([
    (0, swagger_1.ApiTags)('Bloc'),
    (0, common_1.Controller)('bloc'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [bloc_service_1.BlocService])
], BlocController);
//# sourceMappingURL=bloc.controller.js.map