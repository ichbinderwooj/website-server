import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    length: 60,
  })
  password: string;

  @Column()
  createdAt: Timestamp;

  @Column('text')
  description: string;

  @Column('int')
  permission: number;
}
