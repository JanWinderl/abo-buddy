import { Layout } from '@/components/layout/Layout';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Lightbulb, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Target,
  Wallet,
  ChartPie,
} from 'lucide-react';
import { SubscriptionCategory } from '@/types/subscription';
import { Link } from 'react-router-dom';

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

export default function Analysis() {
  const { activeSubscriptions, costAnalysis } = useSubscriptions();
  const { currentRole, householdSize, setHouseholdSize } = useRole();

  // Prepare pie chart data
  const pieData = Object.entries(costAnalysis.byCategory)
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as SubscriptionCategory],
      value: Number(value.toFixed(2)),
      color: categoryColors[category as SubscriptionCategory],
    }))
    .sort((a, b) => b.value - a.value);

  // Prepare bar chart data for monthly comparison
  const barData = activeSubscriptions
    .map((sub) => ({
      name: sub.name.length > 12 ? sub.name.slice(0, 12) + '...' : sub.name,
      fullName: sub.name,
      kosten: sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price,
      icon: sub.icon,
    }))
    .sort((a, b) => b.kosten - a.kosten)
    .slice(0, 8);

  // Calculate comparison metrics
  const avgMonthlyPerSub = activeSubscriptions.length > 0 
    ? costAnalysis.totalMonthly / activeSubscriptions.length 
    : 0;
  
  const estimatedSavings = costAnalysis.totalMonthly * 0.2;

  // Savings recommendations
  const recommendations = [
    {
      title: 'Jahresabos nutzen',
      description: 'Bei jährlicher Zahlung sparst du oft 15-20% gegenüber monatlicher Abrechnung.',
      icon: Calendar,
      potential: Math.round(costAnalysis.totalYearly * 0.15),
      action: 'Abos prüfen',
    },
    {
      title: 'Familien-Tarife teilen',
      description: 'Dienste wie Spotify, Netflix oder Apple One bieten Familien-Optionen zum Teilen.',
      icon: Users,
      potential: Math.round(costAnalysis.totalMonthly * 0.3 * 12),
      action: 'Optionen entdecken',
    },
    {
      title: 'Ungenutzte Dienste kündigen',
      description: 'Überprüfe regelmäßig, welche Abos du tatsächlich nutzt.',
      icon: Target,
      potential: Math.round(costAnalysis.totalMonthly * 0.25 * 12),
      action: 'Nutzung prüfen',
    },
  ];

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kostenanalyse</h1>
            <p className="text-muted-foreground mt-1">
              Verstehe deine Ausgaben und finde Einsparpotenziale
            </p>
          </div>
          {currentRole === 'user' && (
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
              <Crown className="h-4 w-4" />
              Einige Features sind Premium-exklusiv
            </Badge>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monatlich</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {costAnalysis.totalMonthly.toFixed(2)}€
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeSubscriptions.length} aktive Abos
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jährlich</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {costAnalysis.totalYearly.toFixed(0)}€
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Hochgerechnet
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pro Person</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {costAnalysis.perPersonMonthly.toFixed(2)}€
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bei {householdSize} Person{householdSize > 1 ? 'en' : ''}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Einsparpotenzial</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    ~{estimatedSavings.toFixed(0)}€
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3 text-primary" />
                    Pro Monat möglich
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Household Size Setting */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <Label htmlFor="household" className="font-medium">Haushaltsgröße anpassen</Label>
                <p className="text-sm text-muted-foreground">
                  Anzahl der Personen für die Kostenaufteilung
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                  disabled={householdSize <= 1}
                >
                  -
                </Button>
                <Input
                  id="household"
                  type="number"
                  min={1}
                  max={10}
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setHouseholdSize(Math.min(10, householdSize + 1))}
                  disabled={householdSize >= 10}
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ChartPie className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Verteilung nach Kategorie</CardTitle>
              </div>
              <CardDescription>
                Wo fließt dein Geld hin?
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="w-full lg:w-1/2">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)}€`, 'Monatlich']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-foreground flex-1">{item.name}</span>
                        <span className="text-sm font-medium text-foreground">
                          {item.value.toFixed(2)}€
                        </span>
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {((item.value / costAnalysis.totalMonthly) * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                  Keine Daten vorhanden
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Subscriptions Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Kosten nach Abo</CardTitle>
              </div>
              <CardDescription>
                Deine teuersten Abonnements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(v) => `${v}€`}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}€`, 'Monatlich']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="kosten" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                  Keine Daten vorhanden
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary - Above Savings Tips */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Durchschnitt pro Abo</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {avgMonthlyPerSub.toFixed(2)}€
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teuerste Kategorie</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {pieData[0]?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktive Abonnements</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {activeSubscriptions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pro Tag</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {(costAnalysis.totalMonthly / 30).toFixed(2)}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Spartipps für dich</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <rec.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                          Bis zu {rec.potential}€/Jahr
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
