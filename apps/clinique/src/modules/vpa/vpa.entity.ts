import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HospitalisationEntity } from '../hospitalisation/hospitalisation.entities';

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
  @Column({ name: 'hospitalisation_id', type: 'uuid' })
  hospitalisationId: string;

  @ManyToOne(() => HospitalisationEntity, { nullable: false })
  @JoinColumn({ name: 'hospitalisation_id' })
  hospitalisation: HospitalisationEntity;

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
