import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StatutDemande {
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EN_ATTENTE = 'EN_ATTENTE',
}

registerEnumType(StatutDemande, { name: 'StatutDemande' });

@ObjectType()
@Entity('demande')
export class DemandeEntity {
  @Field(() => ID)
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 120 })
  id: string;

  @Field()
  @Column({ name: 'motif', type: 'text' })
  motif: string;

  @Field()
  @Column({ name: 'patient_id', type: 'varchar', length: 120 })
  patientId: string;

  @Field()
  @Column({ name: 'service_id', type: 'varchar', length: 120 })
  serviceId: string;

  @Field()
  @Column({ name: 'chu_id', type: 'varchar', length: 120 })
  chuId: string;

  @Field(() => StatutDemande)
  @Column({ name: 'statut', type: 'varchar', length: 40, default: StatutDemande.EN_ATTENTE })
  statut: StatutDemande;

  @Field(() => String, { nullable: true })
  @Column({ name: 'info_complementaire', type: 'text', nullable: true })
  infoComplementaire?: string | null;

  @Field()
  @Column({ name: 'created_by', type: 'varchar', length: 120 })
  createdBy: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'updated_by', type: 'varchar', length: 120, nullable: true })
  updatedBy?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
