import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { CallbackModule } from './callback/callback.module';
import { Orders } from './orders/entitites/orders.entity';
import { Users } from './users/entities/users.entity';
import { Rooms } from './rooms/entities/rooms.entity';
import { RoomTypes } from './rooms/entities/room-types.entity';
import configuration from './config';
import { AuthModule } from './auth/auth.module';
import { Auths } from './auth/entitites/auth.entity';
import { Pets } from './pets/entitites/pets.entity';
import { PetsModule } from './pets/pets.module';
import { Cameras } from './cameras/entitites/cameras.entity';
import { CamerasModule } from './cameras/cameras.module';

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
        entities: [Orders, Users, Rooms, RoomTypes, Auths, Pets, Cameras],
      }),
      inject: [ConfigService],
    }),
    MailModule,
    OrdersModule,
    CallbackModule,
    AuthModule,
    PetsModule,
    CamerasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
