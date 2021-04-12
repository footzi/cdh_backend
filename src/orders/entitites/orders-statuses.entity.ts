import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../interfaces/order-statuses.interface';

@Entity()
export class OrderStatuses implements OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;
}
