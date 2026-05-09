"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cpa_entity_1 = require("./cpa.entity");
const cpa_service_1 = require("./cpa.service");
const cpa_controller_1 = require("./cpa.controller");
const cpa_resolver_1 = require("./cpa.resolver");
let CpaModule = class CpaModule {
};
exports.CpaModule = CpaModule;
exports.CpaModule = CpaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cpa_entity_1.CpaEntity])],
        providers: [cpa_service_1.CpaService, cpa_resolver_1.CpaResolver],
        controllers: [cpa_controller_1.CpaController],
        exports: [cpa_service_1.CpaService],
    })
], CpaModule);
//# sourceMappingURL=cpa.module.js.map