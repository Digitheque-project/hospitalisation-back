import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { StatutLit } from '../../domain/entities/lit.entity';

export class CreateLitItemDto {
  @ApiProperty({ example: 'A1', description: 'Code unique du lit' })
  @IsString()
  codeLit: string;

  @ApiProperty({ enum: StatutLit, required: false, example: StatutLit.DISPONIBLE })
  @IsOptional()
  @IsEnum(StatutLit)
  statut?: StatutLit;
}

export class CreateLitsDto {
  @ApiProperty({
    type: [CreateLitItemDto],
    description: 'Liste des lits a creer dans la chambre',
  })
  @IsArray()
  @ArrayMinSize(1)
  lits: CreateLitItemDto[];
}

export class UpdateLitDto {
  @ApiProperty({ example: 'B2', required: false })
  @IsOptional()
  @IsString()
  codeLit?: string;

  @ApiProperty({ enum: StatutLit, required: false, example: StatutLit.MAINTENANCE })
  @IsOptional()
  @IsEnum(StatutLit)
  statut?: StatutLit;
}

export class LitQueryDto {
  @ApiProperty({ required: false, description: 'Filtrer par chambre' })
  @IsOptional()
  @IsString()
  chambreId?: string;

  @ApiProperty({ required: false, description: 'Filtrer par service (via chambre)' })
  @IsOptional()
  @IsString()
  serviceId?: string;
}

export class PlanLitsQueryDto {
  @ApiProperty({ description: 'Service cible pour le plan de lits' })
  @IsString()
  serviceId: string;

  @ApiProperty({ enum: StatutLit, required: false })
  @IsOptional()
  @IsEnum(StatutLit)
  statutLit?: StatutLit;
}

export class PlanLitsResponseDto {
  @ApiProperty({ example: 'service-123' })
  serviceId: string;

  @ApiProperty({ type: () => [PlanLitsChambreDto] })
  chambres: PlanLitsChambreDto[];
}

export class PlanLitsChambreDto {
  @ApiProperty({ example: 'chambre-1' })
  chambreId: string;

  @ApiProperty({ example: 101 })
  numeroChambre: number;

  @ApiProperty({ example: 'Standard' })
  type: string;

  @ApiProperty({ type: () => [PlanLitsLitDto] })
  lits: PlanLitsLitDto[];
}

export class PlanLitsLitDto {
  @ApiProperty({ example: 'lit-1' })
  id: string;

  @ApiProperty({ example: 'A1' })
  codeLit: string;

  @ApiProperty({ enum: StatutLit, example: StatutLit.DISPONIBLE })
  statut: StatutLit;
}
