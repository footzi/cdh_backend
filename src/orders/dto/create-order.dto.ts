import { Pet } from '../../pets/interfaces/pets.interfaces';
import { Client } from '../../users/interfaces/users.interface';
import { Room } from '../../rooms/interfaces/room.interface';
import { Pets } from '../../pets/entitites/pets.entity';
import { Camera } from '../../cameras/interfaces/cameras.interfaces';
import { ORDER_STATUSES } from '../orders.constants';

export class CreatePublicOrderDTO {
  startDate: string;
  endDate: string;
  client?: Client;
  comment: string;
  roomTypeId: number;
}

export class CreateOrderDTO {
  startDate: string;
  endDate: string;
  client: Client;
  cameras: Camera[];
  comment: string;
  // roomTypeId: number;
  rooms: Room[];
}

export class UpdateOrderDTO extends CreateOrderDTO {
  id: number;
  status: ORDER_STATUSES;
  countDays: number;
  price: number;
  // price: number;
}
