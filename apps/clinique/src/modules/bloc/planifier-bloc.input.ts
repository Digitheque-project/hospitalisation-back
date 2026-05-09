import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class PlanifierBlocInput {
  @Field()
  @IsString()
  patientId: string;

  @Field()
  @IsString()
  vpaId: string;

  @Field()
  @IsBoolean()
  checklistOmsValidee: boolean;
}
