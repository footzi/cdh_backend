import { Controller, Get, HttpCode, UseGuards, SetMetadata, Param } from '@nestjs/common';
import { errorHandler } from '../utils/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { USER_ROLES } from '../users/users.constants';
import { Room } from './interfaces/room.interface';
import { RoomsService } from './rooms.service';

@Controller('/api/rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [USER_ROLES.ADMIN])
  @Get('getAll')
  @HttpCode(200)
  async getAll(): Promise<{ rooms: Room[] }> {
    try {
      return {
        rooms: await this.roomService.getAll(),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @SetMetadata('roles', [USER_ROLES.ADMIN]
  // @Get()
  // @HttpCode(200)
  // async getRoomTypeById() {
  //
  // }
}
