import { PET_TYPES, PET_REPRODUCTION_TYPES } from '../pets.constants';

export interface Pet {
  //  ID
  id: number;
  // Кличка
  name: string;
  // Возраст
  age: number;
  // Тип
  type: PET_TYPES;
  // Кастр/Стер
  reproduction: PET_REPRODUCTION_TYPES;
  // Особые отметки
  special?: string;
  // Комментарии
  comments?: string;
  // Id клиента
  clientId?: number;
}
