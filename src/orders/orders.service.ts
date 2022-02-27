import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { CreateOrderDTO } from './dto/create-order.dto';
import { CreateOrderResult } from './interfaces/order.interface';
import { Orders } from './entitites/orders.entity';
import { Order } from './interfaces/order.interface';
import { User } from '../users/interfaces/users.interface';
import { Users } from '../users/entities/users.entity';
import { Rooms } from '../rooms/entities/rooms.entity';
import { ORDER_STATUSES } from './orders.constants';
import { MailService } from '../mail/mail.service';
import { formatToFrontendDate } from '../utils/formatToFrontendDate';
import { USER_ROLES } from '../users/users.constants';
import { UserUtils } from '../users/user.utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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

  /**
   * Получение списка всех заказов
   */
  async getAllOrders(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      relations: ['client', 'client.pets', 'rooms', 'rooms.type'],
    });

    return orders.map((order) => ({
      ...order,
      client: UserUtils.convertToClient(order.client),
    }));
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

    // выбираем все комнаты с данным типом комнаты
    const allRooms = await this.roomsRepository.find({ relations: ['type'], where: { type: Number(roomTypeId) } });

    // выбираем все существующие заказы и фильтруем по данному типу команты
    const orders = await this.ordersRepository.find({ relations: ['room', 'room.type'] });
    const ordersOnlyRoomType = orders.filter((order) => order.rooms[0].type.id === Number(roomTypeId));

    // ищем свободную комнату с условием чтобы дата существующего заказа не входила в принятый интервал
    const freeRoom = allRooms.find((room) => {
      const ordersByRoomId = ordersOnlyRoomType.filter((order) => order.rooms[0].id === room.id);
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

  // @todo вынести все в clientservice
  private async saveClient(createOrderDTO: CreateOrderDTO): Promise<Users> {
    const savedClient = await this.usersRepository.findOne({ email: createOrderDTO.email });

    if (savedClient) {
      return savedClient;
    }

    const user: User = {
      login: createOrderDTO.phone,
      firstName: createOrderDTO.firstName,
      lastName: createOrderDTO.lastName,
      email: createOrderDTO.email,
      phone: createOrderDTO.phone,
      isConfirm: false,
      isActive: true,
      roles: [USER_ROLES.CLIENT],
    };

    return this.usersRepository.save(user);
  }

  private sendMailToClient(order: Orders, user: Users) {
    const data = {
      startDate: formatToFrontendDate(order.startDate),
      endDate: formatToFrontendDate(order.endDate),
      orderId: order.id,
      price: order.price,
      countDays: order.countDays,
      comment: order.comment,
      email: user.email,
      firstName: user.firstName,
      phone: user.phone,
    };

    this.mailService.sendClientAfterOrderCreate(data);
  }

  private sendMailToAdmin(order: Orders, client: User) {
    const data = {
      startDate: formatToFrontendDate(order.startDate),
      endDate: formatToFrontendDate(order.endDate),
      orderId: order.id,
      price: order.price,
      countDays: order.countDays,
      roomName: order.rooms[0].name,
      roomType: order.rooms[0].type.name,
      comment: order.comment,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
    };

    this.mailService.sendAdminOfterOrderCreate(data);
  }
}
