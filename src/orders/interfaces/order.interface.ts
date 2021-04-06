export interface Order {
  startDate: string;
  endDate: string;
  roomId: number;
  comment: string;
  statusId: number;
}

export interface CreateOrderResult {
  orderId: number;
  startDate: string;
  endDate: string;
  countDays: number;
  price: number;
}
