import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import {
  ModeSortie,
  StatutHospitalisation,
  StatutPaiementSortie,
} from '../../domain/entities/hospitalisation-episode.entity';
​
@InputType()
export class CreateHospitalisationEpisodeDto {
  @Field()
  @ApiProperty({ example: 'patient-123', description: 'Identifiant patient' })
  @IsString()
  @Length(1, 120)
  patientId: string;
​
  @Field()
  @ApiProperty({ example: 'service-123', description: 'Identifiant service' })
  @IsString()
  @Length(1, 120)
  serviceId: string;
​
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  dateAdmission?: string | null;
​
  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'Observation clinique',
    description: "Motif de l'admission",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  motifAdmission?: string | null;
​
  @Field()
  @ApiProperty({ example: 'agent-45', description: "Auteur de l'admission" })
  @IsString()
  createdBy: string;
​
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  litId?: string | null;
}
​
@InputType()
export class UpdateHospitalisationStatusDto {
  @Field(() => StatutHospitalisation)
  @ApiProperty({ enum: StatutHospitalisation, description: 'Nouveau statut non clôturant' })
  @IsEnum(StatutHospitalisation)
  statut: StatutHospitalisation;
​
  @Field()
  @ApiProperty({ example: 'chu-01', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;
​
  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de la mise a jour' })
  @IsString()
  updatedBy: string;
}
​
@InputType()
export class CloseHospitalisationEpisodeDto {
  @Field()
  @ApiProperty({ enum: ModeSortie, example: ModeSortie.SORTIE_AUTORISEE, description: 'Mode métier de sortie' })
  @IsEnum(ModeSortie)
  modeSortie: ModeSortie;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({
    example: '2026-05-23T09:00:00.000Z',
    description: 'Date effective de sortie. Ne pas envoyer depuis le front sauf correction autorisée; sinon le backend met maintenant.',
  })
  @IsOptional()
  @IsDateString()
  dateSortie?: string;
​
  @Field()
  @ApiProperty({ example: 'chu-01', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Sortie régulière', description: 'Commentaire administratif/médical court' })
  @IsOptional()
  @IsString()
  commentaireSortie?: string;
​
  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de la clôture' })
  @IsString()
  updatedBy: string;
​
  @Field(() => StatutHospitalisation, { nullable: true })
  @ApiPropertyOptional({
    enum: StatutHospitalisation,
    description: 'Statut final optionnel. Si absent, il est déduit de modeSortie.',
  })
  @IsOptional()
  @IsEnum(StatutHospitalisation)
  statutFinal?: StatutHospitalisation;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Stable', description: 'État clinique du patient à la sortie' })
  @IsOptional()
  @IsString()
  etatSortie?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Fin de traitement et amélioration clinique' })
  @IsOptional()
  @IsString()
  motifSortie?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Hospitalisation de 5 jours pour pneumonie, évolution favorable.' })
  @IsOptional()
  @IsString()
  resumeSortie?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Pneumonie communautaire améliorée' })
  @IsOptional()
  @IsString()
  diagnosticFinal?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Amoxicilline 1g x3/j pendant 5 jours' })
  @IsOptional()
  @IsString()
  traitementSortie?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Revenir en urgence si dyspnée ou fièvre persistante' })
  @IsOptional()
  @IsString()
  conduiteATenir?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Contrôle dans 7 jours' })
  @IsOptional()
  @IsString()
  rendezVousControle?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'service-456', description: 'Service de destination si transfert interne' })
  @IsOptional()
  @IsString()
  destinationServiceId?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'CHU de référence', description: 'Établissement de destination si transfert externe/évacuation' })
  @IsOptional()
  @IsString()
  destinationEtablissement?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Ambulance médicalisée' })
  @IsOptional()
  @IsString()
  moyenTransport?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '2026-05-23T08:45:00.000Z' })
  @IsOptional()
  @IsDateString()
  dateDeces?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Arrêt cardio-respiratoire' })
  @IsOptional()
  @IsString()
  causeDeces?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'CERT-2026-0001' })
  @IsOptional()
  @IsString()
  certificatDecesNumero?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Patient souhaite poursuivre les soins à domicile' })
  @IsOptional()
  @IsString()
  motifContreAvis?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Risques de rechute, aggravation et décès expliqués' })
  @IsOptional()
  @IsString()
  risquesExpliques?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: true, description: 'Patient a signé la sortie contre avis' })
  @IsOptional()
  @IsBoolean()
  signaturePatient?: boolean;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: true, description: 'Toggle front: frais réglés' })
  @IsOptional()
  @IsBoolean()
  fraisRegles?: boolean;
​
  @Field(() => StatutPaiementSortie, { nullable: true })
  @ApiPropertyOptional({ enum: StatutPaiementSortie, example: StatutPaiementSortie.REGLE })
  @IsOptional()
  @IsEnum(StatutPaiementSortie)
  statutPaiementSortie?: StatutPaiementSortie;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'RECU-2026-001' })
  @IsOptional()
  @IsString()
  referencePaiement?: string;
​
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Paiement validé par la caisse' })
  @IsOptional()
  @IsString()
  commentairePaiement?: string;
}
​
export class HospitalisationEpisodeQuery {
  @ApiProperty({ example: 'service-123', description: 'Filtre obligatoire par service' })
  @IsString()
  serviceId: string;
​
  @ApiProperty({ example: 'chu-01', description: 'Filtre obligatoire par CHU' })
  @IsString()
  chuId: string;
​
  @ApiProperty({ example: 'patient-123', required: false })
  @IsOptional()
  @IsString()
  patientId?: string;
​
  @ApiProperty({ enum: StatutHospitalisation, required: false })
  @IsOptional()
  @IsEnum(StatutHospitalisation)
  statut?: StatutHospitalisation;
}
​
@InputType()
export class AttributeLitDto {
  @Field()
  @ApiProperty({ example: 'chu-01', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;
​
  @Field()
  @ApiProperty({ example: 'service-123', description: 'Identifiant service' })
  @IsString()
  @Length(1, 120)
  serviceId: string;
​
  @Field()
  @ApiProperty({ example: 'patient-123', description: 'Identifiant patient' })
  @IsString()
  @Length(1, 120)
  patientId: string;
​
  @Field()
  @ApiProperty({ example: 'lit-CHU-Andr-2026-chambre-CHU-Andr-2026-service-123-101-A1', description: 'Identifiant lit' })
  @IsString()
  @Length(1, 120)
  litId: string;
​
  @Field()
  @ApiProperty({ example: 'agent-45', description: 'Auteur de l\'attribution' })
  @IsString()
  updatedBy: string;
}

@InputType()
export class UpdateExeatableDto {
  @Field()
  @ApiProperty({ example: true, description: "Nouvel etat exeatable a persister" })
  @IsBoolean()
  exeatable: boolean;

  @Field()
  @ApiProperty({ example: 'chu-01', description: 'Identifiant CHU' })
  @IsString()
  @Length(1, 120)
  chuId: string;
}
