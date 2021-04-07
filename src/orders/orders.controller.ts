import { Controller, Get, Post, Body } from '@nestjs/common';
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
  create(@Body() createOrderDTO: CreateOrderDTO): Promise<CreateOrderResult | null> {
    return this.ordersService.create(createOrderDTO);
  }
}
