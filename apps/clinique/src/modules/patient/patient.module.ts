import { Module } from '@nestjs/common';
import { CpaModule } from '../cpa/cpa.module';
import { VpaModule } from '../vpa/vpa.module';
import { PatientResolver } from './patient.resolver';
import { PatientService } from './patient.service';

@Module({
  imports: [CpaModule, VpaModule],
  providers: [PatientService, PatientResolver],
})
export class PatientModule {}
