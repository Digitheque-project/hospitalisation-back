import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sortie } from './sortie.entity';
import { SortieService } from './sortie.service';
import { SortieController } from './sortie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sortie])],
  providers: [SortieService],
  controllers: [SortieController],
})
export class SortieModule {}
