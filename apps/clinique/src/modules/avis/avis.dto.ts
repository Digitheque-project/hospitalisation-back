import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { StatutAvis, UrgenceAvis } from "../../domain/entities/avis.entity";

@InputType()
export class CreateAvisDto {
  @Field()
  @ApiProperty({
    example: "Avis cardiologique pour douleur thoracique",
    description: "Motif de la demande d'avis",
  })
  @IsString()
  motif: string;

  @Field()
  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Identifiant patient",
  })
  @IsString()
  @Length(1, 36)
  patientId: string;

  @Field()
  @ApiProperty({
    example: "75f995a2-40e9-4285-84e4-a72501d37bfd",
    description: "Service source (celui qui demande)",
  })
  @IsUUID()
  serviceIdSource: string;

  @Field()
  @ApiProperty({
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    description: "Service destinataire (le consultant)",
  })
  @IsUUID()
  serviceIdDest: string;

  @Field()
  @ApiProperty({
    example: "1e5bbbb7-fa10-4d59-8848-2d0ce96a9394",
    description: "Identifiant CHU",
  })
  @IsUUID()
  chuId: string;

  @Field(() => UrgenceAvis, { nullable: true })
  @ApiProperty({ enum: UrgenceAvis, required: false })
  @IsOptional()
  @IsEnum(UrgenceAvis)
  urgence?: UrgenceAvis;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: "ECG realise, troponine en cours",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  infoComplementaire?: string | null;

  @Field()
  @ApiProperty({
    example: "bb2ff11e-0e8b-4ea5-a120-ed4c55d07909",
    description: "Auteur de la demande",
  })
  @IsString()
  @Length(1, 120)
  createdBy: string;
}

@InputType()
export class UpdateAvisDto {
  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  motif?: string;

  @Field(() => StatutAvis, { nullable: true })
  @ApiProperty({ enum: StatutAvis, required: false })
  @IsOptional()
  @IsEnum(StatutAvis)
  statut?: StatutAvis;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: "Compte-rendu du consultant", required: false })
  @IsOptional()
  @IsString()
  reponse?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  infoComplementaire?: string;

  @Field()
  @ApiProperty({
    example: "bb2ff11e-0e8b-4ea5-a120-ed4c55d07909",
    description: "Auteur de la mise a jour",
  })
  @IsString()
  @Length(1, 120)
  updatedBy: string;

  // Identite du signataire, transmise au passage a REPONDUE. Elle n'est prise
  // en compte que pour cette transition (cf. avis.service).

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: "RAKOTO", required: false })
  @IsOptional()
  @IsString()
  @Length(0, 120)
  repondeurNom?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: "Jean", required: false })
  @IsOptional()
  @IsString()
  @Length(0, 120)
  repondeurPrenom?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: "Medecin, Cardiologie", required: false })
  @IsOptional()
  @IsString()
  @Length(0, 120)
  repondeurFonction?: string;
}

export class AvisQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  chuId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  serviceIdSource?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  serviceIdDest?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ enum: StatutAvis, required: false })
  @IsOptional()
  @IsEnum(StatutAvis)
  statut?: StatutAvis;

  /**
   * Plusieurs statuts separes par des virgules, pour charger une file de
   * travail en un seul appel (ex. EN_ATTENTE,CONSULTEE,PRISE_EN_CHARGE).
   * Prioritaire sur `statut` s'il est renseigne.
   */
  @ApiProperty({
    required: false,
    example: "EN_ATTENTE,CONSULTEE,PRISE_EN_CHARGE",
  })
  @IsOptional()
  @IsString()
  statuts?: string;
}

/** Accuse de reception groupe des avis recus par un service. */
export class MarquerAvisConsulteesDto {
  @ApiProperty({
    example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    description: "Service consulte qui accuse reception",
  })
  @IsUUID()
  serviceIdDest: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  chuId?: string;
}
