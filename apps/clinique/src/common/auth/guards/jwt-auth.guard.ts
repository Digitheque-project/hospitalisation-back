import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
​
// Authentification globale. Deux voies d'acces sans JWT :
//  - routes marquees @Public()
//  - appels service-a-service portant l'entete x-internal-api-key valide
//    (ex: hospitalisation -> dossier-patient/diagnostics/archive).
// Compatible REST (HTTP) et GraphQL.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }
​
  // Recupere la requete sous-jacente que l'on soit en REST ou GraphQL.
  private resolveRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext()?.req;
    }
    return context.switchToHttp().getRequest();
  }
​
  // Passport s'appuie sur getRequest() pour localiser la requete a authentifier.
  getRequest(context: ExecutionContext) {
    return this.resolveRequest(context);
  }
​
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
​
    const internalKey = this.configService.get<string>('INTERNAL_API_KEY');
    if (internalKey) {
      const request = this.resolveRequest(context);
      const provided = request?.headers?.['x-internal-api-key'];
      if (provided && provided === internalKey) {
        return true;
      }
    }
​
    return super.canActivate(context);
  }
}