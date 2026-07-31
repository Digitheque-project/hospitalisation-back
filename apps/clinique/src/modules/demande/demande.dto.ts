import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { StatutDemande } from '../../domain/entities/demande.entity';
​
@InputType()
export class CreateDemandeDto {
  @Field()
  @ApiProperty({ example: 'Demande d\'hospitalisation pour chirurgie', description: 'Motif de la demande' })
  @IsString()
  motif: string;
​
  @Field()
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Identifiant patient (chaine, longueur max = celle d\'un UUID)' })
  @IsString()
  @Length(1, 36)
  patientId: string;
​
  @Field()
  @ApiProperty({ example: '75f995a2-40e9-4285-84e4-a72501d37bfd', description: 'Identifiant du service source (celui qui fait la demande)' })
  @IsString()
  @Length(1, 120)
  serviceIdSource: string;
​
  @Field()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'Identifiant du service destination' })
  @IsString()
  @Length(1, 120)
  serviceIdDest: string;
​
  @Field()
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;
​
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
​
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
​
  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'episode-1e5bbbb7-2026-07-31T08-00-00-000Z',
    description: "Episode source d'un transfert interne (renseigne par le back, pas par le front)",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  episodeSourceId?: string | null;

  @Field()
  @ApiProperty({ example: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909', description: 'Auteur de la demande' })
  @IsString()
  @Length(1, 120)
  createdBy: string;
}
​
@InputType()
export class UpdateDemandeDto {
  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Demande d\'hospitalisation pour chirurgie cardiaque', required: false })
  @IsOptional()
  @IsString()
  motif?: string;
​
  @Field(() => StatutDemande, { nullable: true })
  @ApiProperty({ enum: StatutDemande, required: false })
  @IsOptional()
  @IsEnum(StatutDemande)
  statut?: StatutDemande;
​
  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Patient allergique aux pénicillines', required: false })
  @IsOptional()
  @IsString()
  infoComplementaire?: string;
​
  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Capacité insuffisante', required: false })
  @IsOptional()
  @IsString()
  motifRefus?: string;
​
  @Field()
  @ApiProperty({ example: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909', description: 'Auteur de la mise à jour' })
  @IsString()
  @Length(1, 120)
  updatedBy: string;
}
​
export class MarquerConsulteesDto {
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Service destination dont on marque les demandes EN_ATTENTE comme CONSULTEE',
  })
  @IsString()
  @Length(1, 120)
  serviceIdDest: string;
}

export class DemandeQuery {
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', required: false })
  @IsOptional()
  @IsString()
  chuId?: string;
​
  @ApiProperty({ example: '75f995a2-40e9-4285-84e4-a72501d37bfd', required: false })
  @IsOptional()
  @IsString()
  serviceIdSource?: string;
​
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: false })
  @IsOptional()
  @IsString()
  serviceIdDest?: string;
​
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', required: false })
  @IsOptional()
  @IsString()
  patientId?: string;
​
  @ApiProperty({ enum: StatutDemande, required: false })
  @IsOptional()
  @IsEnum(StatutDemande)
  statut?: StatutDemande;
}
​