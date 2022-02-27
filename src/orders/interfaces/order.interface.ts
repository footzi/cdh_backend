import { Rooms } from '../../rooms/entities/rooms.entity';
import { ORDER_STATUSES } from '../orders.constants';
import { Client } from '../../users/interfaces/users.interface';
import { Pet } from '../../pets/interfaces/pets.interfaces';

export interface Order {
  startDate: string;
  endDate: string;
  rooms: Rooms[];
  comment?: string | null;
  price: number;
  countDays: number;
  status: ORDER_STATUSES;
  client?: Client;
  pets?: Pet[];
}

export interface CreateOrderResult {
  id: number;
  startDate: string;
  endDate: string;
  countDays: number;
  price: number;
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string;
}
