import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';
import { AppService } from './app.service';
import { Orders } from './orders/entitites/orders.entity';
import { Clients } from './clients/entities/clients.entity';
import { Rooms } from './rooms/entities/rooms.entity';
import { RoomTypes } from './rooms/entities/room-types.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Lipton321',
      database: 'cdh_dev',
      entities: [Orders, Clients, Rooms, RoomTypes],
      synchronize: true,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
