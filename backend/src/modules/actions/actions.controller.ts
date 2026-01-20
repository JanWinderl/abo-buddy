import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../storage/subscription.entity';

@ApiTags('actions')
@UseGuards(RolesGuard)
@Controller('actions')
export class ActionsController {
  constructor(@InjectRepository(Subscription) private subsRepo: Repository<Subscription>) {}

  // A2:Action - Teile ein Abo mit einer E-Mail
  @Roles(Role.premium, Role.admin)
  @Post('subscriptions/:id/share')
  async share(@Param('id') id: string, @Body() body: { email: string }) {
    const sub = await this.subsRepo.findOne({ where: { id } });
    if (!sub) return { ok: false, message: 'Subscription nicht gefunden' };
    const current = sub.sharedWith ?? [];
    sub.sharedWith = Array.from(new Set([...current, body.email]));
    await this.subsRepo.save(sub);
    return { ok: true, sharedWith: sub.sharedWith };
  }

  // A2:Action - Optimiere auf jährliche Zahlung und berechne Ersparnis
  @Roles(Role.premium, Role.admin)
  @Post('optimize-yearly')
  async optimize(@Body() body: { subscriptionId: string; yearlyDiscountPercent?: number }) {
    const sub = await this.subsRepo.findOne({ where: { id: body.subscriptionId } });
    if (!sub) return { ok: false, message: 'Subscription nicht gefunden' };
    const monthly = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
    const yearly = monthly * 12;
    const discount = body.yearlyDiscountPercent ?? 15;
    const discountedYearly = yearly * (1 - discount / 100);
    const savingsPerYear = yearly - discountedYearly;
    return { ok: true, suggestion: 'Jährliche Zahlung', savingsPerYear };
  }

  // A2:Action - Aktiviere/Deaktiviere ein Abo
  @Roles(Role.premium, Role.admin)
  @Post('subscriptions/:id/toggle')
  async toggle(@Param('id') id: string) {
    const sub = await this.subsRepo.findOne({ where: { id } });
    if (!sub) return { ok: false, message: 'Subscription nicht gefunden' };
    sub.isActive = !sub.isActive;
    await this.subsRepo.save(sub);
    return { ok: true, isActive: sub.isActive };
  }
}