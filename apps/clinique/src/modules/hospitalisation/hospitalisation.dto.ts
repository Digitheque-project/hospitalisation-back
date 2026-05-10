import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { StatutDemandeTransfert, StatutLit } from './hospitalisation.entities';

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

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Lit cible (optionnel)', required: false })
  @IsOptional()
  @IsString()
  idLit?: string;
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

@InputType()
export class CreatePrescriptionMedicaleDto {
  @Field()
  @ApiProperty({ type: String, description: 'Hospitalisation reference', required: true })
  @IsString()
  idHospitalisation: string;

  @Field()
  @ApiProperty({ type: String, description: 'Medecin prescripteur', required: true })
  @IsString()
  idMedecin: string;

  @Field()
  @ApiProperty({ type: String, description: "Contenu de l'ordonnance", required: true })
  @IsString()
  contenuPrescription: string;
}

@InputType()
export class CreateDemandeTransfertDto {
  @Field()
  @ApiProperty({ type: String, description: 'Hospitalisation reference', required: true })
  @IsString()
  idHospitalisation: string;

  @Field()
  @ApiProperty({ type: String, description: 'Service source', required: true })
  @IsString()
  serviceSource: string;

  @Field()
  @ApiProperty({ type: String, description: 'Service destination', required: true })
  @IsString()
  serviceDestination: string;

  @Field()
  @ApiProperty({ type: String, description: 'Motif du transfert', required: true })
  @IsString()
  motifDemandeTransfert: string;
}

@InputType()
export class TraiterDemandeTransfertDto {
  @Field(() => StatutDemandeTransfert)
  @ApiProperty({
    enum: StatutDemandeTransfert,
    description: 'Decision sur la demande de transfert',
    required: true,
  })
  @IsEnum(StatutDemandeTransfert)
  statut: StatutDemandeTransfert;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Justification de la decision', required: false })
  @IsOptional()
  @IsString()
  justification?: string;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Lit destination specifique', required: false })
  @IsOptional()
  @IsString()
  idLitDestination?: string;
}

@InputType()
export class CloturerHospitalisationDto {
  @Field()
  @ApiProperty({ type: String, description: 'Mode de sortie', required: true })
  @IsString()
  idModeSortie: string;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Commentaire de sortie', required: false })
  @IsOptional()
  @IsString()
  commentaire?: string;
}

@InputType()
export class CreateAffectationLitDto {
  @Field()
  @ApiProperty({ type: String, description: 'Hospitalisation reference', required: true })
  @IsString()
  idHospitalisation: string;

  @Field()
  @ApiProperty({ type: String, description: 'Lit a affecter', required: true })
  @IsString()
  idLit: string;
}

@InputType()
export class CreateChambreDto {
  @Field()
  @ApiProperty({ type: String, description: 'Service de rattachement', required: true })
  @IsString()
  idService: string;

  @Field()
  @ApiProperty({ type: Number, description: 'Numero de chambre', required: true })
  @IsInt()
  @Min(1)
  numeroChambre: number;

  @Field()
  @ApiProperty({ type: String, description: 'Type de chambre', required: true })
  @IsString()
  type: string;
}

@InputType()
export class CreateLitDto {
  @Field()
  @ApiProperty({ type: String, description: 'Chambre de rattachement', required: true })
  @IsString()
  idChambre: string;

  @Field()
  @ApiProperty({ type: String, description: 'Code unique du lit', required: true })
  @IsString()
  codeLit: string;
}

@InputType()
export class UpdateLitStatutDto {
  @Field(() => StatutLit)
  @ApiProperty({ enum: StatutLit, description: 'Nouveau statut du lit', required: true })
  @IsEnum(StatutLit)
  statut: StatutLit;
}
