import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/role.enum';
import { RemindersService } from './reminders.service';
import { CreateReminderDto, UpdateReminderDto } from './dto';

@ApiTags('reminders')
@UseGuards(RolesGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private service: RemindersService) {}

  @Roles(Role.user, Role.premium, Role.admin)
  @Get()
  findAll() { return this.service.findAll(); }

  @Roles(Role.user, Role.premium, Role.admin)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Roles(Role.premium, Role.admin)
  @Post()
  create(@Body() dto: CreateReminderDto) { return this.service.create(dto); }

  @Roles(Role.premium, Role.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReminderDto) { return this.service.update(id, dto); }

  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}