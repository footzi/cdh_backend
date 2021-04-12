import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../interfaces/order.interface';
import { Rooms } from '../../rooms/entities/rooms.entity';
import { ORDER_STATUSES } from '../orders.constants';

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

  @Column('varchar', { length: 500, nullable: true })
  comment?: string | null;

  @Column({
    type: 'enum',
    enum: ORDER_STATUSES,
    default: ORDER_STATUSES.BOOKED,
  })
  status: ORDER_STATUSES;
}
