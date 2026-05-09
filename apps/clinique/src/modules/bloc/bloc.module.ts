import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VpaModule } from '../vpa/vpa.module';
import { BlocOperatoireEntity } from './bloc.entity';
import { BlocService } from './bloc.service';
import { BlocController } from './bloc.controller';
import { BlocResolver } from './bloc.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BlocOperatoireEntity]), VpaModule],
  providers: [BlocService, BlocResolver],
  controllers: [BlocController],
  exports: [BlocService],
})
export class BlocModule {}
