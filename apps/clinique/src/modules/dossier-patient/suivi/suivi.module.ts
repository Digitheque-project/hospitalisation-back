import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suivi } from './suivi.entity';
import { SuiviService } from './suivi.service';
import { SuiviController } from './suivi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Suivi])],
  providers: [SuiviService],
  controllers: [SuiviController],
  exports: [SuiviService],
})
export class SuiviModule {}
