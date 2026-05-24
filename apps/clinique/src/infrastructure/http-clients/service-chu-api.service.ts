import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { chuEndpoint } from '../../config/chu-api.config';
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

  private chuUrl(chuId: string): string {
    return chuEndpoint(`/chu/${encodeURIComponent(chuId)}`);
  }

  private serviceByIdUrl(serviceId: string): string {
    return chuEndpoint(`/service/${encodeURIComponent(serviceId)}`);
  }

  async ensureChuExists(chuId: string): Promise<void> {
    const cached = this.chuCache.get(chuId);
    if (cached && cached.expiresAt > Date.now()) {
      return;
    }

    const url = this.chuUrl(chuId);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (response.status === 404) {
        throw new NotFoundException(`CHU introuvable dans le service externe (identifiant : ${chuId}).`);
      }
      if (!response.ok) {
        throw new ServiceUnavailableException(
          `Le service externe a repondu avec le statut ${response.status}. Validation du CHU impossible.`,
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
        headers: { Accept: 'application/json' },
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
      const info: ServiceChuInfo = {
        serviceId: body.serviceId,
        name: body.name,
        chuId: body.chuId,
      };

      this.serviceCache.set(serviceId, {
        value: info,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      // Also warm up the CHU cache since we know this CHU exists
      this.chuCache.set(info.chuId, {
        value: true,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

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
