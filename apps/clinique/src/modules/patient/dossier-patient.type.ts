import { Field, ObjectType } from '@nestjs/graphql';
import { CpaEntity } from '../cpa/cpa.entity';
import { VpaEntity } from '../vpa/vpa.entity';
import { BlocOperatoireEntity } from '../bloc/bloc.entity';

@ObjectType()
export class DossierPatientUnique {
  @Field()
  patientId: string;

  @Field(() => CpaEntity, { nullable: true })
  cpa: CpaEntity | null;

  @Field(() => VpaEntity, { nullable: true })
  vpa: VpaEntity | null;

  @Field(() => BlocOperatoireEntity, { nullable: true })
  bloc: BlocOperatoireEntity | null;
}
