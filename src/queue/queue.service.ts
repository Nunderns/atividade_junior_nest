import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('notificacao') private readonly queue: Queue) {}

  async add(name: string, data: any, opts?: any) {
    return this.queue.add(name, data, opts);
  }

  async onModuleDestroy() {
    try {
      await this.queue?.close();
    } catch (err) {
      this.logger.error(`Failed to close queue: ${err}`);
    }
  }
}
