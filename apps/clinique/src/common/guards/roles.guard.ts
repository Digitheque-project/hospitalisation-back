import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // TODO: Re-enable profile check for production
    // const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    //
    // if (!requiredRoles || requiredRoles.length === 0) {
    //   return true;
    // }
    //
    // const request = this.getRequest(context);
    // if (request?.method === 'GET') {
    //   return true;
    // }
    // const profileHeaderName = this.configService.get<string>(
    //   'SECURITY_PROFILE_HEADER',
    //   'x-profile',
    // );
    // const roleHeader = request?.headers?.[profileHeaderName];
    // const role = Array.isArray(roleHeader) ? roleHeader[0] : roleHeader;
    // const allowedProfiles = this.getAllowedProfiles();
    //
    // if (
    //   !role ||
    //   !requiredRoles.includes(String(role)) ||
    //   !allowedProfiles.includes(String(role))
    // ) {
    //   throw new ForbiddenException(
    //     `Profil requis: ${requiredRoles.join(', ')}. Utilisez l'en-tete ${profileHeaderName}.`,
    //   );
    // }

    return true;
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType<string>() === 'http') {
      return context.switchToHttp().getRequest();
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    return gqlContext.req;
  }

  private getAllowedProfiles(): string[] {
    const rawProfiles = this.configService.get<string>('SECURITY_ALLOWED_PROFILES', 'ONM,ONIM');
    return rawProfiles
      .split(',')
      .map((profile) => profile.trim())
      .filter((profile) => profile.length > 0);
  }
}
