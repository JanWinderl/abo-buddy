import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  Bell,
  BellOff,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type UrgencyLevel = 'past' | 'urgent' | 'soon' | 'later';
type ReminderType = 'cancellation' | 'renewal' | 'price_change';

interface ReminderArticleCardProps {
  id: string;
  message: string;
  reminderDate: string;
  daysUntil: number;
  urgency: UrgencyLevel;
  type: ReminderType;
  isActive: boolean;
  subscriptionName?: string;
  subscriptionIcon?: string;
  subscriptionPrice?: number;
  onToggle: (id: string) => void;
  onDismiss: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const typeConfig = {
  cancellation: {
    label: 'Kündigung',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-l-destructive',
  },
  renewal: {
    label: 'Verlängerung',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-l-primary',
  },
  price_change: {
    label: 'Preisänderung',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-l-warning',
  },
};

/**
 * Dumb Component: Einzelne Erinnerungs-Karte
 * Zeigt eine Erinnerung mit Aktionen und visueller Hierarchie
 */
export const ReminderArticleCard = ({
  id,
  message,
  reminderDate,
  daysUntil,
  urgency,
  type,
  isActive,
  subscriptionName,
  subscriptionIcon,
  subscriptionPrice,
  onToggle,
  onDismiss,
  onEdit,
  onDelete,
}: ReminderArticleCardProps) => {
  const config = typeConfig[type];
  const formattedDate = format(parseISO(reminderDate), 'dd. MMMM yyyy', { locale: de });

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-xl transition-all',
        'bg-card/50 backdrop-blur-sm',
        'border-l-4',
        config.border,
        !isActive && 'opacity-50',
        urgency === 'urgent' && isActive && 'animate-pulse-subtle ring-1 ring-destructive/20'
      )}
    >
      <div className="p-4 flex items-start gap-4">
        {/* Service Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl',
            config.bg
          )}
        >
          {subscriptionIcon || '📌'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground line-clamp-1">{message}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant="secondary" className={cn('text-xs', config.bg, config.color)}>
                {config.label}
              </Badge>
              {urgency === 'urgent' && isActive && (
                <Badge variant="destructive" className="text-xs">
                  Dringend
                </Badge>
              )}
            </div>
          </div>

          {/* Date with time element */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <time dateTime={reminderDate} className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formattedDate}
            </time>
            {daysUntil >= 0 ? (
              <span className={cn('font-medium', urgency === 'urgent' && 'text-destructive')}>
                {daysUntil === 0 ? 'Heute' : daysUntil === 1 ? 'Morgen' : `in ${daysUntil} Tagen`}
              </span>
            ) : (
              <span className="text-muted-foreground">
                vor {Math.abs(daysUntil)} {Math.abs(daysUntil) === 1 ? 'Tag' : 'Tagen'}
              </span>
            )}
          </div>

          {/* Subscription Info */}
          {subscriptionName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">{subscriptionName}</span>
              {subscriptionPrice !== undefined && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{subscriptionPrice.toFixed(2)}€</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggle(id)}
            title={isActive ? 'Deaktivieren' : 'Aktivieren'}
          >
            {isActive ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {isActive && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              onClick={() => onDismiss(id)}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Erledigt
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Edit className="h-4 w-4 mr-2" />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
};
