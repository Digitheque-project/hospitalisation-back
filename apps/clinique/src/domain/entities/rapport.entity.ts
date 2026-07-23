import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Statut d'un rapport d'activite.
 *  - BROUILLON : rapport en cours d'edition (auto-sauvegarde). Purge apres
 *    RAPPORT_DRAFT_TTL_DAYS jours s'il n'est jamais finalise.
 *  - FINALISE  : rapport officiel, valeurs gelees (snapshot). Conserve.
 */
export enum StatutRapport {
  BROUILLON = 'BROUILLON',
  FINALISE = 'FINALISE',
}

/**
 * Rapport d'activite du service (RMA hebdomadaire / mensuel / annuel).
 *
 * Le contenu editable (volets, tableaux, cellules, fusions) est stocke tel quel
 * en JSONB dans `content`. Les valeurs auto-remplies sont figees au moment de
 * la finalisation afin de garantir la reproductibilite du document officiel,
 * meme si les donnees cliniques evoluent ensuite.
 *
 * Convention de nommage des colonnes : camelCase (identique au reste du
 * microservice). Les identifiants camelCase s'ecrivent entre guillemets
 * doubles en SQL.
 */
@Entity('rapport')
@Index('IDX_rapport_service', ['chuId', 'serviceId'])
export class RapportEntity {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;

  @Column({ type: 'uuid' })
  chuId: string;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'Service clinique concerne par le rapport' })
  serviceId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 80 })
  @ApiProperty({ description: 'Identifiant du gabarit (ex: rma-hebdomadaire)' })
  templateId: string;

  @Column({ type: 'varchar', length: 40 })
  @ApiProperty({ description: 'hebdomadaire | mensuel | annuel | personnalise' })
  periodType: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  periodLabel?: string | null;

  @Column({ type: 'date', nullable: true })
  dateFrom?: string | null;

  @Column({ type: 'date', nullable: true })
  dateTo?: string | null;

  @Column({ type: 'varchar', length: 20, default: StatutRapport.BROUILLON })
  statut: StatutRapport;

  @Column({ type: 'boolean', default: false })
  includeGraphiques: boolean;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({
    description:
      'Contenu editable du rapport (volets/tableaux/cellules/fusions) en JSON',
  })
  content?: unknown;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  finalizedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
