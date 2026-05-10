"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hospitalisation_module_1 = require("../hospitalisation/hospitalisation.module");
const vpa_module_1 = require("../vpa/vpa.module");
const bloc_entity_1 = require("./bloc.entity");
const bloc_service_1 = require("./bloc.service");
const bloc_controller_1 = require("./bloc.controller");
const bloc_resolver_1 = require("./bloc.resolver");
let BlocModule = class BlocModule {
};
exports.BlocModule = BlocModule;
exports.BlocModule = BlocModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bloc_entity_1.BlocOperatoireEntity]), vpa_module_1.VpaModule, hospitalisation_module_1.HospitalisationModule],
        providers: [bloc_service_1.BlocService, bloc_resolver_1.BlocResolver],
        controllers: [bloc_controller_1.BlocController],
        exports: [bloc_service_1.BlocService],
    })
], BlocModule);
//# sourceMappingURL=bloc.module.js.map