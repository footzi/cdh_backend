import { Rooms } from '../../rooms/entities/rooms.entity';
import { ORDER_STATUSES } from '../orders.constants';

export interface Order {
  startDate: string;
  endDate: string;
  room: Rooms;
  comment?: string | null;
  price: number;
  countDays: number;
  status: ORDER_STATUSES;
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