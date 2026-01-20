import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription, User, Reminder } from '../storage';
import { SubscriptionsModule } from './subscriptions';
import { UsersModule } from './users';
import { RemindersModule } from './reminders';
import { ActionsModule } from './actions';
import { JobsModule } from './jobs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      entities: [Subscription, User, Reminder],
      synchronize: true
    }),
    UsersModule,
    SubscriptionsModule,
    RemindersModule,
    ActionsModule,
    JobsModule,
  ],
})
export class AppModule {}