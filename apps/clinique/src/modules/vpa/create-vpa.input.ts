import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateVpaInput {
  @Field()
  @IsString()
  patientId: string;

  @Field()
  @IsString()
  cpaId: string;
}
