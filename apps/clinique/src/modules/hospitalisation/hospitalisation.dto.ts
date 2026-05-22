import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { StatutHospitalisation } from '../../domain/entities/hospitalisation-episode.entity';

@InputType()
export class CreateHospitalisationEpisodeDto {
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
  @ApiProperty({ example: '2026-05-22T10:00:00.000Z', description: "Date d'admission ISO" })
  @IsDateString()
  dateAdmission: string;

  @Field()
  @ApiProperty({ example: 'Observation clinique', description: "Motif de l'admission" })
  @IsString()
  motifAdmission: string;

  @Field()
  @ApiProperty({ example: 'agent-45', description: "Auteur de l'admission" })
  @IsString()
  createdBy: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'lit-uuid', description: 'Identifiant lit', required: false })
  @IsOptional()
  @IsString()
  litId?: string;
}

@InputType()
export class UpdateHospitalisationStatusDto {
  @Field(() => StatutHospitalisation)
  @ApiProperty({ enum: StatutHospitalisation, description: 'Nouveau statut' })
  @IsEnum(StatutHospitalisation)
  statut: StatutHospitalisation;

  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de la mise a jour' })
  @IsString()
  updatedBy: string;
}

@InputType()
export class CloseHospitalisationEpisodeDto {
  @Field({ nullable: true })
  @ApiProperty({ example: '2026-05-23T09:00:00.000Z', description: 'Date de sortie ISO', required: false })
  @IsOptional()
  @IsDateString()
  dateSortie?: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Sortie reguliere', description: 'Commentaire de sortie', required: false })
  @IsOptional()
  @IsString()
  commentaireSortie?: string;

  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de la cloture' })
  @IsString()
  updatedBy: string;

  @Field(() => StatutHospitalisation, { nullable: true })
  @ApiProperty({
    enum: StatutHospitalisation,
    description: 'Statut final (optionnel, defaut SORTIE)',
    required: false,
  })
  @IsOptional()
  @IsEnum(StatutHospitalisation)
  statutFinal?: StatutHospitalisation;
}

export class HospitalisationEpisodeQuery {
  @ApiProperty({ example: 'service-123', description: 'Filtre obligatoire par service' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: 'patient-123', required: false })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ enum: StatutHospitalisation, required: false })
  @IsOptional()
  @IsEnum(StatutHospitalisation)
  statut?: StatutHospitalisation;
}
