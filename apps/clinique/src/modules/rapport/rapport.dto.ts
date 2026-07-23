import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { StatutRapport } from '../../domain/entities/rapport.entity';

/**
 * DTO d'ecriture d'un rapport (creation d'un brouillon puis auto-sauvegarde).
 * Le `content` est le document editable serialise (volets/tableaux/cellules).
 *
 * NB : le ValidationPipe global utilise whitelist + forbidNonWhitelisted, donc
 * CHAQUE propriete doit porter au moins un decorateur class-validator, sinon
 * elle est rejetee ("property X should not exist").
 */
export class UpsertRapportDto {
  @ApiProperty()
  @IsString()
  @Length(1, 120)
  chuId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 120)
  serviceId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'rma-hebdomadaire' })
  @IsString()
  templateId: string;

  @ApiProperty({ example: 'hebdomadaire' })
  @IsString()
  periodType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  periodLabel?: string;

  @ApiPropertyOptional({ example: '2026-06-08' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-06-14' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  includeGraphiques?: boolean;

  @ApiPropertyOptional({ description: 'Contenu editable serialise (JSON)' })
  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdBy?: string;
}

/** Mise a jour partielle d'un brouillon existant (auto-save). */
export class UpdateRapportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  periodLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeGraphiques?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: StatutRapport })
  @IsOptional()
  @IsEnum(StatutRapport)
  statut?: StatutRapport;
}

/** Filtres de la liste / historique. */
export class RapportListQuery {
  @ApiProperty()
  @IsString()
  @Length(1, 120)
  chuId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 120)
  serviceId: string;

  @ApiPropertyOptional({ enum: StatutRapport })
  @IsOptional()
  @IsEnum(StatutRapport)
  statut?: StatutRapport;
}

/** Parametres de l'agregation hebdomadaire (auto-remplissage VOLET ACTIVITES). */
export class RapportHebdoQuery {
  @ApiProperty()
  @IsString()
  @Length(1, 120)
  chuId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 120)
  serviceIdDest: string;

  @ApiProperty({ example: '2026-06-08' })
  @IsDateString()
  from: string;

  @ApiProperty({ example: '2026-06-14' })
  @IsDateString()
  to: string;
}
