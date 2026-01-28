import { Layout } from '@/components/layout/Layout';
import { StatTile } from '@/components/dashboard/StatTile';
import { HeroPaymentsTile } from '@/components/dashboard/HeroPaymentsTile';
import { QuickActionsTile } from '@/components/dashboard/QuickActionsTile';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  CreditCard, 
  Calendar, 
  TrendingDown,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { mockReminders } from '@/data/mockSubscriptions';
import { differenceInDays, parseISO, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { activeSubscriptions, costAnalysis } = useSubscriptions();
  const { currentRole, householdSize } = useRole();

  // Get urgent reminders (within 7 days)
  const urgentReminders = mockReminders.filter((reminder) => {
    const daysUntil = differenceInDays(parseISO(reminder.reminderDate), new Date());
    return daysUntil >= 0 && daysUntil <= 7 && reminder.isActive;
  });

  // Calculate next payment date
  const nextPayment = costAnalysis.upcomingPayments[0];
  const nextPaymentDate = nextPayment 
    ? format(parseISO(nextPayment.dueDate), 'dd. MMM', { locale: de })
    : '—';

  // Count unique categories
  const categoryCount = Object.keys(costAnalysis.byCategory).length;

  // Check if user is basic (not premium/admin)
  const isBasicUser = currentRole === 'user';

  return (
    <Layout>
      <main className="container py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Willkommen zurück! Hier ist deine Abo-Übersicht.
          </p>
        </header>

        {/* Urgent Reminders Alert */}
        {urgentReminders.length > 0 && (
          <section
            className={cn(
              'mb-6 p-4 rounded-2xl',
              'bg-destructive/10 border border-destructive/30',
              'flex items-start gap-4'
            )}
            role="alert"
          >
            <div className="p-2 rounded-lg bg-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground mb-1">
                {urgentReminders.length} wichtige Erinnerung{urgentReminders.length > 1 ? 'en' : ''}
              </h2>
              <ul className="space-y-1">
                {urgentReminders.slice(0, 2).map((reminder) => (
                  <li key={reminder.id} className="text-sm text-muted-foreground">
                    {reminder.message}
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Link to="/reminders">Alle anzeigen</Link>
            </Button>
          </section>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          
          {/* Hero Tile - Upcoming Payments (spans 2 cols, 2 rows) */}
          <HeroPaymentsTile 
            analysis={costAnalysis} 
            className="md:col-span-2 md:row-span-2"
          />

          {/* Stat Tile: Monthly Costs */}
          <StatTile
            title="Monatliche Kosten"
            value={`${costAnalysis.totalMonthly.toFixed(2)}€`}
            subtitle={`${(costAnalysis.totalMonthly / householdSize).toFixed(2)}€ pro Person`}
            icon={Wallet}
          />

          {/* Stat Tile: Active Subscriptions */}
          <StatTile
            title="Aktive Abos"
            value={activeSubscriptions.length.toString()}
            subtitle={`${categoryCount} Kategorien`}
            icon={CreditCard}
          />

          {/* Stat Tile: Next Payment */}
          <StatTile
            title="Nächste Zahlung"
            value={nextPaymentDate}
            subtitle={nextPayment ? `${nextPayment.subscription.name} · ${nextPayment.amount.toFixed(2)}€` : 'Keine ausstehend'}
            icon={Calendar}
          />

          {/* Quick Actions Tile */}
          <QuickActionsTile />

          {/* Premium Tip / Savings Card (spans 2 cols) */}
          <section
            className={cn(
              'relative overflow-hidden rounded-2xl p-5 md:col-span-2',
              isBasicUser 
                ? 'bg-gradient-to-br from-accent/20 via-card/50 to-primary/10'
                : 'bg-gradient-to-br from-primary/10 via-card/50 to-success/10',
              'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
              'before:bg-gradient-to-br before:from-border/40 before:via-transparent before:to-border/20',
              'before:-z-10 before:content-[""]'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-2.5 rounded-xl',
                isBasicUser ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
              )}>
                {isBasicUser ? <Sparkles className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </div>
              
              <div className="flex-1">
                {isBasicUser ? (
                  <>
                    <h3 className="font-semibold text-foreground mb-1">
                      Upgrade auf Premium
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Erhalte personalisierte Spartipps, detaillierte Analysen und 
                      Erinnerungen für all deine Abos.
                    </p>
                    <Button asChild variant="secondary" size="sm">
                      <Link to="/pricing">Premium entdecken</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-foreground mb-1">
                      Einsparpotenzial erkannt
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Du könntest ca. <strong className="text-foreground">{(costAnalysis.totalMonthly * 0.2).toFixed(2)}€</strong> pro 
                      Monat sparen, indem du ungenutzte Abos überprüfst.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Das entspricht <strong className="text-foreground">{(costAnalysis.totalYearly * 0.2).toFixed(2)}€</strong> pro Jahr.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}