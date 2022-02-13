import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders } from './entitites/orders.entity';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), UsersModule, RoomsModule, MailModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
