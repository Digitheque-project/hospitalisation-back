import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Max, Min } from 'class-validator';

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

  @Field()
  @ApiProperty({ type: String, description: 'Type de chirurgie', required: true })
  @IsString()
  typeChirurgie: string;

  @Field()
  @ApiProperty({ type: String, description: 'Nom du chirurgien', required: true })
  @IsString()
  chirurgien: string;

  @Field(() => Int)
  @ApiProperty({ type: Number, description: 'Duree prevue en minutes', required: true })
  @IsInt()
  @Min(1)
  dureePrevueMinutes: number;

  @Field()
  @ApiProperty({ type: Boolean, description: 'Risque hemorragique', required: true })
  @IsBoolean()
  risqueHemorragique: boolean;

  @Field()
  @ApiProperty({ type: Boolean, description: 'Intervention en urgence', required: true })
  @IsBoolean()
  urgence: boolean;

  @Field()
  @ApiProperty({ type: String, description: 'Decision anesthesique', required: true })
  @IsString()
  decisionAnesthesique: string;

  @Field()
  @ApiProperty({
    type: String,
    description: 'Protocole et instructions pre-anesthesiques',
    required: true,
  })
  @IsString()
  protocoleInstructions: string;
}
