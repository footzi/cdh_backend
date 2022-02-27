import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pets } from './entitites/pets.entity';
import { CreatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pets)
    private petsRepository: Repository<Pets>
  ) {}

  /**
   * Создает нового питомца
   */
  async create(createPetDto: CreatePetDto): Promise<Pets | undefined> {
    return this.petsRepository.save(createPetDto);
  }
}
