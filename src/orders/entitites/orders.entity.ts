import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Order } from '../interfaces/order.interface';
import { Rooms } from '../../rooms/entities/rooms.entity';
import { ORDER_STATUSES } from '../orders.constants';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class Orders implements Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @ManyToMany(() => Rooms)
  @JoinTable()
  rooms: Rooms[];

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

  @ManyToOne(() => Users)
  @JoinColumn()
  client: Users;
}
