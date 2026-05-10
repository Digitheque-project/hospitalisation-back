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
exports.VpaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cpa_service_1 = require("../cpa/cpa.service");
const cpa_entity_1 = require("../cpa/cpa.entity");
const hospitalisation_service_1 = require("../hospitalisation/hospitalisation.service");
const vpa_entity_1 = require("./vpa.entity");
let VpaService = class VpaService {
    constructor(vpaRepository, cpaService, hospitalisationService) {
        this.vpaRepository = vpaRepository;
        this.cpaService = cpaService;
        this.hospitalisationService = hospitalisationService;
    }
    async create(input) {
        const hospitalisation = await this.hospitalisationService.findHospitalisationById(input.hospitalisationId);
        if (!hospitalisation) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
        if (hospitalisation.idPatient !== input.patientId) {
            throw new common_1.UnprocessableEntityException('Le patient de la VPA doit correspondre au patient de hospitalisation');
        }
        const cpa = await this.cpaService.findById(input.cpaId);
        if (!cpa) {
            throw new common_1.NotFoundException('CPA referencee introuvable');
        }
        if (cpa.hospitalisationId !== input.hospitalisationId) {
            throw new common_1.UnprocessableEntityException('La CPA referencee doit appartenir a la meme hospitalisation');
        }
        if (cpa.patientId !== input.patientId) {
            throw new common_1.UnprocessableEntityException('La CPA referencee doit appartenir au meme patient');
        }
        if (cpa.status !== cpa_entity_1.CpaStatus.REALISE) {
            throw new common_1.UnprocessableEntityException('VPA interdite tant que la CPA n\'est pas REALISEE');
        }
        const vpa = this.vpaRepository.create({
            patientId: input.patientId,
            hospitalisationId: input.hospitalisationId,
            cpaId: input.cpaId,
            instructionsRespectees: input.instructionsRespectees,
            ordonnanceAnesthesie: input.ordonnanceAnesthesie,
            heureDepartBloc: new Date(input.heureDepartBloc),
            status: vpa_entity_1.VpaStatus.EN_ATTENTE,
        });
        return this.vpaRepository.save(vpa);
    }
    async validate(id) {
        const vpa = await this.vpaRepository.findOne({ where: { id } });
        if (!vpa) {
            throw new common_1.NotFoundException('VPA introuvable');
        }
        vpa.status = vpa_entity_1.VpaStatus.VALIDEE;
        return this.vpaRepository.save(vpa);
    }
    async findById(id) {
        return this.vpaRepository.findOne({ where: { id } });
    }
    async findLatestByPatient(patientId) {
        return this.vpaRepository.findOne({
            where: { patientId },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.VpaService = VpaService;
exports.VpaService = VpaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vpa_entity_1.VpaEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cpa_service_1.CpaService,
        hospitalisation_service_1.HospitalisationService])
], VpaService);
//# sourceMappingURL=vpa.service.js.map