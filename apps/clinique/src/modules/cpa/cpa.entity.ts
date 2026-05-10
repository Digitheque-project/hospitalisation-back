import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HospitalisationEntity } from '../hospitalisation/hospitalisation.entities';

export enum CpaStatus {
  PLANIFIE = 'PLANIFIE',
  REALISE = 'REALISE',
}

registerEnumType(CpaStatus, { name: 'CpaStatus' });

@ObjectType()
@Entity('cpa')
export class CpaEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  patientId: string;

  @Field()
  @Column({ name: 'hospitalisation_id', type: 'uuid' })
  hospitalisationId: string;

  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'hospitalisation_id' })
  hospitalisation: HospitalisationEntity;

  @Field(() => Int)
  @Column({ type: 'int' })
  asaScore: number;

  @Field()
  @Column({ type: 'varchar', length: 180 })
  typeChirurgie: string;

  @Field()
  @Column({ type: 'varchar', length: 180 })
  chirurgien: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  dureePrevueMinutes: number;

  @Field()
  @Column({ type: 'boolean', default: false })
  risqueHemorragique: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  urgence: boolean;

  @Field()
  @Column({ type: 'varchar', length: 180 })
  decisionAnesthesique: string;

  @Field()
  @Column({ type: 'text' })
  protocoleInstructions: string;

  @Field(() => CpaStatus)
  @Column({ type: 'varchar', default: CpaStatus.PLANIFIE })
  status: CpaStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
