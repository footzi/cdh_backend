import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoomType } from '../interfaces/room-type.interface';

@Entity()
export class RoomTypeEntity implements RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('integer')
  price: number;
}
