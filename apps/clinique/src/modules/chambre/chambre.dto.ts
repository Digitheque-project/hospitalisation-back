import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateChambreDto {
  @ApiProperty({
    example: 'service-123',
    description: 'Identifiant du service rattache a la chambre',
  })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: 101, description: 'Numero de chambre (>= 1)' })
  @IsInt()
  @Min(1)
  numeroChambre: number;

  @ApiProperty({ example: 'Standard', description: 'Type de chambre' })
  @IsString()
  type: string;
}

export class UpdateChambreDto {
  @ApiProperty({ example: 202, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  numeroChambre?: number;

  @ApiProperty({ example: 'Isolation', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}

export class ChambreQueryDto {
  @ApiProperty({ example: 'service-123', description: 'Filtre obligatoire par service' })
  @IsString()
  serviceId: string;
}
