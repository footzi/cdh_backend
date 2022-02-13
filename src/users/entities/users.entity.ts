import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../interfaces/users.interface';
import { USER_ROLES } from '../users.constants';

@Entity()
export class Users implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  login: string;

  @Column('varchar', { length: 200 })
  firstName: string;

  @Column('varchar', { length: 200, nullable: true })
  lastName?: string;

  @Column('varchar', { length: 150 })
  email: string;

  @Column('varchar', { length: 100 })
  phone: string;

  @Column('varchar', { length: 100 })
  password?: string;

  @Column('varchar', { length: 100 })
  role: USER_ROLES;

  @Column('boolean')
  isConfirm: boolean;

  @Column('boolean')
  isActive: boolean;
}
