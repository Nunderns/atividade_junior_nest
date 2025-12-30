import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private queue: Queue;
  private worker: Worker;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('REDIS_URL') || 'redis://localhost:6379';
    const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
    this.queue = new Queue('notificacao', { connection: { host: connection.options?.host, port: connection.options?.port, maxRetriesPerRequest: null } });
    
    this.worker = new Worker(
      'notificacao',
      async (job: Job) => {
        try {
          if (job.name === 'pedido-criado') {
            const { orderId, customerId } = job.data;
            this.logger.log(`Enviando e-mail de confirmação para pedido ${orderId} (cliente ${customerId})`);
          } else {
            this.logger.log(`Processing job ${job.name}`);
          }
        } catch (err) {
          this.logger.error(`Error processing job ${job.id}: ${err}`);
          throw err;
        }
      },
      { connection: { host: connection.options?.host, port: connection.options?.port, maxRetriesPerRequest: null } },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err?.message}`);
    });
  }

  async add(name: string, data: any, opts?: any) {
    return this.queue.add(name, data, opts);
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.queue?.close();
  }
}
