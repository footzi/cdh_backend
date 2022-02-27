import { Controller, Post, Body, HttpCode, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { CreateOrderResult, Order } from './interfaces/order.interface';
import { errorHandler } from '../utils/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { USER_ROLES } from '../users/users.constants';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('/api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [USER_ROLES.ADMIN])
  @Get()
  @HttpCode(200)
  async getAll(): Promise<{ orders: Order[] }> {
    try {
      return {
        orders: await this.ordersService.getAllOrders(),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

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
