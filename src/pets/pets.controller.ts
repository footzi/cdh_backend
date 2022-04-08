import { Controller, Get, HttpCode, UseGuards, SetMetadata, Post, Body } from '@nestjs/common';
import { errorHandler } from '../utils/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { USER_ROLES } from '../users/users.constants';
import { PetsService } from './pets.service';
import { Pet } from './interfaces/pets.interfaces';
import { CreatePetDto } from './dto/create-pet.dto';

@Controller('/api/pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [USER_ROLES.ADMIN])
  @Post()
  @HttpCode(201)
  async create(@Body() createPetDto: CreatePetDto): Promise<{ pet: Pet }> {
    try {
      return {
        pet: await this.petsService.create(createPetDto),
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
