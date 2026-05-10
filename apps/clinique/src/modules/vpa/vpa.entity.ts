import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CpaEntity } from '../cpa/cpa.entity';
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

  @ManyToOne(() => CpaEntity, { nullable: false })
  @JoinColumn({ name: 'cpaId', referencedColumnName: 'id' })
  cpa: CpaEntity;

  @Field()
  @Column({ type: 'boolean', default: false })
  instructionsRespectees: boolean;

  @Field()
  @Column({ type: 'text' })
  ordonnanceAnesthesie: string;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  heureDepartBloc: Date;

  @Field(() => VpaStatus)
  @Column({ type: 'varchar', default: VpaStatus.EN_ATTENTE })
  status: VpaStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
