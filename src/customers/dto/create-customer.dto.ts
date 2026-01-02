import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, example: 'Brasil' })
  @IsOptional()
  @IsString()
  country?: string;
}
