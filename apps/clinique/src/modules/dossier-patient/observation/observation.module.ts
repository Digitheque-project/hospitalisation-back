import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationService } from './observation.service';
import { ObservationController } from './observation.controller';
import { Observation } from './entities/observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Observation])],
  controllers: [ObservationController],
  providers: [ObservationService],
  exports: [ObservationService],
})
export class ObservationModule {}
