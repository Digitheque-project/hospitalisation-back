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

@ObjectType()
@Entity('chambre')
export class ChambreEntity {
  @Field(() => ID)
  @PrimaryColumn({ name: 'id_chambre', type: 'varchar', length: 120 })
  id: string;

  @Field()
  @Column({ name: 'service_id', type: 'varchar', length: 120 })
  serviceId: string;

  @Field()
  @Column({ name: 'chu_id', type: 'varchar', length: 120 })
  chuId: string;

  @Field(() => Int)
  @Column({ name: 'numero_chambre', type: 'int' })
  numeroChambre: number;

  @Field()
  @Column({ name: 'type_chambre', type: 'varchar', length: 120 })
  type: string;

  @Field(() => [LitEntity], { nullable: true })
  @OneToMany(() => LitEntity, (lit) => lit.chambre)
  lits?: LitEntity[];

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
