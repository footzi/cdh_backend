import { PET_REPRODUCTION_TYPES, PET_TYPES } from '../pets.constants';

export interface CreatePetDto {
  name: string;
  age: number;
  type: PET_TYPES;
  reproduction: PET_REPRODUCTION_TYPES;
  special?: string;
  comments?: string;
}
