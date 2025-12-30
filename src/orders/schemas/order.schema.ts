import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Item {
  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPriceUSD: number;
}

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [{ product: String, quantity: Number, unitPriceUSD: Number }], required: true })
  items: Item[];

  @Prop({ type: Number, default: 0 })
  totalUSD: number;

  @Prop({ type: Number, default: 0 })
  totalBRL: number;

  @Prop({ type: String, default: null })
  receiptUrl: string | null;

  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
