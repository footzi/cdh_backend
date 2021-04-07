import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RoomType } from '../interfaces/room-type.interface';
import { Rooms } from './rooms.entity';

@Entity()
export class RoomTypes implements RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('integer')
  price: number;
}
