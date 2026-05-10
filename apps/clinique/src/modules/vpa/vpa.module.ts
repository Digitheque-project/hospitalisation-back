import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpaModule } from '../cpa/cpa.module';
import { HospitalisationModule } from '../hospitalisation/hospitalisation.module';
import { VpaEntity } from './vpa.entity';
import { VpaService } from './vpa.service';
import { VpaController } from './vpa.controller';
import { VpaResolver } from './vpa.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([VpaEntity]), CpaModule, HospitalisationModule],
  providers: [VpaService, VpaResolver],
  controllers: [VpaController],
  exports: [VpaService],
})
export class VpaModule {}
