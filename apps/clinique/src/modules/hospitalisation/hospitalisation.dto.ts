import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { StatutDemandeTransfert, StatutHospitalisation, StatutLit } from './hospitalisation.entities';


export class CreatePersonnelRefDto {
  @ApiProperty({ example: 'dr-jean-pierre', description: 'Identifiant du personnel' })
  @IsString()
  id: string;
}

export class CreateServiceRefDto {
  @ApiProperty({ example: 'chirurgie', description: 'Identifiant du service' })
  @IsString()
  id: string;
}

@InputType()
export class CreateHospitalisationDto {
  @Field()
  @ApiProperty({ type: String, description: 'Identifiant patient', required: true })
  @IsString()
  patientId: string;

  @Field()
  @ApiProperty({ type: String, description: 'Identifiant service', required: true })
  @IsString()
  serviceId: string;

  @Field()
  @ApiProperty({ type: String, description: "Date d'entree ISO", required: true })
  @IsDateString()
  dateEntrer: string;

  @Field()
  @ApiProperty({ type: String, description: 'Motif hospitalisation', required: true })
  @IsString()
  motifHospitalisation: string;

  @Field({ nullable: true })
  @ApiProperty({
    type: String,
    description: "Type d'hospitalisation",
    required: false,
    default: 'Hospitalisation',
    enum: ['Hospitalisation'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['Hospitalisation'])
  type?: string;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Identifiant mode sortie', required: false })
  @IsOptional()
  @IsUUID()
  idModeSortie?: string;

  @Field({ nullable: true })
  @ApiProperty({ type: String, description: 'Commentaire medical', required: false })
  @IsOptional()
  @IsString()
  commentaire?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    type: String,
    description:
      "Identifiant du lit à affecter à la création. Si omis ou null, aucune affectation de lit n'est créée.",
    required: false,
    nullable: true,
  })
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
  serviceId: string;

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

export class HospitalisationStatsResponse {
  @ApiProperty({ example: 12 })
  hospitalizedTotal: number;

  @ApiProperty({ example: 3 })
  hospitalizedNewToday: number;
}

export class ActiveHospitalisationItem {
  @ApiProperty({ example: '5b2b1b80-0f71-4bb1-9f5b-8d521d3d0b33' })
  id: string;

  @ApiProperty({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' })
  patientId: string;

  @ApiProperty({ example: '2026-05-11T08:15:00.000Z' })
  dateEntrer: string;

  @ApiProperty({ example: 'Appendicectomie laparoscopique' })
  motifHospitalisation: string;

  @ApiProperty({ example: 'service-123' })
  serviceId: string;

  @ApiProperty({ enum: StatutHospitalisation })
  statutHospitalisation: StatutHospitalisation;

  @ApiProperty({ example: 'A1', required: false, nullable: true })
  litCode?: string | null;

  @ApiProperty({ example: 12, required: false, nullable: true })
  chambreNumero?: number | null;
}

// --- Plan des Lits DTOs ---

export class PlanLitBedHospitalisation {
  @ApiProperty({ example: '5b2b1b80-0f71-4bb1-9f5b-8d521d3d0b33' })
  id: string;

  @ApiProperty({ example: '2f4fef1e-2f8b-4f90-b8a6-0ea2d8b3b6c8' })
  patientId: string;

  @ApiProperty({ example: '2026-05-11T08:15:00.000Z' })
  dateEntrer: string;

  @ApiProperty({ example: 'Appendicectomie laparoscopique' })
  motifHospitalisation: string;

  @ApiProperty({ enum: StatutHospitalisation })
  statutHospitalisation: StatutHospitalisation;

  @ApiProperty({ example: 'Cholécystite lithiasique', required: false, nullable: true })
  diagnostic?: string | null;

  @ApiProperty({ example: 3 })
  soinsCount: number;
}

export class PlanLitBedItem {
  @ApiProperty({ example: '9a1b2c3d-4e5f-6789-abcd-ef0123456789' })
  litId: string;

  @ApiProperty({ example: 'A1' })
  codeLit: string;

  @ApiProperty({ enum: StatutLit })
  statut: StatutLit;

  @ApiProperty({ type: PlanLitBedHospitalisation, required: false, nullable: true })
  hospitalisation?: PlanLitBedHospitalisation | null;
}

export class PlanLitRoomItem {
  @ApiProperty({ example: '1a2b3c4d-5e6f-7890-abcd-ef0123456789' })
  chambreId: string;

  @ApiProperty({ example: 101 })
  numeroChambre: number;

  @ApiProperty({ example: 'Standard' })
  type: string;

  @ApiProperty({ type: [PlanLitBedItem] })
  lits: PlanLitBedItem[];
}

export class PlanLitsStats {
  @ApiProperty({ example: 24 })
  totalLits: number;

  @ApiProperty({ example: 18 })
  litsOccupes: number;

  @ApiProperty({ example: 18 })
  totalPatients: number;
}

export class PlanLitsResponse {
  @ApiProperty({ example: 'service-123' })
  serviceId: string;

  @ApiProperty({ type: [PlanLitRoomItem] })
  chambres: PlanLitRoomItem[];

  @ApiProperty({ type: PlanLitsStats })
  stats: PlanLitsStats;
}
