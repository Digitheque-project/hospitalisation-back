import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateChambreDto {
  @ApiProperty({
    example: '75f995a2-40e9-4285-84e4-a72501d37bfd',
    description: 'Identifiant du service rattache a la chambre',
  })
  @IsUUID()
  serviceId: string;

  @ApiProperty({
    example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394',
    description: 'Identifiant CHU auquel appartient la chambre',
  })
  @IsUUID()
  chuId: string;

  @ApiProperty({ example: 101, description: 'Numero de chambre (>= 1)' })
  @IsInt()
  @Min(1)
  numeroChambre: number;

  @ApiProperty({ example: 'Standard', description: 'Type de chambre' })
  @IsString()
  type: string;
}

export class UpdateChambreDto {
  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Identifiant CHU' })
  @IsUUID()
  chuId: string;

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
  @ApiProperty({ example: '75f995a2-40e9-4285-84e4-a72501d37bfd', description: 'Filtre obligatoire par service' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '1e5bbbb7-fa10-4d59-8848-2d0ce96a9394', description: 'Filtre obligatoire par CHU' })
  @IsUUID()
  chuId: string;
}
