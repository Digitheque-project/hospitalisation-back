import { ForbiddenException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';

// Resout le chuId directement depuis le token (aucun appel reseau).
// Le CHU est porte par chaque service du payload JWT signe par auth-service :
// tout ce dont ce back a besoin est deja dans le token verifie.
export function resolveChuIdFromToken(
  user: JwtPayload | undefined,
  serviceId: string,
): string {
  const service = (user?.services ?? []).find(
    (svc) => svc.serviceId === serviceId,
  );
  const chuId = service?.chu?.id;
  if (!chuId) {
    throw new ForbiddenException(
      `Aucun CHU associe au service ${serviceId} dans le token.`,
    );
  }
  return chuId;
}
