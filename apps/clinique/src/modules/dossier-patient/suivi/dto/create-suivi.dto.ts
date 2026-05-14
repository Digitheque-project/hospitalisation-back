import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSuiviDto {
  @ApiPropertyOptional() @IsString() @IsOptional()
  jourHospitalisation?: string;

  @ApiPropertyOptional() @IsNumber() @IsOptional()
  temperature?: number;

  @ApiPropertyOptional() @IsString() @IsOptional()
  taSystolique?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  taDiastolique?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  frequenceCardiaque?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  frequenceRespiratoire?: string;

  @ApiPropertyOptional() @IsNumber() @IsOptional()
  evaDouleur?: number;

  @ApiPropertyOptional() @IsString() @IsOptional()
  etatGeneral?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  examenClinique?: string;

  @ApiPropertyOptional() @IsString() @IsOptional()
  evolution?: string;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  signesAlerte?: boolean;

  @ApiPropertyOptional() @IsString() @IsOptional()
  auteur?: string;
}
