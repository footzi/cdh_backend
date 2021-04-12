import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { Orders } from './orders/entitites/orders.entity';
import { Clients } from './clients/entities/clients.entity';
import { Rooms } from './rooms/entities/rooms.entity';
import { RoomTypes } from './rooms/entities/room-types.entity';
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [Orders, Clients, Rooms, RoomTypes],
      }),
      inject: [ConfigService],
    }),
    MailModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
