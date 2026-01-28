import { CostAnalysis } from '@/types/subscription';
import { UpcomingPaymentItem } from './UpcomingPaymentItem';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeroPaymentsTileProps {
  analysis: CostAnalysis;
  className?: string;
}

/**
 * Dumb Component: Hero-Kachel für anstehende Fälligkeiten
 * Zeigt die nächsten Zahlungen mit Countdown und Markenlogos
 */
export const HeroPaymentsTile = ({ analysis, className }: HeroPaymentsTileProps) => {
  const upcomingPayments = analysis.upcomingPayments.slice(0, 5);
  const totalUpcoming = analysis.upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-sm',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-primary/30 before:via-border/40 before:to-accent/20',
        'before:-z-10 before:content-[""]',
        className
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Anstehende Fälligkeiten
            </h2>
            <p className="text-xs text-muted-foreground">
              {analysis.upcomingPayments.length} Zahlungen ausstehend
            </p>
          </div>
        </div>
        
        {upcomingPayments.length > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {totalUpcoming.toFixed(2)}€
            </p>
            <p className="text-xs text-muted-foreground">Gesamt</p>
          </div>
        )}
      </header>

      {/* Payment List */}
      {upcomingPayments.length > 0 ? (
        <div className="space-y-2">
          {upcomingPayments.map(({ subscription, dueDate, amount }) => (
            <UpcomingPaymentItem
              key={subscription.id}
              name={subscription.name}
              icon={subscription.icon}
              dueDate={dueDate}
              amount={amount}
              category={subscription.category}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted/30 mb-4">
            <CalendarClock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Keine anstehenden Zahlungen
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Füge dein erstes Abo hinzu
          </p>
        </div>
      )}

      {/* Footer Link */}
      {analysis.upcomingPayments.length > 5 && (
        <footer className="mt-4 pt-4 border-t border-border/20">
          <Link
            to="/analysis"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Alle {analysis.upcomingPayments.length} Zahlungen anzeigen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      )}
    </section>
  );
};
