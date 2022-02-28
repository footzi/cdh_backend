import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cameras } from './entitites/cameras.entity';
import { Camera } from './interfaces/cameras.interfaces';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Cameras)
    private camerasRepository: Repository<Cameras>
  ) {}

  /**
   * Получение всех камер
   */
  async getAll(): Promise<Camera[]> {
    return await this.camerasRepository.find();
  }
}
