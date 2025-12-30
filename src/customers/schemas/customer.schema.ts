import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  country: string;

  createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
