import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order, CreateOrderResult } from './interfaces/order.interface';
import { Orders } from './entitites/orders.entity';
import { Client } from '../clients/interfaces/client.interface';
import { Clients } from '../clients/entities/clients.entity';
import { Rooms } from '../rooms/entities/rooms.entity';
import { Room } from '../rooms/interfaces/room.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>
  ) {}

  async create(createOrderDTO: CreateOrderDTO): Promise<CreateOrderResult | null> {
    const order = await this.saveOrder(createOrderDTO);

    console.log(order);

    if (!order) {
      return null;
    }

    const { startDate, endDate, price, countDays} = order;
    // const price =

    // await this.saveClient(createOrderDTO);

    return {
      orderId: order.id,
      startDate,
      endDate,
      price,
      countDays,
    };
  }

  private async saveOrder(createOrderDTO: CreateOrderDTO): Promise<Orders | null> {
    const { roomTypeId, startDate, endDate } = createOrderDTO;

    const allRooms = await this.roomsRepository.find({ relations: ['type'], where: { type: Number(roomTypeId) } });
    const orders = await this.ordersRepository.find({ relations: ['room', 'room.type'] });
    const ordersOnlyRoomType = orders.filter((order) => order.room.type.id === Number(roomTypeId));

    const freeRoom = allRooms.find((room) => {
      const ordersByRoomId = ordersOnlyRoomType.filter((order) => order.room.id === room.id);
      return ordersByRoomId.every(
        (order) =>
          !(
            dayjs(order.startDate).isBetween(startDate, endDate, null, '[]') ||
            dayjs(order.endDate).isBetween(startDate, endDate, null, '[]')
          )
      );
    });

    if (!freeRoom) {
      return null;
    }

    const countDays = dayjs(endDate).diff(startDate, 'days');
    const price = freeRoom.type.price * countDays;

    console.log(price);

    const order = {
      startDate: createOrderDTO.startDate,
      endDate: createOrderDTO.endDate,
      comment: createOrderDTO.comment,
      room: freeRoom,
      countDays,
      price,
      statusId: 2,
    };

    return this.ordersRepository.save(order);
  }

  private saveClient(createOrderDTO: CreateOrderDTO): Promise<Clients> {
    const client: Client = {
      firstName: createOrderDTO.firstName,
      lastName: createOrderDTO.lastName,
      email: createOrderDTO.email,
      phone: createOrderDTO.phone,
    };

    return this.clientsRepository.save(client);
  }
}
