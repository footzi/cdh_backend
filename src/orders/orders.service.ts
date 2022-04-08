import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { CreateOrderDTO, CreatePublicOrderDTO, UpdateOrderDTO } from './dto/create-order.dto';
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
import { RoomsService } from '../rooms/rooms.service';
import { getCountDays } from '../utils/getCountDays';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Rooms>,
    private mailService: MailService,
    private roomsService: RoomsService,
    private usersService: UsersService,
    private petsService: PetsService
  ) {}

  async create(createOrderDTO: CreatePublicOrderDTO): Promise<CreateOrderResult | null> {
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
      relations: ['client', 'client.pets', 'rooms', 'rooms.type', 'cameras'],
    });

    return orders.map((order) => ({
      ...order,
      client: UserUtils.convertToClient(order.client),
    }));
  }

  /**
   * Получение конкретного заказа
   */
  async getOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne(id, {
      relations: ['client', 'client.pets', 'rooms', 'rooms.type', 'cameras'],
    });

    return {
      ...order,
      client: UserUtils.convertToClient(order.client),
    };
  }

  createOrderValidation(createOrderDTO: CreateOrderDTO | CreatePublicOrderDTO) {
    const { startDate, endDate } = createOrderDTO;
    const isStartDateAfterEndData = dayjs(startDate).isAfter(endDate, 'day');

    if (isStartDateAfterEndData) {
      throw new HttpException('Дата отъезда меньше чем дата заезда', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async saveOrder(createOrderDTO: CreatePublicOrderDTO): Promise<Orders | null> {
    const { roomTypeId, startDate, endDate } = createOrderDTO;

    // выбираем все комнаты с данным типом комнаты
    const allRooms = await this.roomsRepository.find({ relations: ['type'], where: { type: Number(roomTypeId) } });

    // выбираем все существующие заказы и фильтруем по данному типу номера
    const orders = await this.ordersRepository.find({ relations: ['rooms', 'rooms.type'] });

    const ordersOnlyRoomType = orders.filter(
      (order) => order.rooms.length && order.rooms[0].type.id === Number(roomTypeId)
    );

    // ищем свободную комнату с условием чтобы дата существующего заказа не входила в принятый интервал
    const freeRoom = allRooms.find((room) => {
      const ordersByRoomId = ordersOnlyRoomType.filter((order) => order.rooms.length && order.rooms[0].id === room.id);
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
      rooms: [freeRoom],
      countDays,
      price,
      status: ORDER_STATUSES.BOOKED,
    };

    return this.ordersRepository.save(order);
  }

  // @todo вынести все в clientservice
  private async saveClient(createOrderDTO: CreatePublicOrderDTO): Promise<Users> {
    const savedClient = await this.usersRepository.findOne({ email: createOrderDTO.client.email });

    if (savedClient) {
      return savedClient;
    }

    const user: User = {
      login: createOrderDTO.client.phone,
      firstName: createOrderDTO.client.firstName,
      lastName: createOrderDTO.client.lastName,
      email: createOrderDTO.client.email,
      phone: createOrderDTO.client.phone,
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

  /**
   * Расширенное создание заказа - через админку
   */
  async createOrderByAdmin(createOrderDTO: CreateOrderDTO): Promise<Order | undefined> {
    this.createOrderValidation(createOrderDTO);

    const roomTypeId = createOrderDTO.rooms[0].type.id;
    const price = await this.getPrice(createOrderDTO.startDate, createOrderDTO.endDate, roomTypeId);
    const countDays = getCountDays(createOrderDTO.startDate, createOrderDTO.endDate);
    let client = null;
    const newPets = [];

    const savedClient = await this.usersService.findByLogin(createOrderDTO.client.login);

    if (!savedClient) {
      client = await this.usersService.createNewClient(createOrderDTO.client);
    } else {
      client = savedClient;
    }

    if (createOrderDTO.client.pets) {
      for (const pet of createOrderDTO.client.pets) {
        const savedPet = await this.petsService.getByName(pet.name, client);

        if (!savedPet) {
          const newPet = await this.petsService.create(pet, client);
          newPets.push(newPet);
        }
      }
    }

    client.pets = client.pets?.length ? [...client.pets, ...newPets] : [...newPets];

    const order = {
      startDate: createOrderDTO.startDate,
      endDate: createOrderDTO.endDate,
      comment: createOrderDTO.comment,
      rooms: createOrderDTO.rooms,
      cameras: createOrderDTO.cameras,
      countDays,
      price,
      status: ORDER_STATUSES.BOOKED,
      client,
    };

    const newOrder = await this.ordersRepository.save(order);

    return this.getOrderById(newOrder.id);
  }

  /**
   * Расчет стоимости заказа
   *
   * @param startDate - начальная дата
   * @param endDate - дата завершения
   * @param roomTypeId - id типа номера
   */
  async getPrice(startDate, endDate, roomTypeId): Promise<number> {
    const countDays = getCountDays(startDate, endDate);
    const room = await this.roomsService.getRoomTypeById(roomTypeId);

    if (!room) {
      throw new HttpException('Ошибка получения стоимости номера', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return room.price * countDays;
  }

  /**
   * Обновление заказа
   */
  async updateOrder(updateOrderDTO: UpdateOrderDTO): Promise<Order | undefined> {
    const oldOrder = await this.getOrderById(updateOrderDTO.id);
    const roomTypeId = updateOrderDTO.rooms[0].type.id;
    const newOrder: Order = { ...updateOrderDTO };

    if (oldOrder.startDate !== updateOrderDTO.startDate || oldOrder.endDate !== updateOrderDTO.endDate) {
      const price = await this.getPrice(updateOrderDTO.startDate, updateOrderDTO.endDate, roomTypeId);
      const countDays = getCountDays(updateOrderDTO.startDate, updateOrderDTO.endDate);

      newOrder.price = price;
      newOrder.countDays = countDays;
    }

    if (updateOrderDTO.client?.pets) {
      for (const pet of updateOrderDTO.client.pets) {
        if (pet.id) {
          await this.petsService.update(pet);
        } else {
          await this.petsService.create(pet, updateOrderDTO.client);
        }
      }
    }

    await this.ordersRepository.save(newOrder);

    return await this.getOrderById(updateOrderDTO.id);
  }
}
