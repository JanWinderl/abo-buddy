import { useState } from 'react';
import { Subscription, BillingCycle, SubscriptionCategory } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Trash2, Share2, Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const billingCycleLabels: Record<BillingCycle, string> = {
  weekly: 'Woche',
  monthly: 'Monat',
  quarterly: 'Quartal',
  yearly: 'Jahr',
};

const categoryConfig: Record<SubscriptionCategory, { color: string; icon: string; label: string }> = {
  streaming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '🎬', label: 'Streaming' },
  software: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '💻', label: 'Software' },
  fitness: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '💪', label: 'Fitness' },
  cloud: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '☁️', label: 'Cloud' },
  gaming: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🎮', label: 'Gaming' },
  news: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: '📰', label: 'News' },
  other: { color: 'bg-muted text-muted-foreground border-border', icon: '📦', label: 'Sonstiges' },
};

interface EnhancedSubscriptionCardProps {
  subscription: Subscription;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

/**
 * Dumb Component: Verbesserte Abo-Karte mit Hover-Actions, Status-Badges, Category-Chips
 */
export const EnhancedSubscriptionCard = ({
  subscription,
  isSelected = false,
  showCheckbox = false,
  onSelect,
  onEdit,
  onDelete,
  onShare,
}: EnhancedSubscriptionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const daysUntilBilling = differenceInDays(
    parseISO(subscription.nextBillingDate),
    new Date()
  );

  const daysUntilCancellation = subscription.cancellationDeadline
    ? differenceInDays(parseISO(subscription.cancellationDeadline), new Date())
    : null;

  const isCancellationCritical = daysUntilCancellation !== null && daysUntilCancellation <= 0;
  const isCancellationSoon = daysUntilCancellation !== null && daysUntilCancellation <= 7 && daysUntilCancellation > 0;
  const isBillingSoon = daysUntilBilling >= 0 && daysUntilBilling <= 3;

  const categoryInfo = categoryConfig[subscription.category];

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-300',
        'bg-card/50 backdrop-blur-sm',
        'border border-border/30 hover:border-border/60',
        'hover:shadow-lg hover:shadow-primary/5',
        !subscription.isActive && 'opacity-60',
        isSelected && 'ring-2 ring-primary'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      {(showCheckbox || isHovered) && (
        <div
          className={cn(
            'absolute top-3 left-3 z-10 transition-opacity duration-200',
            showCheckbox ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(subscription.id, checked as boolean)}
            className="bg-background/80"
          />
        </div>
      )}

      {/* Quick Actions on Hover */}
      <div
        className={cn(
          'absolute top-3 right-3 z-10 flex gap-1 transition-all duration-200',
          'opacity-0 group-hover:opacity-100 translate-y-[-4px] group-hover:translate-y-0'
        )}
      >
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-background"
            onClick={() => onEdit(subscription)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onShare && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-background"
            onClick={() => onShare(subscription.id)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onDelete(subscription.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-5">
        {/* Header with Icon and Name */}
        <header className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: (subscription.color || '#6366f1') + '15' }}
          >
            {subscription.icon || '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg truncate">
              {subscription.name}
            </h3>
            {/* Category Chip */}
            <Badge
              variant="outline"
              className={cn('mt-1.5 gap-1', categoryInfo.color)}
            >
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </Badge>
          </div>
        </header>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Active Status */}
          {subscription.isActive ? (
            <Badge variant="outline" className="gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Aktiv
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              Inaktiv
            </Badge>
          )}

          {/* Cancellation Critical Alert */}
          {isCancellationCritical && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertTriangle className="h-3 w-3" />
              Kündigungsfrist in {daysUntilCancellation} Tagen!
            </Badge>
          )}

          {/* Cancellation Soon Warning */}
          {isCancellationSoon && (
            <Badge className="gap-1 bg-orange-500/20 text-orange-400 border-orange-500/30">
              <AlertTriangle className="h-3 w-3" />
              Kündigung in {daysUntilCancellation} Tagen
            </Badge>
          )}

          {/* Billing Soon */}
          {isBillingSoon && !isCancellationCritical && !isCancellationSoon && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
              Bald fällig
            </Badge>
          )}
        </div>

        {/* Cost Display */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-foreground">
            {subscription.price.toFixed(2)}€
          </p>
          <p className="text-sm text-muted-foreground">
            pro {billingCycleLabels[subscription.billingCycle]}
          </p>
        </div>

        {/* Next Billing Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Nächste Zahlung:{' '}
            <span className="text-foreground">
              {format(parseISO(subscription.nextBillingDate), 'dd. MMM yyyy', { locale: de })}
            </span>
            <span className="ml-1 text-xs">
              ({daysUntilBilling >= 0 ? `in ${daysUntilBilling} Tagen` : 'überfällig'})
            </span>
          </span>
        </div>

        {/* Notes */}
        {subscription.notes && (
          <p className="mt-3 text-sm text-muted-foreground italic line-clamp-2">
            {subscription.notes}
          </p>
        )}
      </div>
    </article>
  );
};
