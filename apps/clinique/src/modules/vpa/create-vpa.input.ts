import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsString } from 'class-validator';

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

  @Field()
  @ApiProperty({ type: Boolean, description: 'Instructions CPA respectees', required: true })
  @IsBoolean()
  instructionsRespectees: boolean;

  @Field()
  @ApiProperty({ type: String, description: "Ordonnance d'anesthesie", required: true })
  @IsString()
  ordonnanceAnesthesie: string;

  @Field()
  @ApiProperty({ type: String, description: 'Heure depart bloc (ISO)', required: true })
  @IsDateString()
  heureDepartBloc: string;
}
