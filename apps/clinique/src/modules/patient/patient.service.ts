import { Injectable } from '@nestjs/common';
import { BlocService } from '../bloc/bloc.service';
import { CpaService } from '../cpa/cpa.service';
import { VpaService } from '../vpa/vpa.service';
import { DossierPatientUnique } from './dossier-patient.type';

@Injectable()
export class PatientService {
  constructor(
    private readonly cpaService: CpaService,
    private readonly vpaService: VpaService,
    private readonly blocService: BlocService,
  ) {}

  async getDossier(patientId: string): Promise<DossierPatientUnique> {
    const [cpa, vpa, bloc] = await Promise.all([
      this.cpaService.findLatestByPatient(patientId),
      this.vpaService.findLatestByPatient(patientId),
      this.blocService.findLatestByPatient(patientId),
    ]);

    return { patientId, cpa, vpa, bloc };
  }
}
