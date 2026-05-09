import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpaEntity } from './cpa.entity';
import { CpaService } from './cpa.service';
import { CpaController } from './cpa.controller';
import { CpaResolver } from './cpa.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CpaEntity])],
  providers: [CpaService, CpaResolver],
  controllers: [CpaController],
  exports: [CpaService],
})
export class CpaModule {}
