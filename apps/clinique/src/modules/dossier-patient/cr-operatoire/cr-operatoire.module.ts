import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrOperatoire } from './cr-operatoire.entity';
import { CrOperatoireService } from './cr-operatoire.service';
import { CrOperatoireController } from './cr-operatoire.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CrOperatoire])],
  providers: [CrOperatoireService],
  controllers: [CrOperatoireController],
})
export class CrOperatoireModule {}
