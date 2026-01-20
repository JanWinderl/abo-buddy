import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/role.enum';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@UseGuards(RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobs: JobsService) {}

  @Roles(Role.premium, Role.admin)
  @Post('import-subscriptions')
  async import(@Body() body: { items: any[] }) {
    const job = await this.jobs.importSubscriptions(body.items ?? []);
    return { status: 202, jobId: job.id };
  }

  @Roles(Role.admin)
  @Post('delete-subscription')
  async delete(@Body() body: { id: string }) {
    const job = await this.jobs.deleteSubscription(body.id);
    return { status: 202, jobId: job.id };
  }

  @Roles(Role.user, Role.premium, Role.admin)
  @Get(':id')
  status(@Param('id') id: string) {
    return this.jobs.get(id);
  }
}