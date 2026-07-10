import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
​
// Recupere l'utilisateur injecte par la strategie JWT.
// Compatible HTTP (REST) et GraphQL.
// Usage: maMethode(@CurrentUser() user: JwtPayload) {}
//        maMethode(@CurrentUser('userId') userId: string) {}
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): unknown => {
    let user: JwtPayload | undefined;
    if (ctx.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(ctx).getContext<{
        req?: { user?: JwtPayload };
      }>();
      user = gqlContext?.req?.user;
    } else {
      const request = ctx.switchToHttp().getRequest();
      user = request?.user as JwtPayload | undefined;
    }
    return data ? user?.[data] : user;
  },
);