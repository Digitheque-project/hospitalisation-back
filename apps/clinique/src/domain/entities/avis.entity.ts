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

/**
 * Degre d'urgence de l'avis demande. Meme vocabulaire que le reste du
 * dossier (motif de consultation, notifications de soins) : NORMAL,
 * URGENT, TRES_URGENT.
 */
export enum UrgenceAvis {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
  TRES_URGENT = 'TRES_URGENT',
}

registerEnumType(StatutAvis, { name: 'StatutAvis' });
registerEnumType(UrgenceAvis, { name: 'UrgenceAvis' });

/**
 * Transitions autorisees du cycle de vie (standard HL7 FHIR ServiceRequest /
 * Task : requested -> received -> in-progress -> completed | rejected).
 *
 * Aucun retour arriere : un avis repondu ne redevient pas "en attente", un
 * refus et une cloture sont terminaux. REPONDUE -> REPONDUE est tolere pour
 * permettre au consultant d'amender son compte-rendu (report amendment).
 */
export const TRANSITIONS_AVIS: Record<StatutAvis, StatutAvis[]> = {
  [StatutAvis.EN_ATTENTE]: [
    StatutAvis.CONSULTEE,
    StatutAvis.PRISE_EN_CHARGE,
    StatutAvis.REPONDUE,
    StatutAvis.REFUSEE,
  ],
  [StatutAvis.CONSULTEE]: [
    StatutAvis.PRISE_EN_CHARGE,
    StatutAvis.REPONDUE,
    StatutAvis.REFUSEE,
  ],
  [StatutAvis.PRISE_EN_CHARGE]: [StatutAvis.REPONDUE, StatutAvis.REFUSEE],
  [StatutAvis.REPONDUE]: [StatutAvis.REPONDUE, StatutAvis.CLOTUREE],
  [StatutAvis.REFUSEE]: [],
  [StatutAvis.CLOTUREE]: [],
};

/**
 * Delai cible de reponse par degre d'urgence, en minutes (equivalent de
 * ServiceRequest.priority : stat / asap / routine).
 */
export const DELAI_CIBLE_MINUTES: Record<UrgenceAvis, number> = {
  [UrgenceAvis.TRES_URGENT]: 60, // 1 h
  [UrgenceAvis.URGENT]: 240, // 4 h
  [UrgenceAvis.NORMAL]: 2880, // 48 h
};

/** Poids de tri : le plus urgent d'abord dans la file du consultant. */
export const URGENCE_POIDS: Record<UrgenceAvis, number> = {
  [UrgenceAvis.TRES_URGENT]: 0,
  [UrgenceAvis.URGENT]: 1,
  [UrgenceAvis.NORMAL]: 2,
};

/** Libelle lisible du degre d'urgence, utilise dans les notifications. */
export const LIBELLE_URGENCE: Record<UrgenceAvis, string> = {
  [UrgenceAvis.TRES_URGENT]: 'tres urgent',
  [UrgenceAvis.URGENT]: 'urgent',
  [UrgenceAvis.NORMAL]: 'normal',
};

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
  @Column({ type: 'varchar', length: 40, default: UrgenceAvis.NORMAL })
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

  // ---------------------------------------------------------------------------
  // Horodatage du cycle de vie : chaque etape est datee, ce qui rend le
  // parcours de la demande auditable (qui a recu, qui a repris, quand la
  // reponse est partie, quand le demandeur l'a lue).
  // ---------------------------------------------------------------------------

  /** Echeance de reponse attendue, derivee de l'urgence a la creation. */
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateEcheanceReponse?: Date | null;

  /** Accuse de reception du consultant (passage a CONSULTEE). */
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateConsultation?: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  datePriseEnCharge?: Date | null;

  /** Date d'envoi du compte-rendu (ou du refus) au demandeur. */
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateReponse?: Date | null;

  /** Date a laquelle le service demandeur a lu le compte-rendu. */
  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateLectureReponse?: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dateCloture?: Date | null;

  /** Delai effectif entre la demande et la reponse, en minutes (indicateur). */
  @Field(() => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  delaiReponseMinutes?: number | null;

  /** Praticien consultant qui a redige le compte-rendu. */
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  repondeurId?: string | null;

  /** Praticien du service demandeur qui a lu le compte-rendu. */
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  reponseLuePar?: string | null;

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
