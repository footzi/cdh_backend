import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../interfaces/order.interface';

@Entity()
export class OrderEntity implements Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @Column('integer')
  roomId: number;

  @Column('varchar', { length: 500 })
  comment: string;

  @Column('integer')
  statusId: number;
}
