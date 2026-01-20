import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './subscription.entity';

export type ReminderType = 'cancellation' | 'renewal' | 'price_change';

@Entity()
export class Reminder {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  subscriptionId!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  reminderDate!: string;

  @ApiProperty({ enum: ['cancellation','renewal','price_change'] })
  @Column({ type: 'text' })
  type!: ReminderType;

  @ApiProperty()
  @Column({ default: true })
  isActive!: boolean;

  @ApiProperty()
  @Column({ type: 'text' })
  message!: string;

  @ManyToOne(() => Subscription, { onDelete: 'CASCADE' })
  subscription!: Subscription;
}