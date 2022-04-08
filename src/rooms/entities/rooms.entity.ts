import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../interfaces/room.interface';
import { RoomTypes } from './room-types.entity';

@Entity()
export class Rooms implements Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @ManyToOne(() => RoomTypes, (type) => type.id, { cascade: this })
  @JoinColumn()
  type: RoomTypes;
}
