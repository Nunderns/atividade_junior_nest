import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

  async create(dto: CreateCustomerDto) {
    const created = new this.customerModel(dto);
    return created.save();
  }

  async findAll() {
    return this.customerModel.find().exec();
  }

  async findOne(id: string) {
    const found = await this.customerModel.findById(id).exec();
    if (!found) throw new NotFoundException('Customer not found');
    return found;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const updated = await this.customerModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Customer not found');
    return updated;
  }

  async remove(id: string) {
    const removed = await this.customerModel.findByIdAndDelete(id).exec();
    if (!removed) throw new NotFoundException('Customer not found');
    return removed;
  }
}
