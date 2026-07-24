import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisController } from './avis.controller';
import { AvisEntity } from '../../domain/entities/avis.entity';
import { AvisResolver } from './avis.resolver';
import { AvisService } from './avis.service';
import { ServiceChuApiModule } from '../../infrastructure/http-clients/service-chu-api.module';
import { NotificationApiModule } from '../../infrastructure/http-clients/notification-api.module';

// NB : contrairement a DemandeModule, PAS d'import de HospitalisationModule :
// un avis ne cree jamais d'episode d'hospitalisation.
@Module({
  imports: [TypeOrmModule.forFeature([AvisEntity]), ServiceChuApiModule, NotificationApiModule],
  controllers: [AvisController],
  providers: [AvisService, AvisResolver],
  exports: [AvisService],
})
export class AvisModule {}
