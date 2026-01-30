import { cn } from '@/lib/utils';
import { PiggyBank, TrendingDown, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UnusedSubscription {
  id: string;
  name: string;
  icon?: string;
  price: number;
  lastUsed?: string;
  daysSinceUse: number;
}

interface SavingsPotentialCardProps {
  unusedSubscriptions: UnusedSubscription[];
  potentialSavings: number;
  onCancel?: (id: string) => void;
  className?: string;
}

/**
 * Dumb Component: Einsparpotenzial durch ungenutzte Abos
 */
export const SavingsPotentialCard = ({
  unusedSubscriptions,
  potentialSavings,
  onCancel,
  className,
}: SavingsPotentialCardProps) => {
  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-gradient-to-br from-emerald-500/5 via-card/50 to-primary/5',
        'border border-emerald-500/20',
        className
      )}
    >
      <header className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Einsparpotenzial</h3>
          <p className="text-sm text-muted-foreground">Abos ohne Aktivität (30+ Tage)</p>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <PiggyBank className="h-5 w-5 text-emerald-400" />
        </div>
      </header>

      {/* Total Savings */}
      <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-muted-foreground mb-1">Du könntest bis zu</p>
        <p className="text-3xl font-bold text-emerald-400">
          {potentialSavings.toFixed(0)}€<span className="text-lg font-normal">/Monat</span>
        </p>
        <p className="text-sm text-muted-foreground">sparen</p>
      </div>

      {/* Unused Subscriptions List */}
      {unusedSubscriptions.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Vorgeschlagene Kündigungen
          </p>
          {unusedSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl',
                'bg-background/50 border border-border/20'
              )}
            >
              <span className="text-xl">{sub.icon || '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{sub.name}</p>
                <p className="text-xs text-muted-foreground">
                  {sub.daysSinceUse}+ Tage ungenutzt
                </p>
              </div>
              <div className="text-right mr-2">
                <p className="font-bold text-foreground">{sub.price.toFixed(0)}€</p>
              </div>
              {onCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onCancel(sub.id)}
                  className="shrink-0"
                >
                  Kündigen
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-sm text-foreground font-medium">Alles optimal!</p>
          <p className="text-xs text-muted-foreground">
            Keine ungenutzten Abonnements gefunden
          </p>
        </div>
      )}
    </article>
  );
};
