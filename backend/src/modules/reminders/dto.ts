import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReminderType } from '../../storage/reminder.entity';

export class CreateReminderDto {
  @ApiProperty() @IsString() subscriptionId!: string;
  @ApiProperty() @IsString() reminderDate!: string;
  @ApiProperty({ enum: ['cancellation','renewal','price_change'] }) @IsEnum(['cancellation','renewal','price_change'] as any) type!: ReminderType;
  @ApiProperty() @IsBoolean() isActive!: boolean;
  @ApiProperty() @IsString() message!: string;
}

export class UpdateReminderDto {
  @IsOptional() @IsString() reminderDate?: string;
  @IsOptional() @IsEnum(['cancellation','renewal','price_change'] as any) type?: ReminderType;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() message?: string;
}