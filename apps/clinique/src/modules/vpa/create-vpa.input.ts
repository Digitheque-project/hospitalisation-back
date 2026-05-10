import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class CreateVpaInput {
  @Field()
  @ApiProperty({ type: String, description: 'Identifiant patient', required: true })
  @IsString()
  patientId: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant hospitalisation', required: true })
  @IsString()
  hospitalisationId: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant CPA', required: true })
  @IsString()
  cpaId: string;
}
