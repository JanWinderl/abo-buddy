import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../../storage/subscription.entity';
import { ActionsController } from './actions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [ActionsController]
})
export class ActionsModule {}