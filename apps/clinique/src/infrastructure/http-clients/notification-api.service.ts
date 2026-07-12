import { Injectable, Logger } from '@nestjs/common';
import { notificationEndpoint } from './notification-api.config';

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

  async send(input: SendNotificationInput): Promise<void> {
    const url = notificationEndpoint('/notifications');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  async sendToService(input: SendServiceNotificationInput): Promise<void> {
    const url = notificationEndpoint('/notifications/service');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
