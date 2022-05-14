import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LogTypes {
  LOG = 0,
  ERROR = 1,
  WARNING = 2,
  VERBOSE = 3,
  DEBUG = 4,
}

@Entity('Log')
export class LogEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column('int', { name: 'type', nullable: false })
  type!: number;

  @Column('text', { name: 'scope' })
  scope!: string;

  @Column('text', { name: 'message' })
  message!: string;

  @Column('text', { name: 'stack' })
  stack!: string;

  @Column('text', { name: 'detail' })
  detail!: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate!: Date;

  @Column('text', { name: 'source' })
  source!: string;
}
