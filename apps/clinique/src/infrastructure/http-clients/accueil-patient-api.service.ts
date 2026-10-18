import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { accueilEndpoint } from '../../config/accueil-api.config';
import { PatientInformationsAccueil } from './patient-informations-accueil.type';
import { buildInternalAuthHeader } from '../../common/internal-auth.util';

function pickStr(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const v = obj[key];
      if (typeof v === 'string' && v.trim().length > 0) {
        return v.trim();
      }
    }
  }
  return undefined;
}

function mergePatientPayload(raw: Record<string, unknown>, fallbackId: string): Record<string, unknown> {
  const nom = pickStr(raw, 'nom', 'lastName', 'lastname', 'familyName', 'name');
  const prenom = pickStr(raw, 'prenom', 'firstName', 'firstname', 'givenName');
  const id = pickStr(raw, 'id', 'patientId', 'uuid') ?? fallbackId;
  const dateNaissance = pickStr(raw, 'dateNaissance', 'birthDate', 'birthdate');
  const sexe = pickStr(raw, 'sexe', 'gender', 'sex');

  return {
    ...raw,
    id,
    nom,
    prenom,
    dateNaissance,
    sexe,
  };
}

function mapAccueilPatientPayload(raw: unknown): PatientInformationsAccueil | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const nom = pickStr(o, 'nom', 'lastName', 'lastname', 'familyName', 'name');
  const prenom = pickStr(o, 'prenom', 'firstName', 'firstname', 'givenName');
  const id = pickStr(o, 'id', 'patientId', 'uuid');
  const dateNaissance = pickStr(o, 'dateNaissance', 'birthDate', 'birthdate');
  const sexe = pickStr(o, 'sexe', 'gender', 'sex');

  const cin = pickStr(o, 'cin', 'idCard');
  const profession = pickStr(o, 'profession', 'job');
  const adresse = pickStr(o, 'adresse', 'address');
  const telephone = pickStr(o, 'telephone', 'phone', 'phoneNumber');
  const contactUrgence = pickStr(o, 'contactUrgence', 'emergencyContact');
  const createdBy = pickStr(o, 'createdBy', 'author');

  let priseEnChargeId: number | undefined;
  if (typeof o.priseEnChargeId === 'number') {
    priseEnChargeId = o.priseEnChargeId;
  } else if (typeof o.priseEnChargeId === 'string') {
    const parsed = parseInt(o.priseEnChargeId, 10);
    if (!isNaN(parsed)) {
      priseEnChargeId = parsed;
    }
  }

  return {
    id: id ?? undefined,
    nom,
    prenom,
    dateNaissance,
    sexe,
    cin,
    profession,
    adresse,
    telephone,
    contactUrgence,
    priseEnChargeId,
    createdBy,
  };
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT_MS = 5_000;

@Injectable()
export class AccueilPatientApiService {
  private readonly logger = new Logger(AccueilPatientApiService.name);
  private readonly patientCache = new Map<string, CacheEntry<PatientInformationsAccueil | null>>();
  private readonly patientExistsCache = new Map<string, CacheEntry<boolean>>();

  private patientUrl(patientId: string): string {
    return accueilEndpoint(`/patients/${encodeURIComponent(patientId)}`);
  }

  private async fetchPatient(patientId: string): Promise<Response> {
    return fetch(this.patientUrl(patientId), {
      method: 'GET',
      // La gateway exige un Bearer token sur /accueil (requiresAuth: true du
      // registre) meme pour cet appel serveur-a-serveur sans utilisateur.
      headers: { Accept: 'application/json', ...buildInternalAuthHeader() },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  }

  /**
   * Verifie que le patient existe cote accueil (GET /patients/{patientId} -> 2xx).
   * Utilise avant la creation d'hospitalisation.
   */
  async ensurePatientExistsAtAccueil(patientId: string): Promise<void> {
    const cached = this.patientExistsCache.get(patientId);
    if (cached && cached.expiresAt > Date.now()) {
      return;
    }

    const url = this.patientUrl(patientId);
    try {
      const response = await this.fetchPatient(patientId);
      if (response.status === 404) {
        throw new NotFoundException(
          `Patient introuvable dans le service accueil (identifiant : ${patientId}).`,
        );
      }
      if (!response.ok) {
        throw new ServiceUnavailableException(
          `Le service accueil a repondu avec le statut ${response.status}. Validation du patient impossible.`,
        );
      }
      this.patientExistsCache.set(patientId, {
        value: true,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ServiceUnavailableException) {
        throw e;
      }
      this.logger.warn(`Accueil patient API: indisponible pour ${patientId} (${url}) - ${String(e)}`);
      throw new ServiceUnavailableException(
        'Impossible de joindre le service accueil pour valider le patient.',
      );
    }
  }

  /**
   * GET {API_BASE_URL}/patients/{patientId}
   */
  async getPatientById(patientId: string): Promise<PatientInformationsAccueil | null> {
    const cached = this.patientCache.get(patientId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const url = this.patientUrl(patientId);

    try {
      const response = await this.fetchPatient(patientId);

      if (response.status === 404) {
        this.patientCache.set(patientId, { value: null, expiresAt: Date.now() + CACHE_TTL_MS });
        return null;
      }

      if (!response.ok) {
        this.logger.warn(
          `Accueil patient API: statut ${response.status} pour ${patientId} (${url})`,
        );
        return null;
      }

      const body: unknown = await response.json();
      const mapped = mapAccueilPatientPayload(body);
      
      this.patientCache.set(patientId, { value: mapped, expiresAt: Date.now() + CACHE_TTL_MS });
      if (mapped) {
        this.patientExistsCache.set(patientId, { value: true, expiresAt: Date.now() + CACHE_TTL_MS });
      }
      
      return mapped;
    } catch (err) {
      this.logger.warn(`Accueil patient API: echec pour ${patientId} - ${String(err)}`);
      return null;
    }
  }

  /**
   * GET {API_BASE_URL}/patients/{patientId} - retourne toutes les informations disponibles.
   */
  async getPatientFullById(patientId: string): Promise<Record<string, unknown> | null> {
    const url = this.patientUrl(patientId);

    try {
      const response = await this.fetchPatient(patientId);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        this.logger.warn(
          `Accueil patient API: statut ${response.status} pour ${patientId} (${url})`,
        );
        return null;
      }

      const body: unknown = await response.json();
      if (!body || typeof body !== 'object') {
        return null;
      }

      return mergePatientPayload(body as Record<string, unknown>, patientId);
    } catch (err) {
      this.logger.warn(`Accueil patient API: echec pour ${patientId} - ${String(err)}`);
      return null;
    }
  }
}
