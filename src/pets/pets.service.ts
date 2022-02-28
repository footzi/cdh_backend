import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pets } from './entitites/pets.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { Pet } from './interfaces/pets.interfaces';
import { Client } from '../users/interfaces/users.interface';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pets)
    private petsRepository: Repository<Pets>
  ) {}

  /**
   * Создает нового питомца
   */
  async create(createPetDto: CreatePetDto, client?: Client): Promise<Pets | undefined> {
    if (client) {
      return this.petsRepository.save({ ...createPetDto, client });
    } else {
      return this.petsRepository.save(createPetDto);
    }
  }

  /**
   * Получение питомца по имени и клиенту
   *
   * @param name - имя питомца
   * @param client - клиент чей питомец
   */
  async getByName(name: string, client: Client): Promise<Pet | undefined> {
    return this.petsRepository.findOne({ name, client });
  }
}
