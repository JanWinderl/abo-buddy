import { Subscription, BillingCycle, SubscriptionCategory } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Trash2, Share2, Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const billingCycleLabels: Record<BillingCycle, string> = {
  weekly: 'wöchentlich',
  monthly: 'monatlich',
  quarterly: 'vierteljährlich',
  yearly: 'jährlich',
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

interface SubscriptionListItemProps {
  subscription: Subscription;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

/**
 * Dumb Component: Kompakte Listenansicht für Abonnement
 */
export const SubscriptionListItem = ({
  subscription,
  isSelected = false,
  showCheckbox = false,
  onSelect,
  onEdit,
  onDelete,
  onShare,
}: SubscriptionListItemProps) => {
  const daysUntilBilling = differenceInDays(
    parseISO(subscription.nextBillingDate),
    new Date()
  );

  const daysUntilCancellation = subscription.cancellationDeadline
    ? differenceInDays(parseISO(subscription.cancellationDeadline), new Date())
    : null;

  const isCancellationCritical = daysUntilCancellation !== null && daysUntilCancellation <= 0;
  const isCancellationSoon = daysUntilCancellation !== null && daysUntilCancellation <= 7 && daysUntilCancellation > 0;

  const categoryInfo = categoryConfig[subscription.category];

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-4 transition-colors',
        'hover:bg-muted/30',
        !subscription.isActive && 'opacity-60',
        isSelected && 'bg-primary/5'
      )}
    >
      {/* Checkbox */}
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect?.(subscription.id, checked as boolean)}
        />
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: (subscription.color || '#6366f1') + '15' }}
      >
        {subscription.icon || '📦'}
      </div>

      {/* Name & Category */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{subscription.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={cn('text-xs gap-1', categoryInfo.color)}>
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </Badge>
          {subscription.isActive ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Aktiv
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Inaktiv</span>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="hidden sm:flex items-center gap-2">
        {isCancellationCritical && (
          <Badge variant="destructive" className="gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" />
            {daysUntilCancellation} Tage
          </Badge>
        )}
        {isCancellationSoon && (
          <Badge className="gap-1 text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
            Kündigung in {daysUntilCancellation}d
          </Badge>
        )}
      </div>

      {/* Next Billing */}
      <div className="hidden md:block text-right min-w-[140px]">
        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
          <Calendar className="h-3 w-3" />
          {format(parseISO(subscription.nextBillingDate), 'dd.MM.yyyy', { locale: de })}
        </p>
        <p className="text-xs text-muted-foreground">
          {daysUntilBilling >= 0 ? `in ${daysUntilBilling} Tagen` : 'überfällig'}
        </p>
      </div>

      {/* Price */}
      <div className="text-right min-w-[100px]">
        <p className="font-bold text-foreground text-lg">{subscription.price.toFixed(2)}€</p>
        <p className="text-xs text-muted-foreground">{billingCycleLabels[subscription.billingCycle]}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(subscription)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onShare && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onShare(subscription.id)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onDelete(subscription.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
