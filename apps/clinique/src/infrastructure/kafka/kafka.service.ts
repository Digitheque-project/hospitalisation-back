import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly brokers: string[];
  private readonly enabled: boolean;
  private readonly kafka?: Kafka;
  private producer: Producer | null = null;

  constructor() {
    const rawBrokers = process.env.KAFKA_BROKERS ?? '';
    this.brokers = rawBrokers
      .split(',')
      .map((broker) => broker.trim())
      .filter((broker) => broker.length > 0);
    this.enabled = this.brokers.length > 0;

    if (this.enabled) {
      const clientId = process.env.KAFKA_CLIENT_ID ?? 'hospitalisation-back';
      this.kafka = new Kafka({ clientId, brokers: this.brokers });
    }
  }

  private async getProducer(): Promise<Producer | null> {
    if (!this.enabled || !this.kafka) {
      return null;
    }
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
      this.logger.log(`Kafka connected (${this.brokers.join(', ')})`);
    }
    return this.producer;
  }

  async emit(topic: string, payload: Record<string, unknown>): Promise<void> {
    const producer = await this.getProducer();
    if (!producer) {
      this.logger.debug(`Kafka disabled, skip emit: ${topic}`);
      return;
    }
    try {
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(payload) }],
      });
    } catch (error) {
      this.logger.warn(`Kafka emit failed for ${topic}: ${String(error)}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }
}
