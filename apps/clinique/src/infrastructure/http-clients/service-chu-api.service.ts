import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { chuEndpoint } from '../../config/chu-api.config';
import { buildInternalAuthHeader } from '../../common/internal-auth.util';
import { ServiceChuInfo } from './service-chu-info.type';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class ServiceChuApiService {
  private readonly logger = new Logger(ServiceChuApiService.name);
  private readonly chuCache = new Map<string, CacheEntry<boolean>>();
  private readonly serviceCache = new Map<string, CacheEntry<ServiceChuInfo>>();

  // service-service expose ses routes A LA RACINE (setGlobalPrefix est commente),
  // sur le controller @Controller('services'). Donc: GET /services et GET /services/:id
  private serviceByIdUrl(serviceId: string): string {
    return chuEndpoint(`/services/${encodeURIComponent(serviceId)}`);
  }

  private servicesUrl(): string {
    return chuEndpoint('/services');
  }

  // service-service protege TOUTES ses routes par un JwtAuthGuard global, qui
  // n'accepte qu'un JWT signe avec le JWT_SECRET partage (l'ancien en-tete
  // x-api-key n'y est pas reconnu : 401, donc validation du CHU impossible).
  private buildHeaders(): Record<string, string> {
    return { Accept: 'application/json', ...buildInternalAuthHeader() };
  }

  async ensureChuExists(chuId: string): Promise<void> {
    const cached = this.chuCache.get(chuId);
    if (cached && cached.expiresAt > Date.now()) {
      return;
    }

    // Aucun endpoint dedie "valider un CHU" cote service-service.
    // On valide donc en listant les services et en cherchant ce chuId.
    const url = this.servicesUrl();
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.buildHeaders(),
      });
      if (!response.ok) {
        throw new ServiceUnavailableException(
          `Le service externe a repondu avec le statut ${response.status}. Validation du CHU impossible.`,
        );
      }

      const body = await response.json();
      const services: Array<{ chuId?: string }> = Array.isArray(body) ? body : [];
      const exists = services.some((s) => s.chuId === chuId);
      if (!exists) {
        throw new NotFoundException(
          `CHU introuvable dans le service externe (identifiant : ${chuId}).`,
        );
      }

      this.chuCache.set(chuId, {
        value: true,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ServiceUnavailableException) {
        throw e;
      }
      this.logger.warn(`Service CHU API: indisponible pour ${chuId} (${url}) - ${String(e)}`);
      throw new ServiceUnavailableException('Impossible de joindre le service externe pour valider le CHU.');
    }
  }

  async getServiceById(serviceId: string): Promise<ServiceChuInfo> {
    const cached = this.serviceCache.get(serviceId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const url = this.serviceByIdUrl(serviceId);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.buildHeaders(),
      });
      if (response.status === 404) {
        throw new NotFoundException(
          `Service introuvable dans le service externe (identifiant : ${serviceId}).`,
        );
      }
      if (!response.ok) {
        throw new ServiceUnavailableException(
          `Le service externe a repondu avec le statut ${response.status}. Validation du service impossible.`,
        );
      }

      const body = await response.json();
      // service-service renvoie l'entite Service : { id, name, baseUrl, isActive, chuId }
      // -> le champ identifiant est "id" (et non "serviceId").
      const info: ServiceChuInfo = {
        serviceId: body.id,
        name: body.name,
        chuId: body.chuId,
      };

      this.serviceCache.set(serviceId, {
        value: info,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      // On sait que ce CHU existe : on rechauffe le cache CHU.
      if (info.chuId) {
        this.chuCache.set(info.chuId, {
          value: true,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
      }

      return info;
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ServiceUnavailableException) {
        throw e;
      }
      this.logger.warn(`Service CHU API: indisponible pour service ${serviceId} (${url}) - ${String(e)}`);
      throw new ServiceUnavailableException('Impossible de joindre le service externe pour valider le service.');
    }
  }
}