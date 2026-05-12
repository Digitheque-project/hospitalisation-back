import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { accueilEndpoint } from '../../config/accueil-api.config';
import { PatientInformationsAccueil } from '../patient/patient-informations-accueil.type';

function pickStr(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim().length > 0) {
      return v.trim();
    }
  }
  return undefined;
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
  return {
    id: id ?? undefined,
    nom,
    prenom,
    dateNaissance,
    sexe,
  };
}

@Injectable()
export class AccueilPatientApiService {
  private readonly logger = new Logger(AccueilPatientApiService.name);

  private patientUrl(patientId: string): string {
    return accueilEndpoint(`/patients/${encodeURIComponent(patientId)}`);
  }

  private async fetchPatient(patientId: string): Promise<Response> {
    return fetch(this.patientUrl(patientId), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * Vérifie que le patient existe côté accueil (GET /patients/{patientId} → 2xx).
   * Utilisé avant la création d’hospitalisation.
   */
  async ensurePatientExistsAtAccueil(patientId: string): Promise<void> {
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
          `Le service accueil a répondu avec le statut ${response.status}. Validation du patient impossible.`,
        );
      }
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ServiceUnavailableException) {
        throw e;
      }
      this.logger.warn(`Accueil patient API: indisponible pour ${patientId} (${url}) — ${String(e)}`);
      throw new ServiceUnavailableException(
        'Impossible de joindre le service accueil pour valider le patient.',
      );
    }
  }

  /**
   * GET {API_BASE_URL}/patients/{patientId}
   */
  async getPatientById(patientId: string): Promise<PatientInformationsAccueil | null> {
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
      return mapAccueilPatientPayload(body);
    } catch (err) {
      this.logger.warn(`Accueil patient API: échec pour ${patientId} — ${String(err)}`);
      return null;
    }
  }
}
