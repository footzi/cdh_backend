import { Controller, Get, Body, HttpCode, Param } from '@nestjs/common';
import { errorHandler } from '../utils/errorHandler';
import { User } from './interfaces/users.interface';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<{ user: User }> {
    try {
      const user = await this.usersService.findById(id);

      if (user) {
        return {
          user,
        };
      } else {
        throw new Error('Пользователь не найден');
      }
    } catch (error) {
      errorHandler(error);
    }
  }
}
