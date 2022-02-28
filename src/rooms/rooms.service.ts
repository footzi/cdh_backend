import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/rooms.entity';
import { RoomTypes } from './entities/room-types.entity';
import { Repository } from 'typeorm';
import { Room } from './interfaces/room.interface';
import { RoomType } from './interfaces/room-type.interface';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private roomsRepository: Repository<Room>,
    @InjectRepository(RoomTypes)
    private roomTypesRepository: Repository<RoomTypes>
  ) {}

  /**
   * Возвращает список всех номеров
   */
  async getAll(): Promise<Room[] | undefined> {
    return this.roomsRepository.find({
      relations: ['type'],
    });
  }

  /**
   * Возвращает room type по id
   * @param {number} id - id room type
   */
  async getRoomTypeById(id: number): Promise<RoomType | undefined> {
    return this.roomTypesRepository.findOne(id);
  }
}
