import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import {
  ModeSortie,
  StatutHospitalisation,
  StatutPaiementSortie,
} from '../../domain/entities/hospitalisation-episode.entity';
​
@InputType()
export class CreateHospitalisationEpisodeDto {
  @Field()
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Identifiant patient (chaine, longueur max = celle d\'un UUID)' })
  @IsString()
  @Length(1, 36)
  patientId: string;
​
  @Field()
  @ApiProperty({ example: '75f995a2-40e9-4285-84e4-a72501d37bfd', description: 'Identifiant service destination (concerne)' })
  @IsUUID()
  @Length(1, 120)
  serviceIdDest: string;
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
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU auquel appartient l episode' })
  @IsUUID()
  @Length(1, 120)
  chuId: string;

  @Field()
  @ApiProperty({ example: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909', description: "Auteur de l'admission" })
  @IsUUID()
  createdBy: string;
​
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  litId?: string | null;
​
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ description: 'Service source (consultation externe) a l origine de l episode' })
  @IsOptional()
  @IsUUID()
  @Length(1, 120)
  serviceIdSource?: string | null;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional({ description: 'Episode precedent (transfert interne) dont cet episode est la suite' })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  episodePrecedentId?: string | null;
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
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsUUID()
  @Length(1, 120)
  chuId: string;
​
  @Field()
  @ApiProperty({ example: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909', description: 'Auteur de la mise a jour' })
  @IsUUID()
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
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsUUID()
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
  @ApiProperty({ example: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909', description: 'Auteur de la clôture' })
  @IsUUID()
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
  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'Service de destination si transfert interne' })
  @IsOptional()
  @IsUUID()
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
  @ApiProperty({ example: '75f995a2-40e9-4285-84e4-a72501d37bfd', description: 'Filtre obligatoire par service destination (concerne)' })
  @IsUUID()
  serviceIdDest: string;
​
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Filtre obligatoire par CHU' })
  @IsUUID()
  chuId: string;
​
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', required: false, description: 'Identifiant patient (chaine, longueur max = celle d\'un UUID)' })
  @IsOptional()
  @IsString()
  @Length(1, 36)
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
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsUUID()
  @Length(1, 120)
  chuId: string;
​
  @Field()
  @ApiProperty({ example: '75f995a2-40e9-4285-84e4-a72501d37bfd', description: 'Identifiant service destination (concerne)' })
  @IsUUID()
  @Length(1, 120)
  serviceIdDest: string;
​
  @Field()
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Identifiant patient (chaine, longueur max = celle d\'un UUID)' })
  @IsString()
  @Length(1, 36)
  patientId: string;
​
  @Field()
  @ApiProperty({ example: 'lit-CHU-Andr-2026-chambre-CHU-Andr-2026-service-123-101-A1', description: 'Identifiant lit' })
  @IsString()
  @Length(1, 120)
  litId: string;
​
  @Field()
  @ApiProperty({ example: 'bb2ff11e-0e8b-4ea5-a120-ed4c55d07909', description: 'Auteur de l\'attribution' })
  @IsUUID()
  updatedBy: string;
}
​
@InputType()
export class UpdateExeatableDto {
  @Field()
  @ApiProperty({ example: true, description: "Nouvel etat exeatable a persister" })
  @IsBoolean()
  exeatable: boolean;
​
  @Field()
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsUUID()
  @Length(1, 120)
  chuId: string;
}
​