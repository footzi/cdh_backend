import { Injectable } from '@nestjs/common';
import { User } from './interfaces/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Equal, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Crypt } from '../utils/crypt';
import { USER_ROLES } from './users.constants';
import { UserUtils } from './user.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Поиск пользователя по логину
   * @param {string} login - логин
   */
  async findByLogin(login: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ login });
  }

  /**
   * Поиск пользователя по id
   * @param {number} id - логин
   */
  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }

  /**
   * Создание нового пользователя
   */
  async create(createUserDTO: CreateUserDto): Promise<User> {
    const findUser = await this.findByLogin(createUserDTO.login);

    /** todo Сделать проверку и на роли **/
    if (findUser) {
      throw new Error('Пользователь с данным логином уже существует');
    }

    const hashedPassword = await Crypt.hash(createUserDTO.password);

    const user = {
      ...createUserDTO,
      roles: JSON.parse(createUserDTO.roles),
      password: hashedPassword,
      isConfirm: true,
      isActive: true,
    };

    const newUser = await this.usersRepository.save(user);
    const { password, ...rest } = newUser;

    return rest;
  }

  /**
   * Получение списка всех клиентов
   *
   */
  async getAllClients() {
    const users = await this.usersRepository.find({
      where: {
        roles: Equal(`{${USER_ROLES.CLIENT}}`),
      },
      relations: ['pets'],
    });

    return users.map((user) => UserUtils.convertToClient(user));
  }
}
