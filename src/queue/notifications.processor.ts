import { Logger } from '@nestjs/common';
import { Processor, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Worker } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';

@Processor('notificacao')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<{ orderId: string; customerId: string }>): Promise<void> {
    const { orderId, customerId } = job.data;
    this.logger.log(`Enviando e-mail de confirmação para pedido ${orderId} (cliente ${customerId})`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}
