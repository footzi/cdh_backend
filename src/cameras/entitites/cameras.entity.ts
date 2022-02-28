import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Camera } from '../interfaces/cameras.interfaces';

@Entity()
export class Cameras implements Camera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('boolean')
  isPublic: boolean;
}
