import { useState, useMemo } from 'react';
import { Subscription, CostAnalysis, SubscriptionCategory } from '@/types/subscription';
import { mockSubscriptions } from '@/data/mockSubscriptions';
import { useRole } from '@/contexts/RoleContext';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const { householdSize } = useRole();

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((sub) => sub.isActive),
    [subscriptions]
  );

  const costAnalysis = useMemo((): CostAnalysis => {
    const calculateMonthlyAmount = (sub: Subscription): number => {
      switch (sub.billingCycle) {
        case 'weekly':
          return sub.price * 4.33;
        case 'monthly':
          return sub.price;
        case 'quarterly':
          return sub.price / 3;
        case 'yearly':
          return sub.price / 12;
        default:
          return sub.price;
      }
    };

    const activeSubs = activeSubscriptions;
    const totalMonthly = activeSubs.reduce(
      (sum, sub) => sum + calculateMonthlyAmount(sub),
      0
    );

    const byCategory = activeSubs.reduce((acc, sub) => {
      const category = sub.category;
      acc[category] = (acc[category] || 0) + calculateMonthlyAmount(sub);
      return acc;
    }, {} as Record<SubscriptionCategory, number>);

    const upcomingPayments = activeSubs
      .map((sub) => ({
        subscription: sub,
        dueDate: sub.nextBillingDate,
        amount: sub.price,
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      perPersonMonthly: totalMonthly / householdSize,
      byCategory,
      upcomingPayments,
    };
  }, [activeSubscriptions, householdSize]);

  const addSubscription = (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSub: Subscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [...prev, newSub]);
    return newSub;
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
          : sub
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? { ...sub, isActive: !sub.isActive, updatedAt: new Date().toISOString() }
          : sub
      )
    );
  };

  return {
    subscriptions,
    activeSubscriptions,
    costAnalysis,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscription,
  };
};
