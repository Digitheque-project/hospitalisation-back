import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum VpaStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
}

registerEnumType(VpaStatus, { name: 'VpaStatus' });

@ObjectType()
@Entity('vpa')
export class VpaEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  patientId: string;

  @Field()
  @Column()
  cpaId: string;

  @Field(() => VpaStatus)
  @Column({ type: 'varchar', default: VpaStatus.EN_ATTENTE })
  status: VpaStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
