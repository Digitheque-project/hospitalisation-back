import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientInformationsAccueil } from '../../infrastructure/http-clients/patient-informations-accueil.type';
​
export enum StatutHospitalisation {
  ADMIS = 'ADMIS',
  EN_COURS = 'EN_COURS',
  TRANSFERE = 'TRANSFERE',
  SORTIE = 'SORTIE',
  DECEDE = 'DECEDE',
  EVADE = 'EVADE',
}
​
export enum ModeSortie {
  SORTIE_AUTORISEE = 'SORTIE_AUTORISEE',
  SORTIE_CONTRE_AVIS = 'SORTIE_CONTRE_AVIS',
  TRANSFERT_INTERNE = 'TRANSFERT_INTERNE',
  TRANSFERT_EXTERNE = 'TRANSFERT_EXTERNE',
  EVACUATION_SANITAIRE = 'EVACUATION_SANITAIRE',
  DECES = 'DECES',
  EVASION = 'EVASION',
}
​
export enum StatutPaiementSortie {
  NON_VERIFIE = 'NON_VERIFIE',
  REGLE = 'REGLE',
  NON_REGLE = 'NON_REGLE',
  EXONERE = 'EXONERE',
  PRISE_EN_CHARGE = 'PRISE_EN_CHARGE',
  REGLEMENT_DIFFERE = 'REGLEMENT_DIFFERE',
}
​
registerEnumType(StatutHospitalisation, { name: 'StatutHospitalisation' });
registerEnumType(ModeSortie, { name: 'ModeSortie' });
registerEnumType(StatutPaiementSortie, { name: 'StatutPaiementSortie' });
​
@ObjectType()
@Entity('hospitalisation_episode')
export class HospitalisationEpisodeEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;
​
  @Field()
  @Column({ type: 'uuid' })
  patientId: string;
​
  @Field(() => PatientInformationsAccueil, { nullable: true })
  @ApiProperty({ type: () => PatientInformationsAccueil, required: false })
  patient?: PatientInformationsAccueil;
​
  @Field()
  @Column({ type: 'uuid' })
  chuId: string;
​
  @Field()
  @Column({ type: 'uuid' })
  serviceId: string;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  litId?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 80, nullable: true })
  litCode?: string | null;
​
  @Field()
  @Column({ type: 'timestamp' })
  dateAdmission: Date;
​
  /** Date effective de sortie. Remplie automatiquement à la validation/clôture. */
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateSortie?: Date | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  motifAdmission?: string | null;
​
  @Field(() => StatutHospitalisation)
  @Column({ type: 'varchar', length: 40 })
  statut: StatutHospitalisation;
​
  @Field(() => ModeSortie, { nullable: true })
  @Column({ type: 'varchar', length: 40, nullable: true })
  modeSortie?: ModeSortie | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  etatSortie?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  motifSortie?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  resumeSortie?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  diagnosticFinal?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  traitementSortie?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  conduiteATenir?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  rendezVousControle?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  destinationServiceId?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  destinationEtablissement?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  moyenTransport?: string | null;
​
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateDeces?: Date | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  causeDeces?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  certificatDecesNumero?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  motifContreAvis?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  risquesExpliques?: string | null;
​
  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  signaturePatient?: boolean | null;
​
  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  fraisRegles: boolean;
​
  @Field(() => StatutPaiementSortie)
  @Column({ type: 'varchar', length: 40, default: StatutPaiementSortie.NON_VERIFIE })
  statutPaiementSortie: StatutPaiementSortie;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  referencePaiement?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  commentairePaiement?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  fraisReglesPar?: string | null;
​
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  fraisReglesAt?: Date | null;
​
  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  sortieMedicaleValidee: boolean;
​
  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  sortieAdministrativeValidee: boolean;
​
  @Field()
  @Column({ type: 'uuid' })
  createdBy: string;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  validatedBy?: string | null;
​
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  validatedAt?: Date | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  commentaireSortie?: string | null;
​
  @Field()
  @ApiProperty({ example: false, description: "Etat 'exeatable' persistant (toggle du plan des lits, front clinique)" })
  @Column({ type: 'boolean', default: false })
  exeatable: boolean;
​
  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
​
  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
​