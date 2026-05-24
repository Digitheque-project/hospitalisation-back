import { Module } from '@nestjs/common';
import { AccueilPatientApiService } from './accueil-patient-api.service';

@Module({
  providers: [AccueilPatientApiService],
  exports: [AccueilPatientApiService],
})
export class AccueilApiModule {}
