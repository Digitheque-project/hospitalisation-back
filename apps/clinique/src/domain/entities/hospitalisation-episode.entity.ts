import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @PrimaryGeneratedColumn('uuid', { name: 'id_episode' })
  id: string;

  @Field()
  @Column({ name: 'patient_id', type: 'varchar', length: 120 })
  patientId: string;

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

  @Field()
  @Column({ name: 'motif_admission', type: 'text' })
  motifAdmission: string;

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
