// Structure reelle du token signe par auth-service (auth.service.login).
// Ne pas modifier auth-service : ce back se contente de verifier le token.
export interface JwtChuInfo {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  responsable?: string;
}

export interface JwtUserService {
  serviceId?: string;
  serviceName?: string;
  baseUrl?: string;
  roleId?: string;
  roleName?: string;
  permissions?: string[];
  chu?: JwtChuInfo;
}

export interface JwtPayload {
  userId: string;
  name?: string;
  firstname?: string;
  email?: string;
  services?: JwtUserService[];
  iat?: number;
  exp?: number;
}
