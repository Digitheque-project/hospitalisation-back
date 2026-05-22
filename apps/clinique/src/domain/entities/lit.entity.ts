import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChambreEntity } from './chambre.entity';

export enum StatutLit {
  DISPONIBLE = 'DISPONIBLE',
  OCCUPE = 'OCCUPE',
  MAINTENANCE = 'MAINTENANCE',
}

registerEnumType(StatutLit, { name: 'StatutLit' });

@ObjectType()
@Entity('lit')
export class LitEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid', { name: 'id_lit' })
  id: string;

  @Field(() => String)
  @Column({ name: 'chambre_id', type: 'uuid' })
  chambreId: string;

  @Field(() => ChambreEntity)
  @ManyToOne(() => ChambreEntity, (chambre) => chambre.lits, { nullable: false })
  @JoinColumn({ name: 'chambre_id' })
  chambre: ChambreEntity;

  @Field()
  @Column({ name: 'code_lit', type: 'varchar', length: 120 })
  codeLit: string;

  @Field(() => StatutLit)
  @Column({ name: 'statut', type: 'varchar', length: 40, default: StatutLit.DISPONIBLE })
  statut: StatutLit;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
