import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AnalysisSidebar } from '@/components/analysis/AnalysisSidebar';
import { TrendLineChart } from '@/components/analysis/TrendLineChart';
import { CategoryDonutChart } from '@/components/analysis/CategoryDonutChart';
import { SavingsTipsCard, generateDefaultTips } from '@/components/analysis/SavingsTipsCard';
import { AnalysisEmptyState } from '@/components/analysis/AnalysisEmptyState';
import { StatTile } from '@/components/dashboard/StatTile';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { SubscriptionCategory } from '@/types/subscription';
import { Wallet, TrendingUp, Users, PiggyBank } from 'lucide-react';

const categoryLabels: Record<SubscriptionCategory, string> = {
  streaming: 'Streaming',
  software: 'Software',
  fitness: 'Fitness',
  cloud: 'Cloud',
  gaming: 'Gaming',
  news: 'News',
  other: 'Sonstiges',
};

const categoryColors: Record<SubscriptionCategory, string> = {
  streaming: 'hsl(var(--chart-1))',
  software: 'hsl(var(--chart-2))',
  fitness: 'hsl(var(--chart-3))',
  cloud: 'hsl(var(--chart-4))',
  gaming: 'hsl(var(--chart-5))',
  news: 'hsl(var(--muted-foreground))',
  other: 'hsl(var(--muted))',
};

/**
 * Smart Component: Kostenanalyse-Seite
 * Verarbeitet Daten und orchestriert Dumb Components
 */
export default function Analysis() {
  const { activeSubscriptions, costAnalysis } = useSubscriptions();
  const { householdSize, setHouseholdSize } = useRole();

  // Filter State
  const [selectedCategories, setSelectedCategories] = useState<SubscriptionCategory[]>(
    Object.keys(categoryLabels) as SubscriptionCategory[]
  );
  const [selectedPeriod, setSelectedPeriod] = useState('12m');

  // Reset filters
  const handleReset = () => {
    setSelectedCategories(Object.keys(categoryLabels) as SubscriptionCategory[]);
    setSelectedPeriod('12m');
    setHouseholdSize(1);
  };

  // Filter subscriptions by category
  const filteredSubscriptions = useMemo(() => {
    return activeSubscriptions.filter((sub) =>
      selectedCategories.includes(sub.category)
    );
  }, [activeSubscriptions, selectedCategories]);

  // Calculate filtered totals
  const filteredTotals = useMemo(() => {
    const calculateMonthlyAmount = (price: number, cycle: string) => {
      switch (cycle) {
        case 'weekly': return price * 4.33;
        case 'monthly': return price;
        case 'quarterly': return price / 3;
        case 'yearly': return price / 12;
        default: return price;
      }
    };

    const totalMonthly = filteredSubscriptions.reduce(
      (sum, sub) => sum + calculateMonthlyAmount(sub.price, sub.billingCycle),
      0
    );

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      perPerson: totalMonthly / householdSize,
      estimatedSavings: totalMonthly * 0.2,
    };
  }, [filteredSubscriptions, householdSize]);

  // Generate 12-month trend data (simulated)
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const baseAmount = filteredTotals.totalMonthly;
    
    return months.map((month, index) => ({
      month,
      amount: baseAmount * (0.9 + Math.random() * 0.2), // Slight variation
    }));
  }, [filteredTotals.totalMonthly]);

  // Prepare donut chart data
  const categoryData = useMemo(() => {
    const byCategory: Record<string, number> = {};

    filteredSubscriptions.forEach((sub) => {
      const monthly =
        sub.billingCycle === 'yearly'
          ? sub.price / 12
          : sub.billingCycle === 'quarterly'
          ? sub.price / 3
          : sub.price;
      byCategory[sub.category] = (byCategory[sub.category] || 0) + monthly;
    });

    return Object.entries(byCategory)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        name: categoryLabels[category as SubscriptionCategory],
        value,
        color: categoryColors[category as SubscriptionCategory],
        percentage: (value / filteredTotals.totalMonthly) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSubscriptions, filteredTotals.totalMonthly]);

  // Generate savings tips
  const savingsTips = generateDefaultTips(
    filteredTotals.totalMonthly,
    filteredTotals.totalYearly
  );

  const hasData = filteredSubscriptions.length > 0;
  const hasNoSubscriptions = activeSubscriptions.length === 0;

  return (
    <Layout>
      <main className="container py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Kostenanalyse</h1>
          <p className="text-muted-foreground mt-1">
            Verstehe deine Ausgaben und finde Einsparpotenziale
          </p>
        </header>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AnalysisSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            householdSize={householdSize}
            onHouseholdChange={setHouseholdSize}
            onReset={handleReset}
          />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {hasNoSubscriptions ? (
              <AnalysisEmptyState type="no-data" />
            ) : !hasData ? (
              <AnalysisEmptyState type="no-filter-results" onReset={handleReset} />
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatTile
                    title="Monatlich"
                    value={`${filteredTotals.totalMonthly.toFixed(2)}€`}
                    subtitle={`${filteredSubscriptions.length} Abos`}
                    icon={Wallet}
                  />
                  <StatTile
                    title="Jährlich"
                    value={`${filteredTotals.totalYearly.toFixed(0)}€`}
                    subtitle="Hochgerechnet"
                    icon={TrendingUp}
                  />
                  <StatTile
                    title="Pro Person"
                    value={`${filteredTotals.perPerson.toFixed(2)}€`}
                    subtitle={`Bei ${householdSize} Person${householdSize > 1 ? 'en' : ''}`}
                    icon={Users}
                  />
                  <StatTile
                    title="Einsparpotenzial"
                    value={`~${filteredTotals.estimatedSavings.toFixed(0)}€`}
                    subtitle="Pro Monat möglich"
                    icon={PiggyBank}
                  />
                </div>

                {/* Trend Line Chart */}
                <TrendLineChart data={trendData} />

                {/* Two Equal Tiles: Donut + Tips */}
                <div className="grid md:grid-cols-2 gap-6">
                  <CategoryDonutChart
                    data={categoryData}
                    totalMonthly={filteredTotals.totalMonthly}
                  />
                  <SavingsTipsCard tips={savingsTips} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
