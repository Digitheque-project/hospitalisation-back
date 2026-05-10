"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cpa_module_1 = require("../cpa/cpa.module");
const hospitalisation_module_1 = require("../hospitalisation/hospitalisation.module");
const vpa_entity_1 = require("./vpa.entity");
const vpa_service_1 = require("./vpa.service");
const vpa_controller_1 = require("./vpa.controller");
const vpa_resolver_1 = require("./vpa.resolver");
let VpaModule = class VpaModule {
};
exports.VpaModule = VpaModule;
exports.VpaModule = VpaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vpa_entity_1.VpaEntity]), cpa_module_1.CpaModule, hospitalisation_module_1.HospitalisationModule],
        providers: [vpa_service_1.VpaService, vpa_resolver_1.VpaResolver],
        controllers: [vpa_controller_1.VpaController],
        exports: [vpa_service_1.VpaService],
    })
], VpaModule);
//# sourceMappingURL=vpa.module.js.map