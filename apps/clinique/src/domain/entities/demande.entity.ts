import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
​
export enum StatutDemande {
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EN_ATTENTE = 'EN_ATTENTE',
}
​
registerEnumType(StatutDemande, { name: 'StatutDemande' });
​
@ObjectType()
@Entity('demande')
export class DemandeEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;
​
  @Field()
  @Column({ type: 'text' })
  motif: string;
​
  @Field()
  @Column({ type: 'uuid' })
  patientId: string;
​
  @Field()
  @Column({ type: 'uuid' })
  serviceIdSource: string;
​
  @Field()
  @Column({ type: 'uuid' })
  serviceIdDest: string;
​
  @Field()
  @Column({ type: 'uuid' })
  chuId: string;
​
  @Field(() => StatutDemande)
  @Column({ type: 'varchar', length: 40, default: StatutDemande.EN_ATTENTE })
  statut: StatutDemande;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  infoComplementaire?: string | null;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  motifRefus?: string | null;
​
  @Field()
  @Column({ type: 'uuid' })
  createdBy: string;
​
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string | null;
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