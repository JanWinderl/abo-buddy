import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../storage/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

@Injectable()
export class SubscriptionsService {
  constructor(@InjectRepository(Subscription) private repo: Repository<Subscription>) {}

  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  async create(dto: CreateSubscriptionDto) { return this.repo.save(this.repo.create({ ...dto })); }
  async update(id: string, dto: UpdateSubscriptionDto) { await this.repo.update(id, dto); return this.findOne(id); }
  async remove(id: string) { await this.repo.delete(id); }
}