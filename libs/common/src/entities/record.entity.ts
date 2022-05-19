import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DomainEntity } from './domain.entity';

@Entity('Record')
export class RecordEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('text', { name: 'host', nullable: false })
  host!: string;

  @Column('int', { name: 'ttl', nullable: false })
  ttl!: number;

  @Column('int', { name: 'type', nullable: false })
  type!: number;

  @Column('int', { name: 'class', nullable: false })
  class!: number;

  @Column('text', { name: 'data', nullable: false })
  data!: string;

  @Column('text', { name: 'extended_data', nullable: true })
  extendedData!: string;

  @Column('int', { name: 'domain_id', nullable: false })
  domainId!: number;

  @ManyToOne((_type) => DomainEntity, (domain) => domain.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'domain_id', referencedColumnName: 'id' })
  domain!: DomainEntity;
}
