import { Injectable } from '@nestjs/common';
import { User } from './interfaces/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private clientsRepository: Repository<User>
  ) {}

  async findById(id: string): Promise<User | undefined> {
    return this.clientsRepository.findOne(id);
  }
}
