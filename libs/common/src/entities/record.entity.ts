import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Record')
export class RecordEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('text', { name: 'name', nullable: false })
  name!: string;

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
}
