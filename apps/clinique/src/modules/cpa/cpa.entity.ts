import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Field(() => Int)
  @Column({ type: 'int' })
  asaScore: number;

  @Field(() => CpaStatus)
  @Column({ type: 'varchar', default: CpaStatus.PLANIFIE })
  status: CpaStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
