import { Injectable } from '@nestjs/common';
import { CpaService } from '../cpa/cpa.service';
import { VpaService } from '../vpa/vpa.service';
import { AccueilPatientApiService } from '../accueil/accueil-patient-api.service';
import { DossierPatientUnique } from './dossier-patient.type';

@Injectable()
export class PatientService {
  constructor(
    private readonly cpaService: CpaService,
    private readonly vpaService: VpaService,
    private readonly accueilPatientApi: AccueilPatientApiService,
  ) {}

  async getDossier(patientId: string): Promise<DossierPatientUnique> {
    const [informationsPatient, cpa, vpa] = await Promise.all([
      this.accueilPatientApi.getPatientById(patientId),
      this.cpaService.findLatestByPatient(patientId),
      this.vpaService.findLatestByPatient(patientId),
    ]);

    return { patientId, informationsPatient, cpa, vpa };
  }
}
