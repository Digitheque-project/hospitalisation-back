import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    const authorization = request?.headers?.authorization;
    const token = Array.isArray(authorization) ? authorization[0] : authorization;

    if (!token || !String(token).startsWith('Bearer ')) {
      throw new UnauthorizedException('Token JWT manquant ou invalide');
    }

    const userIdHeader = request.headers?.['x-user-id'];
    const roleHeader = request.headers?.['x-profile'];
    const orderNumberHeader = request.headers?.['x-order-number'];

    request.user = {
      id: Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader,
      role: Array.isArray(roleHeader) ? roleHeader[0] : roleHeader,
      orderNumber: Array.isArray(orderNumberHeader) ? orderNumberHeader[0] : orderNumberHeader,
    };

    return true;
  }

  private getRequest(context: ExecutionContext) {
    if (context.getType<string>() === 'http') {
      return context.switchToHttp().getRequest();
    }

    return GqlExecutionContext.create(context).getContext().req;
  }
}
