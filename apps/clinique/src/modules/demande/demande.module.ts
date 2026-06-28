import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeController } from './demande.controller';
import { DemandeEntity } from '../../domain/entities/demande.entity';
import { DemandeResolver } from './demande.resolver';
import { DemandeService } from './demande.service';

@Module({
  imports: [TypeOrmModule.forFeature([DemandeEntity])],
  controllers: [DemandeController],
  providers: [DemandeService, DemandeResolver],
  exports: [DemandeService],
})
export class DemandeModule {}
