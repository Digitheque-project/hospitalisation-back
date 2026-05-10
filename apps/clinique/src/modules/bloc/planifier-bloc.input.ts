import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class PlanifierBlocInput {
  @Field()
  @ApiProperty({ type: String, description: 'Identifiant patient', required: true })
  @IsString()
  patientId: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant hospitalisation', required: true })
  @IsString()
  hospitalisationId: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant VPA', required: true })
  @IsString()
  vpaId: string;

  @Field()
  @ApiProperty({ type: Boolean, description: 'Checklist OMS validee', required: true })
  @IsBoolean()
  checklistOmsValidee: boolean;
}
