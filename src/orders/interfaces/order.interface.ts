import { Rooms } from '../../rooms/entities/rooms.entity';

export interface Order {
  startDate: string;
  endDate: string;
  room: Rooms;
  comment?: string | null;
  price: number;
  countDays: number;
  statusId: number;
}

export interface CreateOrderResult {
  orderId: number;
  startDate: string;
  endDate: string;
  countDays: number;
  price: number;
}
