import { Module } from '@nestjs/common';
import { SignatureController } from './signature.controller';

@Module({
  controllers: [SignatureController],
})
export class SignatureModule {}
