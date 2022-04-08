import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from '../interfaces/pets.interfaces';
import { PET_REPRODUCTION_TYPES, PET_TYPES } from '../pets.constants';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class Pets implements Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('integer')
  age: number;

  @Column('varchar', { length: 100 })
  type: PET_TYPES;

  @Column('varchar', { length: 100 })
  reproduction: PET_REPRODUCTION_TYPES;

  @Column('varchar', { length: 500, nullable: true })
  special?: string;

  @Column('varchar', { length: 500, nullable: true })
  comments?: string;

  @ManyToOne((type) => Users, (user) => user.pets)
  client: Users;
}
