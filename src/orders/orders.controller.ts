import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { CreateOrderResult } from './interfaces/order.interface';
import { errorHandler } from '../utils/errorHandler';

@Controller('/api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createOrderDTO: CreateOrderDTO): Promise<{ order: CreateOrderResult | null }> {
    try {
      return {
        order: await this.ordersService.create(createOrderDTO),
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
