export interface MailToClientAfterOrderCreate {
  email: string;
  startDate: string;
  endDate: string;
  countDays: number;
  firstName: string;
  price: number;
}

export interface MailToAdminAfterOrderCreate {
  email: string;
  startDate: string;
  endDate: string;
  countDays: number;
  firstName: string;
  price: number;
  lastName: string | null;
  phone: string;
  comment?: string | null;
  roomName: string;
  roomType: string
}
