import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypes } from './entities/room-types.entity';
import { Rooms } from './entities/rooms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, RoomTypes])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class RoomsModule {}
