import { Layout } from '@/components/layout/Layout';
import { CostChart } from '@/components/analysis/CostChart';
import { UpcomingPayments } from '@/components/dashboard/UpcomingPayments';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, AlertTriangle, Calendar, TrendingUp, Users, TrendingDown } from 'lucide-react';
import { mockReminders } from '@/data/mockSubscriptions';
import { differenceInDays, parseISO } from 'date-fns';

export default function Dashboard() {
  const { activeSubscriptions, costAnalysis, toggleSubscription } = useSubscriptions();
  const { currentRole, householdSize, setHouseholdSize } = useRole();

  // Get urgent reminders (within 7 days)
  const urgentReminders = mockReminders.filter((reminder) => {
    const daysUntil = differenceInDays(parseISO(reminder.reminderDate), new Date());
    return daysUntil >= 0 && daysUntil <= 7 && reminder.isActive;
  });

  // Get top 4 subscriptions by price
  const topSubscriptions = [...activeSubscriptions]
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  const stats = [
    {
      title: 'Monatliche Kosten',
      value: `${costAnalysis.totalMonthly.toFixed(2)}€`,
      icon: Calendar,
      description: 'Alle aktiven Abos',
    },
    {
      title: 'Jährliche Kosten',
      value: `${costAnalysis.totalYearly.toFixed(2)}€`,
      icon: TrendingUp,
      description: 'Hochgerechnet auf 12 Monate',
    },
    {
      title: 'Pro Person / Monat',
      value: `${costAnalysis.perPersonMonthly.toFixed(2)}€`,
      icon: Users,
      description: `Bei ${householdSize} Person${householdSize > 1 ? 'en' : ''}`,
    },
    {
      title: 'Einsparpotenzial',
      value: `${(costAnalysis.totalMonthly * 0.2).toFixed(2)}€`,
      icon: TrendingDown,
      description: 'Geschätzt 20% möglich',
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Willkommen zurück! Hier ist deine Abo-Übersicht.
            </p>
          </div>
          <Button asChild>
            <Link to="/subscriptions">
              <Plus className="mr-2 h-4 w-4" />
              Abo hinzufügen
            </Link>
          </Button>
        </div>

        {/* Urgent Reminders */}
        {urgentReminders.length > 0 && (
          <Card className="mb-8 border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Wichtige Erinnerungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {urgentReminders.map((reminder) => (
                  <li
                    key={reminder.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-destructive/10"
                  >
                    <span className="text-foreground">{reminder.message}</span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/reminders">Details</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Cost Summary Section */}
        <div className="space-y-6 mb-8">
          {/* Household Size Input - Same as Analysis Page */}
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Chart & Upcoming */}
          <div className="lg:col-span-2 space-y-8">
            <CostChart analysis={costAnalysis} />
            <UpcomingPayments analysis={costAnalysis} />
          </div>

          {/* Right Column - Top Subscriptions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Teuerste Abos</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/subscriptions" className="flex items-center gap-1">
                  Alle anzeigen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {topSubscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onToggle={toggleSubscription}
                  showActions={false}
                />
              ))}
            </div>

            {currentRole === 'premium' || currentRole === 'admin' ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Premium-Tipp:</strong> Du könntest 
                    ca. {(costAnalysis.totalMonthly * 0.2).toFixed(2)}€ pro Monat sparen, 
                    indem du ungenutzte Abos kündigst.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-accent/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade auf Premium für personalisierte Spartipps
                  </p>
                  <Button variant="outline" size="sm">
                    Premium entdecken
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
