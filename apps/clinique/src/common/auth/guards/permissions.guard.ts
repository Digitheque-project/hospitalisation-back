import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { ROLES_KEY } from "../decorators/roles.decorator";
import {
  JwtPayload,
  JwtUserService,
} from "../interfaces/jwt-payload.interface";

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

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

    if (requiredPermissions.length === 0 && requiredRoles.length === 0) {
      return true;
    }

    const request = this.getRequest(context);
    const internalKey = this.configService.get<string>("INTERNAL_API_KEY");
    if (
      internalKey &&
      request?.headers?.["x-internal-api-key"] === internalKey
    ) {
      return true;
    }

    const user = request?.user as JwtPayload | undefined;
    const services = user?.services ?? [];
    const requestedServiceId = this.requestedServiceId(request);
    const activeService = this.activeService(services, requestedServiceId);
    const activePermissions = new Set(activeService?.permissions ?? []);
    const activeRole = activeService?.roleName?.toLowerCase();

    const missingPermissions = requiredPermissions.filter(
      (permission) => !activePermissions.has(permission),
    );
    const roleOk =
      requiredRoles.length === 0 ||
      requiredRoles.some((role) => role.toLowerCase() === activeRole);

    if (missingPermissions.length === 0 && roleOk) {
      return true;
    }

    const enforce =
      this.configService.get<string>("AUTHZ_ENFORCE", "false") === "true";
    const detail =
      `user=${user?.userId ?? "inconnu"} ` +
      `service=${requestedServiceId ?? activeService?.serviceId ?? "indetermine"} ` +
      `missingPermissions=[${missingPermissions.join(", ")}] ` +
      `roleOk=${String(roleOk)}`;

    if (enforce) {
      throw new ForbiddenException(
        `Acces refuse : autorisations insuffisantes (${detail})`,
      );
    }

    this.logger.warn(`[AUTHZ audit] laisser passer (mode audit) - ${detail}`);
    return true;
  }

  private getRequest(context: ExecutionContext): any {
    if (context.getType<string>() === "graphql") {
      return GqlExecutionContext.create(context).getContext()?.req;
    }
    return context.switchToHttp().getRequest();
  }

  private requestedServiceId(request: any): string | undefined {
    const variables = request?.body?.variables ?? {};
    const candidates = [
      request?.headers?.["x-service-id"],
      request?.query?.serviceId,
      request?.query?.serviceIdSource,
      request?.query?.serviceIdDest,
      request?.body?.serviceId,
      request?.body?.serviceIdSource,
      request?.body?.serviceIdDest,
      variables.serviceId,
      variables.serviceIdSource,
      variables.serviceIdDest,
      request?.params?.serviceId,
    ];

    return candidates.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );
  }

  private activeService(
    services: JwtUserService[],
    requestedServiceId?: string,
  ): JwtUserService | undefined {
    if (requestedServiceId) {
      return services.find(
        (service) => service.serviceId === requestedServiceId,
      );
    }
    return services.length === 1 ? services[0] : services[0];
  }
}
