import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateCpaInput {
  @Field()
  @IsString()
  patientId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(6)
  asaScore: number;
}
