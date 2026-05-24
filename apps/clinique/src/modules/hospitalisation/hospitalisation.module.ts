import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalisationController } from './hospitalisation.controller';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { HospitalisationEpisodeEntity } from '../../domain/entities/hospitalisation-episode.entity';
import { LitEntity } from '../../domain/entities/lit.entity';
import { HospitalisationResolver } from './hospitalisation.resolver';
import { HospitalisationService } from './hospitalisation.service';
import { AccueilApiModule } from '../../infrastructure/http-clients/accueil-api.module';
import { ServiceChuApiModule } from '../../infrastructure/http-clients/service-chu-api.module';
import { KafkaModule } from '../../infrastructure/kafka/kafka.module';

@Module({
  imports: [
    AccueilApiModule,
    ServiceChuApiModule,
    KafkaModule,
    TypeOrmModule.forFeature([HospitalisationEpisodeEntity, LitEntity, ChambreEntity]),
  ],
  controllers: [HospitalisationController],
  providers: [HospitalisationService, HospitalisationResolver],
  exports: [HospitalisationService],
})
export class HospitalisationModule {}
