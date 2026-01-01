import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (redisUrl) {
          const parsed = new URL(redisUrl);
          return {
            connection: {
              host: parsed.hostname,
              port: Number(parsed.port || 6379),
            },
          };
        }
        return {
          connection: {
            host: config.get<string>('REDIS_HOST') || 'localhost',
            port: Number(config.get<string>('REDIS_PORT') || 6379),
          },
        };
      },
    }),
    BullModule.registerQueue({ name: 'notificacao' }),
  ],
  providers: [QueueService, NotificationsProcessor],
  exports: [QueueService],
})
export class QueueModule {}
