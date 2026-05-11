import { Field, ObjectType } from '@nestjs/graphql';
import { CpaEntity } from '../cpa/cpa.entity';
import { VpaEntity } from '../vpa/vpa.entity';
import { PatientInformationsAccueil } from './patient-informations-accueil.type';

@ObjectType()
export class DossierPatientUnique {
  @Field()
  patientId: string;

  @Field(() => PatientInformationsAccueil, { nullable: true })
  informationsPatient: PatientInformationsAccueil | null;

  @Field(() => CpaEntity, { nullable: true })
  cpa: CpaEntity | null;

  @Field(() => VpaEntity, { nullable: true })
  vpa: VpaEntity | null;
}
