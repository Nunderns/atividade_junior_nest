import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Process, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notificacao')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  @Process('pedido-criado')
  async handleOrderCreated(job: Job<{ orderId: string; customerId: string }>) {
    const { orderId, customerId } = job.data;
    this.logger.log(`Enviando e-mail de confirmação para pedido ${orderId} (cliente ${customerId})`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}
