import { USER_ROLES } from '../users.constants';

export interface CreateUserDto {
  login: string;
  firstName: string;
  lastName: string;
  roles: string;
  email: string;
  phone: string;
  password: string;
}
