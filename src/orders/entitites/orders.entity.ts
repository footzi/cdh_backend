import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Order } from '../interfaces/order.interface';
import { Rooms } from '../../rooms/entities/rooms.entity';

@Entity()
export class Orders implements Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @ManyToOne(() => Rooms)
  @JoinColumn()
  room: Rooms;

  @Column('integer')
  price: number;

  @Column('integer')
  countDays: number;

  @Column('varchar', { length: 500 })
  comment?: string | null;

  @Column('integer')
  statusId: number;
}
