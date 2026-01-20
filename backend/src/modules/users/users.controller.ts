import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/role.enum';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@ApiTags('users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Roles(Role.admin, Role.premium)
  @Get()
  findAll() { return this.service.findAll(); }

  @Roles(Role.admin, Role.premium)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Roles(Role.admin)
  @Post()
  create(@Body() dto: CreateUserDto) { return this.service.create(dto); }

  @Roles(Role.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.service.update(id, dto); }

  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}