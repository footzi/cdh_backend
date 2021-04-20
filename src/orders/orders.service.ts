import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { CreateOrderDTO } from './dto/create-order.dto';
import { CreateOrderResult } from './interfaces/order.interface';
import { Orders } from './entitites/orders.entity';
import { Client } from '../clients/interfaces/client.interface';
import { Clients } from '../clients/entities/clients.entity';
import { Rooms } from '../rooms/entities/rooms.entity';
import { ORDER_STATUSES } from './orders.constants';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    private mailService: MailService
  ) {}

  async create(createOrderDTO: CreateOrderDTO): Promise<CreateOrderResult | null> {
    this.createOrderValidation(createOrderDTO);

    const order = await this.saveOrder(createOrderDTO);

    if (!order) {
      return null;
    }

    const client = await this.saveClient(createOrderDTO);

    const { startDate, endDate, price, countDays } = order;
    const { firstName, lastName, email, phone } = client;

    this.sendMailToClient(order, client);
    this.sendMailToAdmin(order, client);

    return {
      id: order.id,
      startDate,
      endDate,
      price,
      countDays,
      firstName,
      lastName,
      email,
      phone,
    };
  }

  createOrderValidation(createOrderDTO: CreateOrderDTO) {
    const { startDate, endDate } = createOrderDTO;
    const isStartDateAfterEndData = dayjs(startDate).isAfter(endDate, 'day');

    if (isStartDateAfterEndData) {
      throw new HttpException('Дата отъезда меньше чем дата заезда', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async saveOrder(createOrderDTO: CreateOrderDTO): Promise<Orders | null> {
    const { roomTypeId, startDate, endDate } = createOrderDTO;

    // выбираем все комнаты с данным типом команты
    const allRooms = await this.roomsRepository.find({ relations: ['type'], where: { type: Number(roomTypeId) } });

    // выбираем все существующие заказы и фильтруем по данному типу команты
    const orders = await this.ordersRepository.find({ relations: ['room', 'room.type'] });
    const ordersOnlyRoomType = orders.filter((order) => order.room.type.id === Number(roomTypeId));

    // ищем свободную команту с условием чтобы дата существующего заказа не входила в принятый интервал
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

    const order = {
      startDate: createOrderDTO.startDate,
      endDate: createOrderDTO.endDate,
      comment: createOrderDTO.comment,
      room: freeRoom,
      countDays,
      price,
      status: ORDER_STATUSES.BOOKED,
    };

    return this.ordersRepository.save(order);
  }

  private async saveClient(createOrderDTO: CreateOrderDTO): Promise<Clients> {
    const savedClient = await this.clientsRepository.findOne({ email: createOrderDTO.email });

    if (savedClient) {
      return savedClient;
    }

    const client: Client = {
      firstName: createOrderDTO.firstName,
      lastName: createOrderDTO.lastName,
      email: createOrderDTO.email,
      phone: createOrderDTO.phone,
    };

    return this.clientsRepository.save(client);
  }

  private sendMailToClient(order: Orders, client: Clients) {
    const data = {
      startDate: order.startDate,
      endDate: order.endDate,
      price: order.price,
      countDays: order.countDays,
      email: client.email,
      firstName: client.firstName,
    };

    this.mailService.sendClientAfterOrderCreate(data);
  }

  private sendMailToAdmin(order: Orders, client: Clients) {
    const data = {
      startDate: order.startDate,
      endDate: order.endDate,
      price: order.price,
      countDays: order.countDays,
      roomName: order.room.name,
      roomType: order.room.type.name,
      comment: order.comment,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
    };

    this.mailService.sendAdminOfterOrderCreate(data);
  }
}
