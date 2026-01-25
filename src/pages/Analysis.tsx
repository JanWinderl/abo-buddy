import { Layout } from '@/components/layout/Layout';
import { CostSummary } from '@/components/analysis/CostSummary';
import { CostChart } from '@/components/analysis/CostChart';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Lightbulb, Crown } from 'lucide-react';

export default function Analysis() {
  const { activeSubscriptions, costAnalysis } = useSubscriptions();
  const { currentRole } = useRole();

  // Generate data for cost breakdown - sorted by price
  const subscriptionCosts = activeSubscriptions
    .map((sub) => ({
      name: sub.name,
      icon: sub.icon,
      cost: sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price,
      category: sub.category,
    }))
    .sort((a, b) => b.cost - a.cost);

  const maxCost = Math.max(...subscriptionCosts.map((s) => s.cost), 1);

  // Simulated historical data for trend
  const trendData = [
    { month: 'Aug', kosten: 145 },
    { month: 'Sep', kosten: 152 },
    { month: 'Okt', kosten: 148 },
    { month: 'Nov', kosten: 155 },
    { month: 'Dez', kosten: 162 },
    { month: 'Jan', kosten: costAnalysis.totalMonthly },
  ];

  // Savings tips based on subscriptions
  const savingsTips = [
    {
      title: 'Jahresabos nutzen',
      description: 'Viele Dienste bieten 15-20% Rabatt bei jährlicher Zahlung.',
      potential: '~20€/Monat',
    },
    {
      title: 'Familien-Pläne teilen',
      description: 'Spotify, Netflix und Apple bieten günstige Familien-Optionen.',
      potential: '~15€/Monat',
    },
    {
      title: 'Ungenutzte Abos kündigen',
      description: 'Überprüfe regelmäßig, welche Dienste du wirklich nutzt.',
      potential: '~30€/Monat',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      streaming: 'bg-violet-500',
      software: 'bg-blue-500',
      fitness: 'bg-green-500',
      cloud: 'bg-cyan-500',
      gaming: 'bg-orange-500',
      news: 'bg-yellow-500',
      other: 'bg-gray-500',
    };
    return colors[category] || 'bg-primary';
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Kostenanalyse</h1>
          <p className="text-muted-foreground">
            Detaillierte Übersicht deiner Abonnement-Ausgaben
          </p>
        </div>

        {/* Cost Summary */}
        <CostSummary analysis={costAnalysis} />

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Category Pie Chart */}
          <CostChart analysis={costAnalysis} />

          {/* Subscription Cost Breakdown - Scrollable List with Progress Bars */}
          <Card>
            <CardHeader>
              <CardTitle>Kosten nach Abo</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionCosts.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {subscriptionCosts.map((sub, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-lg">{sub.icon}</span>
                            <span className="font-medium text-foreground truncate">{sub.name}</span>
                          </div>
                          <span className="font-semibold text-foreground ml-2">
                            {sub.cost.toFixed(2)}€
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(sub.cost / maxCost) * 100} 
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {((sub.cost / costAnalysis.totalMonthly) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Keine Daten vorhanden
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart (Premium only) */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Kostenentwicklung
              </CardTitle>
              {currentRole === 'user' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentRole !== 'user' ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}€`}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}€`, 'Gesamtkosten']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kosten" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-center">
                <Crown className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Upgrade auf Premium um die Kostenentwicklung zu sehen
                </p>
                <p className="text-sm text-muted-foreground">
                  Verfolge wie sich deine Ausgaben über die Zeit entwickeln
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Tips */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Spartipps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsTips.map((tip) => (
              <Card key={tip.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{tip.description}</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Potenzial: {tip.potential}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
