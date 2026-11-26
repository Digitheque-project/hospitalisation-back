import { Injectable, Logger, Optional } from '@nestjs/common';
import { AccueilPatientApiService } from './accueil-patient-api.service';
import { notificationEndpoint } from './notification-api.config';
import { buildInternalAuthHeader } from '../../common/internal-auth.util';

export interface SendNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: string;
  source?: string;
  data?: Record<string, unknown>;
}

export interface SendServiceNotificationInput {
  serviceId: string;
  title: string;
  message: string;
  type?: string;
  source?: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationApiService {
  private readonly logger = new Logger(NotificationApiService.name);

  constructor(@Optional() private readonly accueil?: AccueilPatientApiService) {}

  /**
   * Nom du patient à la place de son identifiant dans le message (« pour le
   * patient 11d4cb1c-… » → « pour Ultime Essai ») et dans les données
   * (26/11/2026). Accueil injoignable : message inchangé.
   */
  private async avecNomPatient<T extends { message: string; data?: Record<string, unknown> }>(input: T): Promise<T> {
    const patientId = typeof input.data?.patientId === 'string' ? (input.data.patientId as string) : '';
    if (!patientId || !this.accueil) return input;
    const p = await this.accueil.getPatientById(patientId).catch(() => null);
    const nom = [p?.prenom, p?.nom].filter(Boolean).join(' ').trim();
    if (!nom) return input;
    const message = input.message
      .split(`pour le patient ${patientId}`).join(`pour ${nom}`)
      .split(`le patient ${patientId}`).join(nom)
      .split(patientId).join(nom);
    return { ...input, message, data: { ...(input.data ?? {}), patientNom: p?.nom ?? null, patientPrenom: p?.prenom ?? null } };
  }

  async send(entree: SendNotificationInput): Promise<void> {
    const input = await this.avecNomPatient(entree);
    const url = notificationEndpoint('/notifications');
    try {
      const response = await fetch(url, {
        method: 'POST',
        // La gateway exige un Bearer token sur /notifications (requiresAuth:
        // true du registre) meme pour cet appel serveur-a-serveur.
        headers: { 'Content-Type': 'application/json', ...buildInternalAuthHeader() },
        body: JSON.stringify({
          userId: input.userId,
          title: input.title,
          message: input.message,
          type: input.type ?? 'info',
          source: input.source ?? 'hospitalisation-back',
          data: input.data ?? {},
        }),
      });
      if (!response.ok) {
        this.logger.warn(
          `Notification API responded ${response.status} for userId=${input.userId}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification to userId=${input.userId}: ${String(error)}`,
      );
    }
  }

  async sendToService(entree: SendServiceNotificationInput): Promise<void> {
    const input = await this.avecNomPatient(entree);
    const url = notificationEndpoint('/notifications/service');
    try {
      const response = await fetch(url, {
        method: 'POST',
        // La gateway exige un Bearer token sur /notifications (requiresAuth:
        // true du registre) meme pour cet appel serveur-a-serveur.
        headers: { 'Content-Type': 'application/json', ...buildInternalAuthHeader() },
        body: JSON.stringify({
          serviceId: input.serviceId,
          title: input.title,
          message: input.message,
          type: input.type ?? 'info',
          source: input.source ?? 'hospitalisation-back',
          data: input.data ?? {},
        }),
      });
      if (!response.ok) {
        this.logger.warn(
          `Notification API responded ${response.status} for serviceId=${input.serviceId}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification to serviceId=${input.serviceId}: ${String(error)}`,
      );
    }
  }
}
