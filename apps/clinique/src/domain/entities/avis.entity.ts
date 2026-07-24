import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Cycle de vie d'une demande d'avis inter-services.
 *
 * Jumeau de StatutDemande mais SANS creation d'episode : le patient reste dans
 * son service source ; le service destinataire prend en charge, repond (compte-
 * rendu) ou refuse, puis le demandeur cloture.
 */
export enum StatutAvis {
  EN_ATTENTE = 'EN_ATTENTE',
  // Vue par le service destinataire mais pas encore traitee (badge "non lues").
  CONSULTEE = 'CONSULTEE',
  PRISE_EN_CHARGE = 'PRISE_EN_CHARGE',
  REPONDUE = 'REPONDUE',
  CLOTUREE = 'CLOTUREE',
  REFUSEE = 'REFUSEE',
}

/** Degre d'urgence de l'avis demande. */
export enum UrgenceAvis {
  PROGRAMMEE = 'PROGRAMMEE',
  URGENTE = 'URGENTE',
  VITALE = 'VITALE',
}

registerEnumType(StatutAvis, { name: 'StatutAvis' });
registerEnumType(UrgenceAvis, { name: 'UrgenceAvis' });

@ObjectType()
@Entity('avis')
export class AvisEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;

  @Field()
  @Column({ type: 'text' })
  motif: string;

  @Field()
  @Column({ type: 'varchar', length: 36 })
  patientId: string;

  @Field()
  @Column({ type: 'uuid' })
  serviceIdSource: string;

  @Field()
  @Column({ type: 'uuid' })
  serviceIdDest: string;

  @Field()
  @Column({ type: 'uuid' })
  chuId: string;

  @Field(() => UrgenceAvis)
  @Column({ type: 'varchar', length: 40, default: UrgenceAvis.PROGRAMMEE })
  urgence: UrgenceAvis;

  @Field(() => StatutAvis)
  @Column({ type: 'varchar', length: 40, default: StatutAvis.EN_ATTENTE })
  statut: StatutAvis;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  infoComplementaire?: string | null;

  // Compte-rendu du consultant (rempli au passage a REPONDUE).
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  reponse?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  motifRefus?: string | null;

  @Field()
  @Column({ type: 'uuid' })
  createdBy: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string | null;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
