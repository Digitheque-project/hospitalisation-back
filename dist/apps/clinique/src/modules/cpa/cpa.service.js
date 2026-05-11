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
var CpaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hospitalisation_service_1 = require("../hospitalisation/hospitalisation.service");
const cpa_entity_1 = require("./cpa.entity");
let CpaService = CpaService_1 = class CpaService {
    constructor(cpaRepository, hospitalisationService) {
        this.cpaRepository = cpaRepository;
        this.hospitalisationService = hospitalisationService;
    }
    async create(input) {
        const hospitalisation = await this.hospitalisationService.findHospitalisationById(input.hospitalisationId);
        if (!hospitalisation) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
        if (hospitalisation.patientId !== input.patientId) {
            throw new common_1.UnprocessableEntityException('Le patient de la CPA doit correspondre au patient de hospitalisation');
        }
        const cpa = this.cpaRepository.create({
            patientId: input.patientId,
            hospitalisationId: input.hospitalisationId,
            asaScore: input.asaScore,
            typeChirurgie: input.typeChirurgie,
            chirurgien: input.chirurgien,
            dureePrevueMinutes: input.dureePrevueMinutes,
            risqueHemorragique: input.risqueHemorragique,
            urgence: input.urgence,
            decisionAnesthesique: input.decisionAnesthesique,
            protocoleInstructions: input.protocoleInstructions,
            status: cpa_entity_1.CpaStatus.PLANIFIE,
        });
        return this.cpaRepository.save(cpa);
    }
    async markAsRealise(id) {
        const cpa = await this.cpaRepository.findOne({ where: { id } });
        if (!cpa) {
            throw new common_1.NotFoundException('CPA introuvable');
        }
        cpa.status = cpa_entity_1.CpaStatus.REALISE;
        return this.cpaRepository.save(cpa);
    }
    async findLatestByPatient(patientId) {
        return this.cpaRepository.findOne({
            where: { patientId },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        return this.cpaRepository.findOne({ where: { id } });
    }
    async getStats() {
        const total = await this.cpaRepository.count();
        const urgent = await this.cpaRepository.count({ where: { urgence: true } });
        return { total, urgent };
    }
    async getRecent(limit) {
        const normalizedLimit = this.normalizeLimit(limit);
        return this.cpaRepository.find({
            order: { createdAt: 'DESC' },
            take: normalizedLimit,
        });
    }
    normalizeLimit(limit) {
        if (!Number.isFinite(limit) || limit <= 0) {
            return CpaService_1.DEFAULT_LIMIT;
        }
        return Math.min(limit, CpaService_1.MAX_LIMIT);
    }
};
exports.CpaService = CpaService;
CpaService.DEFAULT_LIMIT = 6;
CpaService.MAX_LIMIT = 50;
exports.CpaService = CpaService = CpaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cpa_entity_1.CpaEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        hospitalisation_service_1.HospitalisationService])
], CpaService);
//# sourceMappingURL=cpa.service.js.map