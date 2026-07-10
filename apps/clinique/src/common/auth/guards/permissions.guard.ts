import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
​
// Autorisation basee sur les permissions/roles portes par le token.
//
// Mode par defaut = AUDIT (AUTHZ_ENFORCE != 'true') : on trace un warning en
// cas d'autorisation insuffisante mais on laisse passer. Cela permet un
// deploiement immediat, le temps d'aligner les noms de permissions avec ceux
// semes dans auth-service. Passez AUTHZ_ENFORCE=true pour bloquer (403).
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);
​
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
​
  // Recupere la requete sous-jacente que l'on soit en REST ou GraphQL.
  private resolveRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext()?.req;
    }
    return context.switchToHttp().getRequest();
  }
​
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
​
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
​
    if (requiredPermissions.length === 0 && requiredRoles.length === 0) {
      return true;
    }
​
    const request = this.resolveRequest(context);
​
    // Appel service-a-service : deja authentifie par JwtAuthGuard.
    const internalKey = this.configService.get<string>('INTERNAL_API_KEY');
    if (
      internalKey &&
      request?.headers?.['x-internal-api-key'] === internalKey
    ) {
      return true;
    }
​
    const user = request?.user as JwtPayload | undefined;
    const services = user?.services ?? [];
    const userPermissions = new Set<string>();
    const userRoles = new Set<string>();
    for (const svc of services) {
      (svc.permissions ?? []).forEach((p) => userPermissions.add(p));
      if (svc.roleName) {
        userRoles.add(svc.roleName);
      }
    }
​
    const missingPermissions = requiredPermissions.filter(
      (p) => !userPermissions.has(p),
    );
    const hasRole =
      requiredRoles.length === 0 ||
      requiredRoles.some((r) => userRoles.has(r));
    const authorized = missingPermissions.length === 0 && hasRole;
​
    const enforce =
      this.configService.get<string>('AUTHZ_ENFORCE', 'false') === 'true';
​
    if (!authorized) {
      const detail =
        'user=' +
        (user?.userId ?? 'inconnu') +
        ' missingPermissions=[' +
        missingPermissions.join(', ') +
        '] requiredRoles=[' +
        requiredRoles.join(', ') +
        ']';
      if (enforce) {
        throw new ForbiddenException(
          'Acces refuse : autorisations insuffisantes (' + detail + ')',
        );
      }
      this.logger.warn('[AUTHZ audit] laisse passer (mode audit) - ' + detail);
    }
​
    return true;
  }
}
​