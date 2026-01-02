import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ItemDto {
  @ApiProperty({ example: 'Notebook Dell' })
  @IsNotEmpty()
  @IsString()
  product: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 1500.50 })
  @IsNotEmpty()
  @IsNumber()
  unitPriceUSD: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ type: [ItemDto], example: [{ product: 'Notebook Dell', quantity: 2, unitPriceUSD: 1500.50 }] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  receiptUrl?: string | null;
}
