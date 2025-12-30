import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';

@ApiTags('pedidos')
@Controller('pedidos')
export class OrdersController {
  constructor(private readonly service: OrdersService, private readonly s3: S3Service) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/comprovante')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReceipt(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const result = await this.s3.uploadFile(file.buffer, file.originalname, file.mimetype);
    await this.service.setReceiptUrl(id, result.url);
    return { url: result.url };
  }
}
