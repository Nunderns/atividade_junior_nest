import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class Item {
  @ApiProperty({ example: 'Notebook Dell' })
  @Prop({ required: true })
  product: string;

  @ApiProperty({ example: 2 })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({ example: 1500.50 })
  @Prop({ required: true })
  unitPriceUSD: number;
}

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Order extends Document {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ type: [Item], example: [{ product: 'Notebook Dell', quantity: 2, unitPriceUSD: 1500.50 }] })
  @Prop({ type: [{ product: String, quantity: Number, unitPriceUSD: Number }], required: true })
  items: Item[];

  @ApiProperty({ example: 3001.00 })
  @Prop({ type: Number, default: 0 })
  totalUSD: number;

  @ApiProperty({ example: 15005.00 })
  @Prop({ type: Number, default: 0 })
  totalBRL: number;

  @ApiProperty({ required: false, example: 'https://s3.amazonaws.com/bucket/comprovantes/123456789-recibo.pdf' })
  @Prop({ type: String, default: null })
  receiptUrl: string | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
