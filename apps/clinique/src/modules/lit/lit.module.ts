import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity } from '../../domain/entities/lit.entity';
import { LitController } from './lit.controller';
import { LitService } from './lit.service';
import { ServiceChuApiModule } from '../../infrastructure/http-clients/service-chu-api.module';
import { AccueilApiModule } from '../../infrastructure/http-clients/accueil-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LitEntity, ChambreEntity, HospitalisationEpisodeEntity]),
    ServiceChuApiModule,
    AccueilApiModule,
  ],
  controllers: [LitController],
  providers: [LitService],
  exports: [LitService],
})
export class LitModule {}
