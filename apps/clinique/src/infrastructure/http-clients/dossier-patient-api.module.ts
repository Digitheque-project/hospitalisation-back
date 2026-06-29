import { Module } from '@nestjs/common';
import { DossierPatientApiService } from './dossier-patient-api.service';
​
@Module({
  providers: [DossierPatientApiService],
  exports: [DossierPatientApiService],
})
export class DossierPatientApiModule {}
​