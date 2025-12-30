import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Order } from '../orders/schemas/order.schema';

@ApiTags('relatorios')
@Controller('relatorios')
export class ReportsController {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  @Get('top-clientes')
  async topClients(@Query('limit') limit = '10') {
    const l = Number(limit);
    const agg = await this.orderModel
      .aggregate([
        { $group: { _id: '$customerId', total: { $sum: '$totalBRL' } } },
        { $sort: { total: -1 } },
        { $limit: l },
      ])
      .exec();
    return agg;
  }
}
