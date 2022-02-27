import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/rooms.entity';
import { Repository } from 'typeorm';
import { Room } from './interfaces/room.interface';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Room>
  ) {}

  /**
   * Возвращает список всех номеров
   */
  async getAll(): Promise<Room[] | undefined> {
    return this.roomsRepository.find({
      relations: ['type'],
    });
  }
}
