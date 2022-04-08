import { Controller, Get, HttpCode, UseGuards, SetMetadata, Request } from '@nestjs/common';
import { errorHandler } from '../utils/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { USER_ROLES } from '../users/users.constants';
import { CamerasService } from './cameras.service';
import { Camera } from './interfaces/cameras.interfaces';

@Controller('/api/cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [USER_ROLES.ADMIN])
  @Get()
  @HttpCode(200)
  async getAll(): Promise<{ cameras: Camera[] }> {
    try {
      return {
        cameras: await this.camerasService.getAll(),
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
