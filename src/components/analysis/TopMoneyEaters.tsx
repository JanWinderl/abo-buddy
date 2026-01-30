import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TopSubscription {
  name: string;
  icon?: string;
  price: number;
  percentage: number;
  category: string;
}

interface TopMoneyEatersProps {
  subscriptions: TopSubscription[];
  totalMonthly: number;
  className?: string;
}

/**
 * Dumb Component: Top 3 teuerste Abonnements
 */
export const TopMoneyEaters = ({
  subscriptions,
  totalMonthly,
  className,
}: TopMoneyEatersProps) => {
  const topThree = subscriptions.slice(0, 3);

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-card/50 backdrop-blur-sm',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-destructive/40 before:via-transparent before:to-orange-500/20',
        'before:-z-10 before:content-[""]',
        className
      )}
    >
      <header className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Top 3 Geldfresser</h3>
          <p className="text-sm text-muted-foreground">Höchste monatliche Kosten</p>
        </div>
        <div className="p-2 rounded-lg bg-destructive/10">
          <TrendingUp className="h-5 w-5 text-destructive" />
        </div>
      </header>

      <div className="space-y-3">
        {topThree.map((sub, index) => (
          <div
            key={sub.name}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl',
              'bg-background/50 border border-border/20'
            )}
          >
            {/* Rank */}
            <span
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                index === 0 && 'bg-amber-500/20 text-amber-400',
                index === 1 && 'bg-slate-400/20 text-slate-400',
                index === 2 && 'bg-orange-600/20 text-orange-500'
              )}
            >
              {index + 1}
            </span>

            {/* Icon */}
            <span className="text-xl">{sub.icon || '📦'}</span>

            {/* Name & Category */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{sub.category}</p>
            </div>

            {/* Price & Percentage */}
            <div className="text-right">
              <p className="font-bold text-foreground">{sub.price.toFixed(2)}€</p>
              <p className="text-xs text-muted-foreground">{sub.percentage.toFixed(0)}% Anteil</p>
            </div>
          </div>
        ))}
      </div>

      {topThree.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Diese 3 Abos kosten dich{' '}
              <strong>
                {topThree.reduce((sum, s) => sum + s.price, 0).toFixed(0)}€
              </strong>{' '}
              pro Monat
            </span>
          </div>
        </div>
      )}
    </article>
  );
};
