import { Controller, Get, Body, HttpCode, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { errorHandler } from '../utils/errorHandler';
import { User } from './interfaces/users.interface';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: number): Promise<{ user: User }> {
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
