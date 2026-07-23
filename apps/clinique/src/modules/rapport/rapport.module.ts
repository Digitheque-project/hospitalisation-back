import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RapportController } from './rapport.controller';
import { RapportService } from './rapport.service';
import { RapportEntity } from '../../domain/entities/rapport.entity';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity } from '../../domain/entities/lit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RapportEntity,
      HospitalisationEpisodeEntity,
      LitEntity,
    ]),
  ],
  controllers: [RapportController],
  providers: [RapportService],
  exports: [RapportService],
})
export class RapportModule {}
