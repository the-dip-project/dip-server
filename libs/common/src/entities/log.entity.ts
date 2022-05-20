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

  @Column('text', { name: 'scope', nullable: false })
  scope!: string;

  @Column('text', { name: 'message', nullable: false })
  message!: string;

  @Column('text', { name: 'stack', nullable: false })
  stack!: string;

  @Column('text', { name: 'detail', nullable: false })
  detail!: string;

  @CreateDateColumn({ name: 'creation_date', nullable: false })
  creationDate!: Date;

  @Column('text', { name: 'source', nullable: false })
  source!: string;
}
