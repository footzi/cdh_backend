import { Controller, Get, Post, Body, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { CreateOrderResult } from './interfaces/order.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAll() {
    return 'getAll';
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createOrderDTO: CreateOrderDTO): Promise<{ order: CreateOrderResult | null }> {
    try {
      return {
        order: await this.ordersService.create(createOrderDTO),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
