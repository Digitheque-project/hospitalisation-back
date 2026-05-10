import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateCpaInput {
  @Field()
  @ApiProperty({ type: String, description: 'Identifiant patient', required: true })
  @IsString()
  patientId: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant hospitalisation', required: true })
  @IsString()
  hospitalisationId: string;

  @Field(() => Int)
  @ApiProperty({ type: Number, description: 'Score ASA', required: true })
  @IsInt()
  @Min(1)
  @Max(6)
  asaScore: number;
}
