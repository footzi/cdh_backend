import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders } from './entitites/orders.entity';
import { ClientsModule } from '../clients/clients.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Orders]), ClientsModule, RoomsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
