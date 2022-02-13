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

  /**
   * Поиск пользователя по логину
   * @param {string} login - логин
   */
  async findByLogin(login: string): Promise<User | undefined> {
    return this.clientsRepository.findOne({ login });
  }

  /**
   * Поиск пользователя по id
   * @param {number} id - логин
   */
  async findById(id: number): Promise<User | undefined> {
    return this.clientsRepository.findOne(id);
  }
}
