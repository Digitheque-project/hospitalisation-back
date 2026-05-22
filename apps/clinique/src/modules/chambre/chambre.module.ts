import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChambreEntity } from '../../domain/entities/chambre.entity';
import { LitEntity } from '../../domain/entities/lit.entity';
import { ChambreController } from './chambre.controller';
import { ChambreService } from './chambre.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChambreEntity, LitEntity])],
  controllers: [ChambreController],
  providers: [ChambreService],
  exports: [ChambreService],
})
export class ChambreModule {}
