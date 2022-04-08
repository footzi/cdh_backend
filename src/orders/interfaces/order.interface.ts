import { Room } from '../../rooms/interfaces/room.interface';
import { ORDER_STATUSES } from '../orders.constants';
import { Client } from '../../users/interfaces/users.interface';
import { Camera } from '../../cameras/interfaces/cameras.interfaces';

export interface Order {
  startDate: string;
  endDate: string;
  rooms: Room[];
  cameras: Camera[];
  comment?: string | null;
  price: number;
  countDays: number;
  status: ORDER_STATUSES;
  client?: Client;
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
