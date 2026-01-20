import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SubscriptionCategory } from '../../storage/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsNumber() price!: number;
  @ApiProperty({ enum: ['monthly','yearly','weekly','quarterly'] }) @IsString() billingCycle!: string;
  @ApiProperty({ enum: ['streaming','software','fitness','cloud','gaming','news','other'] }) @IsEnum(['streaming','software','fitness','cloud','gaming','news','other'] as any) category!: SubscriptionCategory;
  @ApiProperty() @IsString() nextBillingDate!: string;
  @ApiProperty() @IsString() userId!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() cancellationDeadline?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() icon?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() color?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiProperty({ required: false, type: [String] }) @IsOptional() sharedWith?: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}

export class UpdateSubscriptionDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsString() billingCycle?: string;
  @IsOptional() @IsEnum(['streaming','software','fitness','cloud','gaming','news','other'] as any) category?: SubscriptionCategory;
  @IsOptional() @IsString() nextBillingDate?: string;
  @IsOptional() @IsString() cancellationDeadline?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() sharedWith?: string[];
  @IsOptional() @IsString() notes?: string;
}