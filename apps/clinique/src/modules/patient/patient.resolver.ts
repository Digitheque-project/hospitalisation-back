import { Args, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { DossierPatientUnique } from './dossier-patient.type';
import { PatientService } from './patient.service';

@Resolver(() => DossierPatientUnique)
@UseGuards(RolesGuard)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => DossierPatientUnique)
  @Roles('ONM', 'ONIM')
  dossierPatient(@Args('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string) {
    return this.patientService.getDossier(patientId);
  }
}
