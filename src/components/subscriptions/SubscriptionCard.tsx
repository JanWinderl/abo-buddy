import { Subscription, BillingCycle } from '@/types/subscription';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const billingCycleLabels: Record<BillingCycle, string> = {
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
  quarterly: 'Vierteljährlich',
  yearly: 'Jährlich',
};

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  showActions?: boolean;
}

export const SubscriptionCard = ({
  subscription,
  onEdit,
  onDelete,
  onToggle,
  showActions = true,
}: SubscriptionCardProps) => {
  const daysUntilBilling = differenceInDays(
    parseISO(subscription.nextBillingDate),
    new Date()
  );

  const daysUntilCancellation = subscription.cancellationDeadline
    ? differenceInDays(parseISO(subscription.cancellationDeadline), new Date())
    : null;

  const isCancellationSoon = daysUntilCancellation !== null && daysUntilCancellation <= 7;

  return (
    <Card className={`transition-all hover:shadow-md ${!subscription.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: subscription.color + '20' }}
            >
              {subscription.icon || '📦'}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{subscription.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {subscription.category}
              </Badge>
            </div>
          </div>
          {showActions && onToggle && (
            <Switch
              checked={subscription.isActive}
              onCheckedChange={() => onToggle(subscription.id)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Price */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Preis</span>
            <span className="font-bold text-lg text-foreground">
              {subscription.price.toFixed(2)}€
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {billingCycleLabels[subscription.billingCycle]}
              </span>
            </span>
          </div>

          {/* Next Billing */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Nächste Zahlung
            </span>
            <span className="text-sm text-foreground">
              {format(parseISO(subscription.nextBillingDate), 'dd. MMM yyyy', { locale: de })}
              <span className="text-muted-foreground ml-1">
                ({daysUntilBilling} Tage)
              </span>
            </span>
          </div>

          {/* Cancellation Warning */}
          {subscription.cancellationDeadline && isCancellationSoon && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Kündigungsfrist in {daysUntilCancellation} Tagen!
              </span>
            </div>
          )}

          {/* Notes */}
          {subscription.notes && (
            <p className="text-sm text-muted-foreground italic">
              {subscription.notes}
            </p>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(subscription)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Bearbeiten
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onDelete(subscription.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
