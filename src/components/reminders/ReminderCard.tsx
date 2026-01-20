import { Reminder, Subscription } from '@/types/subscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

const typeConfig = {
  cancellation: {
    icon: AlertTriangle,
    label: 'Kündigung',
    color: 'destructive' as const,
  },
  renewal: {
    icon: RefreshCw,
    label: 'Verlängerung',
    color: 'secondary' as const,
  },
  price_change: {
    icon: DollarSign,
    label: 'Preisänderung',
    color: 'default' as const,
  },
};

interface ReminderCardProps {
  reminder: Reminder;
  subscription?: Subscription;
  onToggle?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const ReminderCard = ({
  reminder,
  subscription,
  onToggle,
  onDismiss,
}: ReminderCardProps) => {
  const config = typeConfig[reminder.type];
  const Icon = config.icon;
  const daysUntil = differenceInDays(parseISO(reminder.reminderDate), new Date());
  const isUrgent = daysUntil <= 3;

  return (
    <Card className={`transition-all ${isUrgent ? 'border-destructive' : ''} ${!reminder.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${isUrgent ? 'bg-destructive/10' : 'bg-primary/10'}`}>
            <Icon className={`h-5 w-5 ${isUrgent ? 'text-destructive' : 'text-primary'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={config.color}>{config.label}</Badge>
              {isUrgent && <Badge variant="destructive">Dringend!</Badge>}
            </div>
            <h3 className="font-semibold text-foreground">{reminder.message}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {format(parseISO(reminder.reminderDate), 'EEEE, dd. MMMM yyyy', { locale: de })}
              {daysUntil >= 0 && (
                <span className="ml-2">
                  (in {daysUntil} {daysUntil === 1 ? 'Tag' : 'Tagen'})
                </span>
              )}
            </p>
            {subscription && (
              <p className="text-sm text-muted-foreground mt-1">
                {subscription.icon} {subscription.name} - {subscription.price.toFixed(2)}€
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {onToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggle(reminder.id)}
              >
                {reminder.isActive ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(reminder.id)}
              >
                Erledigt
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
