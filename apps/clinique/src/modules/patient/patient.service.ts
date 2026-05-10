import { Injectable } from '@nestjs/common';
import { CpaService } from '../cpa/cpa.service';
import { VpaService } from '../vpa/vpa.service';
import { DossierPatientUnique } from './dossier-patient.type';

@Injectable()
export class PatientService {
  constructor(
    private readonly cpaService: CpaService,
    private readonly vpaService: VpaService,
  ) {}

  async getDossier(patientId: string): Promise<DossierPatientUnique> {
    const [cpa, vpa] = await Promise.all([
      this.cpaService.findLatestByPatient(patientId),
      this.vpaService.findLatestByPatient(patientId),
    ]);

    return { patientId, cpa, vpa };
  }
}
