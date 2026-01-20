import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly';
export type SubscriptionCategory = 'streaming' | 'software' | 'fitness' | 'cloud' | 'gaming' | 'news' | 'other';

@Entity()
export class Subscription {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column('float')
  price!: number;

  @ApiProperty({ enum: ['monthly','yearly','weekly','quarterly'] })
  @Column({ type: 'text' })
  billingCycle!: string;

  @ApiProperty({ enum: ['streaming','software','fitness','cloud','gaming','news','other'] })
  @Column({ type: 'text' })
  category!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  nextBillingDate!: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  cancellationDeadline?: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  icon?: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  color?: string | null;

  @ApiProperty()
  @Column({ default: true })
  isActive!: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiProperty()
  @Column({ type: 'text' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  user!: User;

  @ApiProperty({ required: false, type: [String] })
  @Column('simple-json', { nullable: true })
  sharedWith?: string[] | null;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string | null;
}