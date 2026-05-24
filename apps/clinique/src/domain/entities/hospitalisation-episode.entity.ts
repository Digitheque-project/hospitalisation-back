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

export enum StatutHospitalisation {
  ADMIS = 'ADMIS',
  EN_COURS = 'EN_COURS',
  TRANSFERE = 'TRANSFERE',
  SORTIE = 'SORTIE',
  DECEDE = 'DECEDE',
  EVADE = 'EVADE',
}

registerEnumType(StatutHospitalisation, { name: 'StatutHospitalisation' });

@ObjectType()
@Entity('hospitalisation_episode')
export class HospitalisationEpisodeEntity {
  @Field(() => ID)
  @PrimaryColumn({ name: 'id_episode', type: 'varchar', length: 120 })
  id: string;

  @Field()
  @Column({ name: 'patient_id', type: 'varchar', length: 120 })
  patientId: string;

  @Field(() => PatientInformationsAccueil, { nullable: true })
  @ApiProperty({ type: () => PatientInformationsAccueil, required: false })
  patient?: PatientInformationsAccueil;

  @Field()
  @Column({ name: 'chu_id', type: 'varchar', length: 120 })
  chuId: string;

  @Field()
  @Column({ name: 'service_id', type: 'varchar', length: 120 })
  serviceId: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'lit_id', type: 'varchar', length: 120, nullable: true })
  litId?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'lit_code', type: 'varchar', length: 80, nullable: true })
  litCode?: string | null;

  @Field()
  @Column({ name: 'date_admission', type: 'timestamp' })
  dateAdmission: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'date_sortie', type: 'timestamp', nullable: true })
  dateSortie?: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'motif_admission', type: 'text', nullable: true })
  motifAdmission?: string | null;

  @Field(() => StatutHospitalisation)
  @Column({ name: 'statut', type: 'varchar', length: 40 })
  statut: StatutHospitalisation;

  @Field()
  @Column({ name: 'created_by', type: 'varchar', length: 120 })
  createdBy: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'updated_by', type: 'varchar', length: 120, nullable: true })
  updatedBy?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'commentaire_sortie', type: 'text', nullable: true })
  commentaireSortie?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
