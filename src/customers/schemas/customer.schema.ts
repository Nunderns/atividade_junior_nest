import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Customer extends Document {
  @ApiProperty({ example: 'João Silva' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ required: false, example: 'Brasil' })
  @Prop()
  country: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
