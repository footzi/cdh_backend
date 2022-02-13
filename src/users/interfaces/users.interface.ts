import { USER_ROLES } from '../users.constants';

export interface User {
  id?: number;
  login: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  role: USER_ROLES;
  password?: string;
  isConfirm: boolean;
  isActive: boolean;
}
