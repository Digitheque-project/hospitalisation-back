import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeController } from './demande.controller';
import { DemandeEntity } from '../../domain/entities/demande.entity';
import { DemandeResolver } from './demande.resolver';
import { DemandeService } from './demande.service';
import { ServiceChuApiModule } from '../../infrastructure/http-clients/service-chu-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([DemandeEntity]), ServiceChuApiModule],
  controllers: [DemandeController],
  providers: [DemandeService, DemandeResolver],
  exports: [DemandeService],
})
export class DemandeModule {}
