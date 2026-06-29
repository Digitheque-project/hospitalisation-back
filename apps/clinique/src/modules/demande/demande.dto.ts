import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { StatutDemande } from '../../domain/entities/demande.entity';

@InputType()
export class CreateDemandeDto {
  @Field()
  @ApiProperty({ example: 'Demande d\'hospitalisation pour chirurgie', description: 'Motif de la demande' })
  @IsString()
  motif: string;

  @Field()
  @ApiProperty({ example: 'patient-123', description: 'Identifiant patient' })
  @IsString()
  @Length(1, 120)
  patientId: string;

  @Field()
  @ApiProperty({ example: 'service-123', description: 'Identifiant service' })
  @IsString()
  @Length(1, 120)
  serviceId: string;

  @Field()
  @ApiProperty({ example: 'chu-01', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'Patient allergique aux pénicillines',
    description: 'Informations complémentaires',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  infoComplementaire?: string | null;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'Capacité insuffisante',
    description: 'Motif de refus',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  motifRefus?: string | null;

  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de la demande' })
  @IsString()
  @Length(1, 120)
  createdBy: string;
}

@InputType()
export class UpdateDemandeDto {
  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Demande d\'hospitalisation pour chirurgie cardiaque', required: false })
  @IsOptional()
  @IsString()
  motif?: string;

  @Field(() => StatutDemande, { nullable: true })
  @ApiProperty({ enum: StatutDemande, required: false })
  @IsOptional()
  @IsEnum(StatutDemande)
  statut?: StatutDemande;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Patient allergique aux pénicillines', required: false })
  @IsOptional()
  @IsString()
  infoComplementaire?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Capacité insuffisante', required: false })
  @IsOptional()
  @IsString()
  motifRefus?: string;

  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de la mise à jour' })
  @IsString()
  @Length(1, 120)
  updatedBy: string;
}

export class DemandeQuery {
  @ApiProperty({ example: 'chu-01', required: false })
  @IsOptional()
  @IsString()
  chuId?: string;

  @ApiProperty({ example: 'service-123', required: false })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiProperty({ example: 'patient-123', required: false })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ enum: StatutDemande, required: false })
  @IsOptional()
  @IsEnum(StatutDemande)
  statut?: StatutDemande;
}
