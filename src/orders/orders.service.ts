import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly queueService: QueueService,
    private readonly config: ConfigService,
  ) {}

  private async getUsdBrlRate(): Promise<number> {
    try {
      const url = this.config.get<string>('EXCHANGE_RATE_API_URL') || 'https://economia.awesomeapi.com.br/json/last/USD-BRL';
      const res = await axios.get(url);
      const key = Object.keys(res.data)[0];
      const bid = Number(res.data[key].bid);
      return bid;
    } catch (err) {
      this.logger.warn('Failed to fetch exchange rate, defaulting to 1');
      return 1;
    }
  }

  private computeTotals(items: any[], rate: number) {
    const totalUSD = items.reduce((s, it) => s + it.unitPriceUSD * it.quantity, 0);
    const totalBRL = totalUSD * rate;
    return { totalUSD, totalBRL };
  }

  async create(dto: CreateOrderDto) {
    const rate = await this.getUsdBrlRate();
    const { totalUSD, totalBRL } = this.computeTotals(dto.items, rate);
    const created = new this.orderModel({
      customerId: dto.customerId,
      date: new Date(dto.date),
      items: dto.items,
      totalUSD,
      totalBRL,
      receiptUrl: dto.receiptUrl || null,
    });
    const saved = await created.save();

    // enqueue notification job
    await this.queueService.add('pedido-criado', { orderId: saved._id.toString(), customerId: dto.customerId });
    return saved;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const items = await this.orderModel.find().skip(skip).limit(limit).exec();
    return items;
  }

  async findOne(id: string) {
    const found = await this.orderModel.findById(id).exec();
    if (!found) throw new NotFoundException('Order not found');
    return found;
  }

  async update(id: string, dto: UpdateOrderDto) {
    if (dto.items) {
      const rate = await this.getUsdBrlRate();
      const totals = this.computeTotals(dto.items as any[], rate);
      Object.assign(dto, { totalUSD: totals.totalUSD, totalBRL: totals.totalBRL } as any);
    }
    const updated = await this.orderModel.findByIdAndUpdate(id, dto as any, { new: true }).exec();
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async remove(id: string) {
    const removed = await this.orderModel.findByIdAndDelete(id).exec();
    if (!removed) throw new NotFoundException('Order not found');
    return removed;
  }

  async setReceiptUrl(id: string, url: string) {
    const updated = await this.orderModel.findByIdAndUpdate(id, { receiptUrl: url }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }
}
