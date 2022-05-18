import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('text', { name: 'username', nullable: false })
  username!: string;

  @Column('text', { name: 'password', nullable: false })
  password!: string;

  @Column('text', { name: 'secret', nullable: false })
  secret!: string;

  @Column('int', { name: 'role', nullable: false })
  role!: number;

  @Column('datetime', { name: 'creation_date', nullable: false })
  creationDate!: Date;
}
