import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../common/role.enum';
import { Subscription } from './subscription.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ unique: true })
  email!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty({ enum: Role })
  @Column({ type: 'text', default: Role.user })
  role!: Role;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Subscription, (sub: Subscription) => sub.user)
  subscriptions!: Subscription[];
}