import { Injectable, Logger } from '@nestjs/common';
import {
  DOSSIER_PATIENT_API_BASE_URL,
  dossierPatientEndpoint,
} from '../../config/dossier-patient-api.config';
import { buildInternalAuthHeader } from '../../common/internal-auth.util';
​
export interface ArchiveDiagnosticsInput {
  chuId: string;
  serviceId: string;
  patientId: string;
  episodeId?: string;
}
​
/**
 * Client HTTP vers le service Dossier Patient.
 *
 * L'archivage est « best-effort » : toute erreur est journalisée mais ne fait
 * jamais échouer la clôture de l'épisode d'hospitalisation.
 */
@Injectable()
export class DossierPatientApiService {
  private readonly logger = new Logger(DossierPatientApiService.name);
​
  async archivePatientDiagnostics(input: ArchiveDiagnosticsInput): Promise<void> {
    if (!DOSSIER_PATIENT_API_BASE_URL) {
      this.logger.warn(
        'GATEWAY_URL non configurée : archivage des diagnostics ignoré.',
      );
      return;
    }
​
    const url = dossierPatientEndpoint('/diagnostics/archive');
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // La gateway exige un Bearer token sur /dossier-patient (requiresAuth:
        // true du registre) meme pour cet appel serveur-a-serveur.
        ...buildInternalAuthHeader(),
      };
      // Authentification service-a-service (verifiee par le guard du dossier-patient).
      if (process.env.INTERNAL_API_KEY) {
        headers['x-internal-api-key'] = process.env.INTERNAL_API_KEY;
      }
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        this.logger.warn(
          `Archivage diagnostics: le service Dossier Patient a répondu ${response.status} (patient ${input.patientId}).`,
        );
      }
    } catch (e) {
      this.logger.warn(
        `Archivage diagnostics indisponible pour le patient ${input.patientId} (${url}) - ${String(e)}`,
      );
    }
  }
}
​