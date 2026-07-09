import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Recupere l'utilisateur injecte par la strategie JWT.
// Usage: maMethode(@CurrentUser() user: JwtPayload) {}
//        maMethode(@CurrentUser('userId') userId: string) {}
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request?.user as JwtPayload | undefined;
    return data ? user?.[data] : user;
  },
);
