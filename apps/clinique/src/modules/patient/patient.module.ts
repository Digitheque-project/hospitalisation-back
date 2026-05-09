import { Module } from '@nestjs/common';
import { BlocModule } from '../bloc/bloc.module';
import { CpaModule } from '../cpa/cpa.module';
import { VpaModule } from '../vpa/vpa.module';
import { PatientResolver } from './patient.resolver';
import { PatientService } from './patient.service';

@Module({
  imports: [CpaModule, VpaModule, BlocModule],
  providers: [PatientService, PatientResolver],
})
export class PatientModule {}
