import { USER_ROLES } from '../users.constants';
import { Pet } from '../../pets/interfaces/pets.interfaces';

export interface User {
  id?: number;
  login: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  avatar?: string;
  roles: USER_ROLES[];
  password?: string;
  isConfirm: boolean;
  isActive: boolean;
  pets?: Pet[];
}

export interface Client {
  id?: number;
  login: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  avatar?: string;
  pets?: Pet[];
}

export interface Admin {
  id?: number;
  login: string;
  avatar?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
}
