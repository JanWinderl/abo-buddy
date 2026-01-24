import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'inactive' | 'pending' | 'cancelled' | 'warning' | 'error' | 'success';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Aktiv', variant: 'default' },
  inactive: { label: 'Inaktiv', variant: 'secondary' },
  pending: { label: 'Ausstehend', variant: 'outline' },
  cancelled: { label: 'Gekündigt', variant: 'destructive' },
  warning: { label: 'Warnung', variant: 'outline' },
  error: { label: 'Fehler', variant: 'destructive' },
  success: { label: 'Erfolgreich', variant: 'default' },
};

/**
 * Wiederverwendbare Status-Badge Komponente
 * Dumb Component - erhält alle Daten über Props
 * Wird für Abo-Status, Erinnerungen und Admin-Bereich verwendet
 */
export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn('', className)}>
      {label || config.label}
    </Badge>
  );
};
