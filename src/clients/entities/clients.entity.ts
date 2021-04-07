import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../interfaces/client.interface';

@Entity()
export class Clients implements Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  firstName: string;

  @Column('varchar', { length: 200 })
  lastName: string;

  @Column('varchar', { length: 150 })
  email: string;

  @Column('varchar', { length: 100 })
  phone: string;
}
