"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let JwtAuthGuard = class JwtAuthGuard {
    canActivate(context) {
        const request = this.getRequest(context);
        const authorization = request?.headers?.authorization;
        const token = Array.isArray(authorization) ? authorization[0] : authorization;
        if (!token || !String(token).startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Token JWT manquant ou invalide');
        }
        const userIdHeader = request.headers?.['x-user-id'];
        const roleHeader = request.headers?.['x-profile'];
        const orderNumberHeader = request.headers?.['x-order-number'];
        request.user = {
            id: Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader,
            role: Array.isArray(roleHeader) ? roleHeader[0] : roleHeader,
            orderNumber: Array.isArray(orderNumberHeader) ? orderNumberHeader[0] : orderNumberHeader,
        };
        return true;
    }
    getRequest(context) {
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest();
        }
        return graphql_1.GqlExecutionContext.create(context).getContext().req;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map