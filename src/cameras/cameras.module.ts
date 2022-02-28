import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamerasController } from './cameras.controller';
import { Cameras } from './entitites/cameras.entity';
import { CamerasService } from './cameras.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cameras])],
  controllers: [CamerasController],
  providers: [CamerasService],
  exports: [TypeOrmModule],
})
export class CamerasModule {}
