import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../storage/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  async create(dto: CreateUserDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: string, dto: UpdateUserDto) { await this.repo.update(id, dto); return this.findOne(id); }
  async remove(id: string) { await this.repo.delete(id); }
}