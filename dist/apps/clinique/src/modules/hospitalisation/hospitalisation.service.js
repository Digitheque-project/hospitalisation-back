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
    constructor(hospitalisationRepository, modeSortieRepository, demandeAvisRepository, avisMedicalRepository, diagnosticsRepository, prescriptionRepository, demandeTransfertRepository, litRepository, chambreRepository, affectationLitRepository, transfertRepository, signatureService) {
        this.hospitalisationRepository = hospitalisationRepository;
        this.modeSortieRepository = modeSortieRepository;
        this.demandeAvisRepository = demandeAvisRepository;
        this.avisMedicalRepository = avisMedicalRepository;
        this.diagnosticsRepository = diagnosticsRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.demandeTransfertRepository = demandeTransfertRepository;
        this.litRepository = litRepository;
        this.chambreRepository = chambreRepository;
        this.affectationLitRepository = affectationLitRepository;
        this.transfertRepository = transfertRepository;
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
        const litDisponible = await this.findAvailableLitForService(input.idService, input.idLit);
        const entity = this.hospitalisationRepository.create({
            idPatient: input.idPatient,
            idService: input.idService,
            idDemandeHospitalisation: input.idDemandeHospitalisation,
            motifHospitalisation: input.motifHospitalisation,
            commentaire: input.commentaire ?? null,
            dateEntrer: new Date(input.dateEntrer),
            modeSortie,
            idModeSortie: input.idModeSortie ?? null,
            statutHospitalisation: hospitalisation_entities_1.StatutHospitalisation.EN_COURS,
        });
        const saved = await this.hospitalisationRepository.save(entity);
        await this.affecterLit(saved.id, litDisponible.id);
        return saved;
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
    async createPrescriptionMedicale(input, user) {
        await this.assertHospitalisationExists(input.idHospitalisation);
        this.signatureService.assertProfessionalOrderNumber(user);
        const prescription = this.prescriptionRepository.create({
            ...input,
            datePrescription: new Date(),
        });
        return this.prescriptionRepository.save(prescription);
    }
    async createDemandeTransfert(input) {
        const hospitalisation = await this.hospitalisationRepository.findOne({
            where: { id: input.idHospitalisation },
        });
        if (!hospitalisation) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
        if (hospitalisation.idService !== input.serviceSource) {
            throw new common_1.UnprocessableEntityException('Le service source doit correspondre au service courant de hospitalisation');
        }
        const demande = this.demandeTransfertRepository.create({
            ...input,
            dateDemande: new Date(),
            statut: hospitalisation_entities_1.StatutDemandeTransfert.A_VOIR,
        });
        return this.demandeTransfertRepository.save(demande);
    }
    async traiterDemandeTransfert(idDemandeTransfert, input) {
        const demande = await this.demandeTransfertRepository.findOne({ where: { id: idDemandeTransfert } });
        if (!demande) {
            throw new common_1.NotFoundException('Demande de transfert introuvable');
        }
        if (input.statut === hospitalisation_entities_1.StatutDemandeTransfert.REFUSE &&
            (!input.justification || input.justification.trim().length === 0)) {
            throw new common_1.UnprocessableEntityException('Justification obligatoire si transfert REFUSE');
        }
        demande.statut = input.statut;
        demande.justification = input.justification ?? null;
        const savedDemande = await this.demandeTransfertRepository.save(demande);
        if (input.statut === hospitalisation_entities_1.StatutDemandeTransfert.ACCEPTE) {
            const litDestination = await this.findAvailableLitForService(savedDemande.serviceDestination, input.idLitDestination);
            await this.effectuerTransfert(savedDemande, litDestination.id);
        }
        return savedDemande;
    }
    async cloturerHospitalisation(idHospitalisation, input) {
        const hospitalisation = await this.hospitalisationRepository.findOne({
            where: { id: idHospitalisation },
        });
        if (!hospitalisation) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
        const modeSortie = await this.modeSortieRepository.findOne({ where: { id: input.idModeSortie } });
        if (!modeSortie) {
            throw new common_1.NotFoundException('Mode de sortie introuvable');
        }
        hospitalisation.idModeSortie = input.idModeSortie;
        hospitalisation.modeSortie = modeSortie;
        hospitalisation.commentaire = input.commentaire ?? null;
        hospitalisation.dateSortie = new Date();
        hospitalisation.statutHospitalisation = hospitalisation_entities_1.StatutHospitalisation.CLOTUREE;
        const closed = await this.hospitalisationRepository.save(hospitalisation);
        const activeAffectation = await this.affectationLitRepository.findOne({
            where: { idHospitalisation, dateFinAffectation: (0, typeorm_2.IsNull)() },
            order: { dateDebutAffectation: 'DESC' },
        });
        if (activeAffectation) {
            activeAffectation.dateFinAffectation = new Date();
            await this.affectationLitRepository.save(activeAffectation);
            const lit = await this.litRepository.findOne({ where: { id: activeAffectation.idLit } });
            if (lit) {
                lit.statut = hospitalisation_entities_1.StatutLit.DISPONIBLE;
                await this.litRepository.save(lit);
            }
        }
        return closed;
    }
    async findHospitalisationById(id) {
        return this.hospitalisationRepository.findOne({ where: { id } });
    }
    async findDemandeAvisById(id) {
        return this.demandeAvisRepository.findOne({ where: { id } });
    }
    async findDemandeTransfertById(id) {
        return this.demandeTransfertRepository.findOne({ where: { id } });
    }
    async findAvailableLitsByService(serviceId) {
        return this.litRepository
            .createQueryBuilder('lit')
            .innerJoin(hospitalisation_entities_1.ChambreEntity, 'chambre', 'chambre.id_chambre = lit.id_chambre')
            .where('chambre.id_service = :serviceId', { serviceId })
            .andWhere('lit.statut = :statut', { statut: hospitalisation_entities_1.StatutLit.DISPONIBLE })
            .orderBy('lit.code_lit', 'ASC')
            .getMany();
    }
    async createChambre(input) {
        const exists = await this.chambreRepository.findOne({
            where: { idService: input.idService, numeroChambre: input.numeroChambre },
        });
        if (exists) {
            throw new common_1.UnprocessableEntityException('Une chambre avec ce numero existe deja pour ce service');
        }
        const chambre = this.chambreRepository.create(input);
        return this.chambreRepository.save(chambre);
    }
    async createLit(input) {
        const chambre = await this.chambreRepository.findOne({ where: { id: input.idChambre } });
        if (!chambre) {
            throw new common_1.NotFoundException('Chambre introuvable');
        }
        const existing = await this.litRepository.findOne({ where: { codeLit: input.codeLit } });
        if (existing) {
            throw new common_1.UnprocessableEntityException('Code lit deja utilise');
        }
        const lit = this.litRepository.create({ ...input, statut: hospitalisation_entities_1.StatutLit.DISPONIBLE });
        return this.litRepository.save(lit);
    }
    async findLitById(id) {
        return this.litRepository.findOne({ where: { id } });
    }
    async findLitsByChambre(idChambre) {
        return this.litRepository.find({ where: { idChambre }, order: { codeLit: 'ASC' } });
    }
    async updateLitStatut(idLit, input) {
        const lit = await this.litRepository.findOne({ where: { id: idLit } });
        if (!lit) {
            throw new common_1.NotFoundException('Lit introuvable');
        }
        const activeAffectation = await this.affectationLitRepository.findOne({
            where: { idLit, dateFinAffectation: (0, typeorm_2.IsNull)() },
            order: { dateDebutAffectation: 'DESC' },
        });
        if (input.statut === hospitalisation_entities_1.StatutLit.OCCUPE) {
            throw new common_1.UnprocessableEntityException("Statut OCCUPE reserve au flux d'affectation de lit d'hospitalisation");
        }
        if (activeAffectation) {
            throw new common_1.UnprocessableEntityException('Statut lit non modifiable tant qu une affectation active existe');
        }
        lit.statut = input.statut;
        return this.litRepository.save(lit);
    }
    async assertHospitalisationExists(id) {
        const entity = await this.findHospitalisationById(id);
        if (!entity) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
    }
    async createAffectationLit(input) {
        const hospitalisation = await this.hospitalisationRepository.findOne({
            where: { id: input.idHospitalisation },
        });
        if (!hospitalisation) {
            throw new common_1.NotFoundException('Hospitalisation introuvable');
        }
        const lit = await this.litRepository.findOne({ where: { id: input.idLit } });
        if (!lit) {
            throw new common_1.NotFoundException('Lit introuvable');
        }
        const chambre = await this.chambreRepository.findOne({ where: { id: lit.idChambre } });
        if (!chambre || chambre.idService !== hospitalisation.idService) {
            throw new common_1.UnprocessableEntityException('Le lit doit appartenir au service courant de hospitalisation');
        }
        const activeAffectation = await this.affectationLitRepository.findOne({
            where: { idHospitalisation: input.idHospitalisation, dateFinAffectation: (0, typeorm_2.IsNull)() },
            order: { dateDebutAffectation: 'DESC' },
        });
        if (activeAffectation) {
            activeAffectation.dateFinAffectation = new Date();
            await this.affectationLitRepository.save(activeAffectation);
            const oldLit = await this.litRepository.findOne({ where: { id: activeAffectation.idLit } });
            if (oldLit) {
                oldLit.statut = hospitalisation_entities_1.StatutLit.DISPONIBLE;
                await this.litRepository.save(oldLit);
            }
        }
        await this.affecterLit(input.idHospitalisation, input.idLit);
        const nouvelleAffectation = await this.affectationLitRepository.findOne({
            where: { idHospitalisation: input.idHospitalisation, dateFinAffectation: (0, typeorm_2.IsNull)() },
            order: { dateDebutAffectation: 'DESC' },
        });
        if (!nouvelleAffectation) {
            throw new common_1.UnprocessableEntityException('Affectation non creee');
        }
        return nouvelleAffectation;
    }
    async findAvailableLitForService(serviceId, preferredLitId) {
        if (preferredLitId) {
            const lit = await this.litRepository.findOne({ where: { id: preferredLitId } });
            if (!lit) {
                throw new common_1.NotFoundException('Lit cible introuvable');
            }
            const chambre = await this.chambreRepository.findOne({ where: { id: lit.idChambre } });
            if (!chambre || chambre.idService !== serviceId) {
                throw new common_1.UnprocessableEntityException('Le lit cible ne correspond pas au service cible');
            }
            if (lit.statut !== hospitalisation_entities_1.StatutLit.DISPONIBLE) {
                throw new common_1.UnprocessableEntityException('Le lit cible nest pas disponible');
            }
            return lit;
        }
        const lit = await this.litRepository
            .createQueryBuilder('lit')
            .innerJoin(hospitalisation_entities_1.ChambreEntity, 'chambre', 'chambre.id_chambre = lit.id_chambre')
            .where('chambre.id_service = :serviceId', { serviceId })
            .andWhere('lit.statut = :statut', { statut: hospitalisation_entities_1.StatutLit.DISPONIBLE })
            .orderBy('lit.code_lit', 'ASC')
            .getOne();
        if (!lit) {
            throw new common_1.UnprocessableEntityException('Aucun lit disponible dans le service cible');
        }
        return lit;
    }
    async affecterLit(idHospitalisation, idLit) {
        const lit = await this.litRepository.findOne({ where: { id: idLit } });
        if (!lit || lit.statut !== hospitalisation_entities_1.StatutLit.DISPONIBLE) {
            throw new common_1.UnprocessableEntityException("Affectation impossible: lit indisponible");
        }
        lit.statut = hospitalisation_entities_1.StatutLit.OCCUPE;
        await this.litRepository.save(lit);
        const affectation = this.affectationLitRepository.create({
            idHospitalisation,
            idLit,
            dateDebutAffectation: new Date(),
            dateFinAffectation: null,
        });
        await this.affectationLitRepository.save(affectation);
    }
    async effectuerTransfert(demande, idLitDestination) {
        const hospitalisation = await this.hospitalisationRepository.findOne({
            where: { id: demande.idHospitalisation },
        });
        if (!hospitalisation) {
            throw new common_1.NotFoundException('Hospitalisation introuvable pour transfert');
        }
        const activeAffectation = await this.affectationLitRepository.findOne({
            where: { idHospitalisation: demande.idHospitalisation, dateFinAffectation: (0, typeorm_2.IsNull)() },
            order: { dateDebutAffectation: 'DESC' },
        });
        if (activeAffectation) {
            activeAffectation.dateFinAffectation = new Date();
            await this.affectationLitRepository.save(activeAffectation);
            const oldLit = await this.litRepository.findOne({ where: { id: activeAffectation.idLit } });
            if (oldLit) {
                oldLit.statut = hospitalisation_entities_1.StatutLit.DISPONIBLE;
                await this.litRepository.save(oldLit);
            }
        }
        await this.affecterLit(demande.idHospitalisation, idLitDestination);
        hospitalisation.idService = demande.serviceDestination;
        await this.hospitalisationRepository.save(hospitalisation);
        const transfert = this.transfertRepository.create({
            idDemande: demande.id,
            dateTransfert: new Date(),
        });
        await this.transfertRepository.save(transfert);
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
    __param(5, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.PrescriptionMedicaleEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.DemandeTransfertEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.LitEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.ChambreEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.AffectationLitEntity)),
    __param(10, (0, typeorm_1.InjectRepository)(hospitalisation_entities_1.TransfertEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        signature_service_1.SignatureService])
], HospitalisationService);
//# sourceMappingURL=hospitalisation.service.js.map