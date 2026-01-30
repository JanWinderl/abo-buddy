import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AnalysisSidebar } from '@/components/analysis/AnalysisSidebar';
import { TrendLineChart } from '@/components/analysis/TrendLineChart';
import { CategoryDonutChart } from '@/components/analysis/CategoryDonutChart';
import { SavingsTipsCard, generateDefaultTips } from '@/components/analysis/SavingsTipsCard';
import { AnalysisEmptyState } from '@/components/analysis/AnalysisEmptyState';
import { TopMoneyEaters } from '@/components/analysis/TopMoneyEaters';
import { YearComparison } from '@/components/analysis/YearComparison';
import { SavingsPotentialCard } from '@/components/analysis/SavingsPotentialCard';
import { ExportButton } from '@/components/analysis/ExportButton';
import { StatTile } from '@/components/dashboard/StatTile';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { SubscriptionCategory } from '@/types/subscription';
import { Wallet, TrendingUp, Users, PiggyBank, CalendarDays, Target } from 'lucide-react';
import { toast } from 'sonner';

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
 * Smart Component: Erweiterte Kostenanalyse-Seite
 */
export default function Analysis() {
  const { activeSubscriptions, subscriptions, costAnalysis, addSubscription } = useSubscriptions();
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
      averagePerSub: filteredSubscriptions.length > 0 ? totalMonthly / filteredSubscriptions.length : 0,
      costPerDay: totalMonthly / 30,
    };
  }, [filteredSubscriptions, householdSize]);

  // Generate 12-month trend data
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const baseAmount = filteredTotals.totalMonthly;
    
    return months.map((month, index) => ({
      month,
      amount: Math.max(0, baseAmount * (0.85 + Math.random() * 0.3)),
    }));
  }, [filteredTotals.totalMonthly]);

  // Year comparison data
  const yearComparisonData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'];
    const baseAmount = filteredTotals.totalMonthly;
    
    return months.map((month) => ({
      month,
      current: Math.max(0, baseAmount * (0.9 + Math.random() * 0.2)),
      previous: Math.max(0, baseAmount * 0.85 * (0.9 + Math.random() * 0.2)),
    }));
  }, [filteredTotals.totalMonthly]);

  const totalCurrentYear = yearComparisonData.reduce((sum, d) => sum + d.current, 0);
  const totalPreviousYear = yearComparisonData.reduce((sum, d) => sum + d.previous, 0);

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

  // Top Money Eaters
  const topMoneyEaters = useMemo(() => {
    const calculateMonthlyAmount = (price: number, cycle: string) => {
      switch (cycle) {
        case 'weekly': return price * 4.33;
        case 'monthly': return price;
        case 'quarterly': return price / 3;
        case 'yearly': return price / 12;
        default: return price;
      }
    };

    return filteredSubscriptions
      .map((sub) => ({
        name: sub.name,
        icon: sub.icon,
        price: calculateMonthlyAmount(sub.price, sub.billingCycle),
        percentage: (calculateMonthlyAmount(sub.price, sub.billingCycle) / filteredTotals.totalMonthly) * 100,
        category: categoryLabels[sub.category],
      }))
      .sort((a, b) => b.price - a.price)
      .slice(0, 3);
  }, [filteredSubscriptions, filteredTotals.totalMonthly]);

  // Unused Subscriptions (simulated - in real app would track usage)
  const unusedSubscriptions = useMemo(() => {
    // Simulate some subscriptions as unused
    return filteredSubscriptions
      .filter((_, index) => index % 4 === 0) // Every 4th subscription
      .slice(0, 3)
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        icon: sub.icon,
        price: sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price,
        daysSinceUse: 30 + Math.floor(Math.random() * 60),
      }));
  }, [filteredSubscriptions]);

  const potentialSavings = unusedSubscriptions.reduce((sum, s) => sum + s.price, 0);

  // Most expensive category
  const mostExpensiveCategory = categoryData.length > 0 ? categoryData[0].name : 'Keine';

  // Generate savings tips
  const savingsTips = generateDefaultTips(
    filteredTotals.totalMonthly,
    filteredTotals.totalYearly
  );

  // Export handlers
  const handleExportPDF = () => {
    toast.info('PDF-Export wird vorbereitet...');
  };

  const handleExportCSV = () => {
    toast.info('CSV-Export wird vorbereitet...');
  };

  const handleExportExcel = () => {
    toast.info('Excel-Export wird vorbereitet...');
  };

  const handleCancelSubscription = (id: string) => {
    toast.info('Kündigungs-Assistent wird geöffnet...');
  };

  const hasData = filteredSubscriptions.length > 0;
  const hasNoSubscriptions = activeSubscriptions.length === 0;

  return (
    <Layout>
      <main className="container py-8 pb-24 lg:pb-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kostenanalyse</h1>
            <p className="text-muted-foreground mt-1">
              Verstehe deine Ausgaben und finde Einsparpotenziale
            </p>
          </div>
          <ExportButton
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            onExportExcel={handleExportExcel}
          />
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
                    title="Pro Tag"
                    value={`${filteredTotals.costPerDay.toFixed(2)}€`}
                    subtitle="Tägliche Kosten"
                    icon={CalendarDays}
                  />
                </div>

                {/* Quick Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-card/50 border border-border/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {filteredTotals.averagePerSub.toFixed(2)}€
                    </p>
                    <p className="text-xs text-muted-foreground">Durchschnitt pro Abo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{mostExpensiveCategory}</p>
                    <p className="text-xs text-muted-foreground">Teuerste Kategorie</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{filteredSubscriptions.length}</p>
                    <p className="text-xs text-muted-foreground">Aktive Abonnements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {filteredTotals.costPerDay.toFixed(2)}€
                    </p>
                    <p className="text-xs text-muted-foreground">Pro Tag</p>
                  </div>
                </div>

                {/* Year Comparison + Top Money Eaters */}
                <div className="grid md:grid-cols-2 gap-6">
                  <YearComparison
                    data={yearComparisonData}
                    currentYear={2025}
                    previousYear={2024}
                    totalCurrent={totalCurrentYear}
                    totalPrevious={totalPreviousYear}
                  />
                  <TopMoneyEaters
                    subscriptions={topMoneyEaters}
                    totalMonthly={filteredTotals.totalMonthly}
                  />
                </div>

                {/* Trend Line Chart */}
                <TrendLineChart data={trendData} />

                {/* Donut Chart + Savings Potential */}
                <div className="grid md:grid-cols-2 gap-6">
                  <CategoryDonutChart
                    data={categoryData}
                    totalMonthly={filteredTotals.totalMonthly}
                  />
                  <SavingsPotentialCard
                    unusedSubscriptions={unusedSubscriptions}
                    potentialSavings={potentialSavings}
                    onCancel={handleCancelSubscription}
                  />
                </div>

                {/* Savings Tips */}
                <SavingsTipsCard tips={savingsTips} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onAddSubscription={(data) => addSubscription({ ...data, userId: '1' })} />
    </Layout>
  );
}
