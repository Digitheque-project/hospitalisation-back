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
var HospitalisationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalisationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const signature_service_1 = require("../signature/signature.service");
const hospitalisation_entities_1 = require("./hospitalisation.entities");
let HospitalisationService = HospitalisationService_1 = class HospitalisationService {
    constructor(hospitalisationRepository, modeSortieRepository, demandeAvisRepository, avisMedicalRepository, diagnosticsRepository, signatureService) {
        this.hospitalisationRepository = hospitalisationRepository;
        this.modeSortieRepository = modeSortieRepository;
        this.demandeAvisRepository = demandeAvisRepository;
        this.avisMedicalRepository = avisMedicalRepository;
        this.diagnosticsRepository = diagnosticsRepository;
        this.signatureService = signatureService;
        this.logger = new common_1.Logger(HospitalisationService_1.name);
        this.demandeAvisIntervals = new Map();
    }
    async createHospitalisation(input) {
        let modeSortie = null;
        if (input.idModeSortie) {
            modeSortie = await this.modeSortieRepository.findOne({ where: { id: input.idModeSortie } });
            if (!modeSortie) {
                throw new common_1.NotFoundException('Mode de sortie introuvable');
            }
        }
        const entity = this.hospitalisationRepository.create({
            ...input,
            dateEntrer: new Date(input.dateEntrer),
            modeSortie,
            idModeSortie: input.idModeSortie ?? null,
            statutHospitalisation: hospitalisation_entities_1.StatutHospitalisation.EN_COURS,
        });
        return this.hospitalisationRepository.save(entity);
    }
    async createDemandeAvis(input) {
        await this.assertHospitalisationExists(input.idHospitalisation);
        const demande = this.demandeAvisRepository.create({
            ...input,
            dateDemande: new Date(),
            statut: hospitalisation_entities_1.StatutDemande.EN_ATTENTE,
        });
        const saved = await this.demandeAvisRepository.save(demande);
        this.startAvisNotification(saved.id);
        return saved;
    }
    async consulterDemandeAvis(id) {
        const demande = await this.demandeAvisRepository.findOne({ where: { id } });
        if (!demande) {
            throw new common_1.NotFoundException("Demande d'avis introuvable");
        }
        demande.statut = hospitalisation_entities_1.StatutDemande.CONSULTEE;
        this.stopAvisNotification(id);
        return this.demandeAvisRepository.save(demande);
    }
    async createDiagnostics(input, user) {
        await this.assertHospitalisationExists(input.idHospitalisation);
        this.signatureService.assertProfessionalOrderNumber(user);
        const diagnostics = this.diagnosticsRepository.create({
            ...input,
            dateDiagnostics: new Date(),
        });
        return this.diagnosticsRepository.save(diagnostics);
    }
    async createAvisMedical(input, user) {
        this.signatureService.assertProfessionalOrderNumber(user);
        const demande = await this.demandeAvisRepository.findOne({ where: { id: input.idDemande } });
        if (!demande) {
            throw new common_1.NotFoundException("Demande d'avis referencee introuvable");
        }
        if (demande.statut !== hospitalisation_entities_1.StatutDemande.CONSULTEE) {
            throw new common_1.UnprocessableEntityException("Avis medical interdit tant que la demande d'avis n'est pas consultee");
        }
        const avis = this.avisMedicalRepository.create({
            ...input,
            dateAvis: new Date(),
        });
        return this.avisMedicalRepository.save(avis);
    }
    async findHospitalisationById(id) {
        return this.hospitalisationRepository.findOne({ where: { id } });
    }
    async assertHospitalisationExists(id) {
        const entity = await this.findHospitalisationById(id);
        if (!entity) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
    }
    startAvisNotification(demandeId) {
        if (this.demandeAvisIntervals.has(demandeId)) {
            return;
        }
        const interval = setInterval(async () => {
            const demande = await this.demandeAvisRepository.findOne({ where: { id: demandeId } });
            if (!demande || demande.statut === hospitalisation_entities_1.StatutDemande.CONSULTEE) {
                this.stopAvisNotification(demandeId);
                return;
            }
            this.logger.warn(`Notification DemandeAvis ${demandeId}: en attente de consultation`);
        }, 5 * 60 * 1000);
        this.demandeAvisIntervals.set(demandeId, interval);
    }
    stopAvisNotification(demandeId) {
        const interval = this.demandeAvisIntervals.get(demandeId);
        if (interval) {
            clearInterval(interval);
            this.demandeAvisIntervals.delete(demandeId);
        }
    }
    onModuleDestroy() {
        for (const demandeId of this.demandeAvisIntervals.keys()) {
            this.stopAvisNotification(demandeId);
        }
    }
};
exports.HospitalisationService = HospitalisationService;
exports.HospitalisationService = HospitalisationService = HospitalisationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.HospitalisationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.ModeSortieEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.DemandeAvisEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.AvisMedicalEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.DiagnosticsEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        signature_service_1.SignatureService])
], HospitalisationService);
//# sourceMappingURL=hospitalisation.service.js.map