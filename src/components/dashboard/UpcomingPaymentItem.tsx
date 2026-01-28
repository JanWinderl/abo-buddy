import { differenceInDays, parseISO, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface UpcomingPaymentItemProps {
  name: string;
  icon?: string;
  dueDate: string;
  amount: number;
  category?: string;
}

/**
 * Dumb Component: Einzelne Zahlung in der Fälligkeiten-Liste
 * Zeigt Countdown, Logo/Icon und Betrag
 */
export const UpcomingPaymentItem = ({
  name,
  icon,
  dueDate,
  amount,
  category,
}: UpcomingPaymentItemProps) => {
  const daysUntil = differenceInDays(parseISO(dueDate), new Date());
  const formattedDate = format(parseISO(dueDate), 'dd. MMM', { locale: de });
  
  const getUrgencyStyles = () => {
    if (daysUntil <= 3) return 'bg-destructive/20 text-destructive border-destructive/30';
    if (daysUntil <= 7) return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-muted/50 text-muted-foreground border-border/50';
  };

  return (
    <article
      className={cn(
        'group flex items-center gap-4 p-4 rounded-xl',
        'bg-background/30 backdrop-blur-sm',
        'border border-border/20',
        'transition-all duration-200 hover:bg-background/50 hover:border-border/40'
      )}
    >
      {/* Logo/Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-lg">
        {icon || '📦'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>

      {/* Countdown Badge */}
      <div
        className={cn(
          'flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium border',
          getUrgencyStyles()
        )}
      >
        {daysUntil === 0 ? 'Heute' : daysUntil === 1 ? 'Morgen' : `${daysUntil}d`}
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <p className="font-semibold text-foreground">{amount.toFixed(2)}€</p>
      </div>
    </article>
  );
};
