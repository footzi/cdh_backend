import { Pet } from '../../pets/interfaces/pets.interfaces';

export class CreateOrderDTO {
  startDate: string;
  endDate: string;
  firstName: string;
  lastName: string;
  comment: string;
  email: string;
  phone: string;
  roomTypeId: number;
  clientId?: number;
  pets?: Pet[];
}
