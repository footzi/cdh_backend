import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../interfaces/room.interface';

@Entity()
export class RoomEntity implements Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('integer')
  typeId: number;
}
