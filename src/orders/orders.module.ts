import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders } from './entitites/orders.entity';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { MailModule } from '../mail/mail.module';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), UsersModule, RoomsModule, MailModule, PetsModule],
  controllers: [OrdersController],
  providers: [OrdersService, RoomsService, UsersService, PetsService],
})
export class OrdersModule {}
