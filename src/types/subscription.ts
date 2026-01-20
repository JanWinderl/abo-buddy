// SubMate - Subscription Types

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly';
export type SubscriptionCategory = 'streaming' | 'software' | 'fitness' | 'cloud' | 'gaming' | 'news' | 'other';
export type UserRole = 'user' | 'premium' | 'admin';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  nextBillingDate: string;
  cancellationDeadline?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sharedWith?: string[];
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Reminder {
  id: string;
  subscriptionId: string;
  reminderDate: string;
  type: 'cancellation' | 'renewal' | 'price_change';
  isActive: boolean;
  message: string;
}

export interface CostAnalysis {
  totalMonthly: number;
  totalYearly: number;
  perPersonMonthly: number;
  byCategory: Record<SubscriptionCategory, number>;
  upcomingPayments: {
    subscription: Subscription;
    dueDate: string;
    amount: number;
  }[];
}
