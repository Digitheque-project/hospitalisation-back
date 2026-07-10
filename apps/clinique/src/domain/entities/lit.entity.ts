import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChambreEntity } from './chambre.entity';
​
export enum StatutLit {
  DISPONIBLE = 'DISPONIBLE',
  OCCUPE = 'OCCUPE',
  A_NETTOYER = 'A_NETTOYER',
  MAINTENANCE = 'MAINTENANCE',
}
​
registerEnumType(StatutLit, { name: 'StatutLit' });
​
@ObjectType()
@Entity('lit')
export class LitEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;
​
  @Field(() => String)
  @Column({ type: 'varchar', length: 120 })
  chambreId: string;
​
  @Field(() => String)
  @Column({ type: 'uuid' })
  chuId: string;
​
  @Field(() => ChambreEntity)
  @ManyToOne(() => ChambreEntity, (chambre) => chambre.lits, { nullable: false })
  @JoinColumn({ name: 'chambreId' })
  chambre: ChambreEntity;
​
  @Field()
  @Column({ type: 'varchar', length: 120 })
  codeLit: string;
​
  @Field(() => StatutLit)
  @Column({ type: 'varchar', length: 40, default: StatutLit.DISPONIBLE })
  statut: StatutLit;
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