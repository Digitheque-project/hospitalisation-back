import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalisationModule } from '../hospitalisation/hospitalisation.module';
import { CpaEntity } from './cpa.entity';
import { CpaService } from './cpa.service';
import { CpaController } from './cpa.controller';
import { CpaResolver } from './cpa.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CpaEntity]), HospitalisationModule],
  providers: [CpaService, CpaResolver],
  controllers: [CpaController],
  exports: [CpaService],
})
export class CpaModule {}
