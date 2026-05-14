import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultatParacliniqueController } from './resultat-paraclinique.controller';
import { ResultatParacliniqueService } from './resultat-paraclinique.service';
import { ResultatParaclinique } from './entities/resultat-paraclinique.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResultatParaclinique])],
  controllers: [ResultatParacliniqueController],
  providers: [ResultatParacliniqueService],
  exports: [ResultatParacliniqueService],
})
export class ResultatParacliniqueModule {}
