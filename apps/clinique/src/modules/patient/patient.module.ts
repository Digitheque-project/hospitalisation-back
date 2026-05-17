import { Module } from '@nestjs/common';
import { AccueilApiModule } from '../accueil/accueil-api.module';
import { CpaModule } from '../cpa/cpa.module';
import { VpaModule } from '../vpa/vpa.module';
import { PatientResolver } from './patient.resolver';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  imports: [AccueilApiModule, CpaModule, VpaModule],
  controllers: [PatientController],
  providers: [PatientService, PatientResolver],
})
export class PatientModule {}
