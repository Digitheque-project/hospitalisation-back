import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column()
  vpaId: string;

  @Field()
  @Column({ default: false })
  checklistOmsValidee: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
