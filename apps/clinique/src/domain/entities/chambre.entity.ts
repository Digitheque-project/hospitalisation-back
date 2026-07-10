import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LitEntity } from './lit.entity';
​
@ObjectType()
@Entity('chambre')
export class ChambreEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;
​
  @Field()
  @Column({ type: 'uuid' })
  serviceId: string;
​
  @Field()
  @Column({ type: 'uuid' })
  chuId: string;
​
  @Field(() => Int)
  @Column({ type: 'int' })
  numeroChambre: number;
​
  @Field()
  @Column({ type: 'varchar', length: 120 })
  type: string;
​
  @Field(() => [LitEntity], { nullable: true })
  @OneToMany(() => LitEntity, (lit) => lit.chambre)
  lits?: LitEntity[];
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