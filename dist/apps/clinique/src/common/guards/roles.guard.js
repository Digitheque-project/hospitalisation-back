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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
let RolesGuard = class RolesGuard {
    constructor(reflector, configService) {
        this.reflector = reflector;
        this.configService = configService;
    }
    canActivate(context) {
        return true;
    }
    getRequest(context) {
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest();
        }
        const gqlContext = graphql_1.GqlExecutionContext.create(context).getContext();
        return gqlContext.req;
    }
    getAllowedProfiles() {
        const rawProfiles = this.configService.get('SECURITY_ALLOWED_PROFILES', 'ONM,ONIM');
        return rawProfiles
            .split(',')
            .map((profile) => profile.trim())
            .filter((profile) => profile.length > 0);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map