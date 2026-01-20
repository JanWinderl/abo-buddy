import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/role.enum';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

@ApiTags('subscriptions')
@UseGuards(RolesGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) {}

  @Roles(Role.user, Role.premium, Role.admin)
  @Get()
  findAll() { return this.service.findAll(); }

  @Roles(Role.user, Role.premium, Role.admin)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Roles(Role.admin)
  @Post()
  create(@Body() dto: CreateSubscriptionDto) { return this.service.create(dto); }

  @Roles(Role.premium, Role.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) { return this.service.update(id, dto); }

  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}