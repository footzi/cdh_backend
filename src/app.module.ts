import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';
import { AppService } from './app.service';
import { OrderEntity } from './orders/entitites/order.entity';
import { ClientEntity } from './clients/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Lipton321',
      database: 'cdh_dev',
      entities: [OrderEntity, ClientEntity],
      synchronize: true,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
