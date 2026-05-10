import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateHospitalisationDto {
  @Field()
  @ApiProperty({ type: String, description: 'Identifiant patient', required: true })
  @IsString()
  idPatient: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant service', required: true })
  @IsString()
  idService: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant demande hospitalisation', required: true })
  @IsString()
  idDemandeHospitalisation: string;

  @Field()
  @ApiProperty({ type: String, description: "Date d'entree ISO", required: true })
  @IsDateString()
  dateEntrer: string;

  @Field()
  @ApiProperty({ type: String, description: 'Motif hospitalisation', required: true })
  @IsString()
  motifHospitalisation: string;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Identifiant mode sortie', required: false })
  @IsOptional()
  @IsString()
  idModeSortie?: string;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Commentaire medical', required: false })
  @IsOptional()
  @IsString()
  commentaire?: string;
}

@InputType()
export class CreateDemandeAvisDto {
  @Field()
  @ApiProperty({ type: String, description: 'Hospitalisation reference', required: true })
  @IsString()
  idHospitalisation: string;

  @Field()
  @ApiProperty({ type: String, description: 'Medecin demandeur', required: true })
  @IsString()
  idMedecinDemandeur: string;

  @Field()
  @ApiProperty({ type: String, description: 'Service cible', required: true })
  @IsString()
  idServiceCible: string;

  @Field()
  @ApiProperty({ type: String, description: 'Motif de la demande', required: true })
  @IsString()
  motif: string;
}

@InputType()
export class CreateDiagnosticsDto {
  @Field()
  @ApiProperty({ type: String, description: 'Hospitalisation reference', required: true })
  @IsString()
  idHospitalisation: string;

  @Field()
  @ApiProperty({ type: String, description: 'Personnel signataire', required: true })
  @IsString()
  idPersonnel: string;

  @Field()
  @ApiProperty({ type: String, description: 'Description du diagnostic', required: true })
  @IsString()
  descriptionDiagnostic: string;
}

@InputType()
export class CreateAvisMedicalDto {
  @Field()
  @ApiProperty({ type: String, description: "Demande d'avis reference", required: true })
  @IsString()
  idDemande: string;

  @Field()
  @ApiProperty({ type: String, description: 'Medecin signataire', required: true })
  @IsString()
  idMedecin: string;

  @Field()
  @ApiProperty({ type: String, description: "Conclusion de l'avis", required: true })
  @IsString()
  conclusion: string;

  @Field()
  @ApiProperty({ type: String, description: 'Recommandation medicale', required: true })
  @IsString()
  recomandation: string;
}
