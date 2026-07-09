import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

// Importer AuthModule dans AppModule suffit a proteger TOUT le service :
//  1) JwtAuthGuard  -> authentification (token requis, sauf @Public / cle interne)
//  2) PermissionsGuard -> autorisation (verifie @Permissions()/@Roles())
// L'ordre des APP_GUARD est respecte : authentification puis autorisation.
@Module({
  imports: [ConfigModule, PassportModule],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AuthModule {}
