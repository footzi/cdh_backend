import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pets } from './entitites/pets.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pets])],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [TypeOrmModule],
})
export class PetsModule {}
