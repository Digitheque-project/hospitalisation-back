import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatutRapport } from '../../domain/entities/rapport.entity';

/**
 * DTO d'ecriture d'un rapport (creation d'un brouillon puis auto-sauvegarde).
 * Le `content` est le document editable serialise (volets/tableaux/cellules).
 */
export class UpsertRapportDto {
  @ApiProperty()
  chuId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ example: 'rma-hebdomadaire' })
  templateId: string;

  @ApiProperty({ example: 'hebdomadaire' })
  periodType: string;

  @ApiPropertyOptional()
  periodLabel?: string;

  @ApiPropertyOptional({ example: '2026-06-08' })
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-06-14' })
  dateTo?: string;

  @ApiPropertyOptional({ default: false })
  includeGraphiques?: boolean;

  @ApiPropertyOptional({ description: 'Contenu editable serialise (JSON)' })
  content?: unknown;

  @ApiPropertyOptional()
  createdBy?: string;
}

/** Mise a jour partielle d'un brouillon existant (auto-save). */
export class UpdateRapportDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  periodLabel?: string;

  @ApiPropertyOptional()
  dateFrom?: string;

  @ApiPropertyOptional()
  dateTo?: string;

  @ApiPropertyOptional()
  includeGraphiques?: boolean;

  @ApiPropertyOptional()
  content?: unknown;

  @ApiPropertyOptional({ enum: StatutRapport })
  statut?: StatutRapport;
}

/** Filtres de la liste / historique. */
export class RapportListQuery {
  @ApiProperty()
  chuId: string;

  @ApiProperty()
  serviceId: string;

  @ApiPropertyOptional({ enum: StatutRapport })
  statut?: StatutRapport;
}

/** Parametres de l'agregation hebdomadaire (auto-remplissage VOLET ACTIVITES). */
export class RapportHebdoQuery {
  @ApiProperty()
  chuId: string;

  @ApiProperty()
  serviceIdDest: string;

  @ApiProperty({ example: '2026-06-08' })
  from: string;

  @ApiProperty({ example: '2026-06-14' })
  to: string;
}
