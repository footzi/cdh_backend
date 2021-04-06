import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs'
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order, CreateOrderResult } from './interfaces/order.interface';
import { OrderEntity } from './entitites/order.entity';
import { Client } from '../clients/interfaces/client.interface';
import { ClientEntity } from '../clients/entities/client.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>
  ) {}

  async create(createOrderDTO: CreateOrderDTO): Promise<CreateOrderResult> {
    const order = await this.saveOrder(createOrderDTO);
    const { startDate, endDate } = order;
    const price = 1000;
    const countDays = dayjs(endDate).diff(startDate, 'days');

    await this.saveClient(createOrderDTO);

    return {
      orderId: order.id,
      startDate,
      endDate,
      price,
      countDays,
    };
  }

  private saveOrder(createOrderDTO: CreateOrderDTO): Promise<OrderEntity> {
    const order: Order = {
      startDate: createOrderDTO.startDate,
      endDate: createOrderDTO.endDate,
      comment: createOrderDTO.comment,
      roomId: 1,
      statusId: 2,
    };

    return this.ordersRepository.save(order);
  }

  private saveClient(createOrderDTO: CreateOrderDTO): Promise<ClientEntity> {
    const client: Client = {
      firstName: createOrderDTO.firstName,
      lastName: createOrderDTO.lastName,
      email: createOrderDTO.email,
      phone: createOrderDTO.phone,
    };

    return this.clientsRepository.save(client);
  }
}
