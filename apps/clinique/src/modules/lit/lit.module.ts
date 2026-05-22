import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity } from '../../domain/entities/lit.entity';
import { LitController } from './lit.controller';
import { LitService } from './lit.service';

@Module({
  imports: [TypeOrmModule.forFeature([LitEntity, ChambreEntity, HospitalisationEpisodeEntity])],
  controllers: [LitController],
  providers: [LitService],
  exports: [LitService],
})
export class LitModule {}
