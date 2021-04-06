import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entitites/order.entity';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), ClientsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
