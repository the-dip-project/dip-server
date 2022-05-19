import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('Domain')
export class DomainEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('text', {
    name: 'domain',
    nullable: false,
    unique: true,
  })
  domain!: string;

  @Column('int', { name: 'owner_id', nullable: false })
  ownerId!: number;

  @ManyToOne((_type) => UserEntity, (user) => user.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
  })
  owner: UserEntity;

  @Column('datetime', { name: 'creation_date', nullable: false })
  creationDate!: Date;
}
