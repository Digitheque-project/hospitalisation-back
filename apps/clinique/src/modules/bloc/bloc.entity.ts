import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HospitalisationEntity } from '../hospitalisation/hospitalisation.entities';

@ObjectType()
@Entity('bloc_operatoire')
export class BlocOperatoireEntity {
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
  vpaId: string;

  @Field()
  @Column({ default: false })
  checklistOmsValidee: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
