import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertObservationDto {
  @ApiProperty({
    description: 'Données structurées des sections 01 à 10',
    example: {
      "01_etat_civil": { "age": 64 },
      "02_motif_consultation": "Douleur thoracique",
    },
  })
  @IsObject()
  data: Record<string, any>;
}
