import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { S3Module } from '../s3/s3.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), S3Module, QueueModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
