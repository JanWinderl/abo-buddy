import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../../storage/reminder.entity';
import { CreateReminderDto, UpdateReminderDto } from './dto';

@Injectable()
export class RemindersService {
  constructor(@InjectRepository(Reminder) private repo: Repository<Reminder>) {}

  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  async create(dto: CreateReminderDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: string, dto: UpdateReminderDto) { await this.repo.update(id, dto); return this.findOne(id); }
  async remove(id: string) { await this.repo.delete(id); }
}