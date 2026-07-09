import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'requiredRoles';

// Exige que le token porte AU MOINS un des roles listes (roleName).
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
