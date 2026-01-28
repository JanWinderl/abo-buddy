import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Clock,
  Archive,
  Bell,
  BellRing,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | 'urgent' | 'upcoming' | 'archived';

interface RemindersSidebarProps {
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  emailNotifications: boolean;
  onEmailNotificationsChange: (enabled: boolean) => void;
  pushNotifications: boolean;
  onPushNotificationsChange: (enabled: boolean) => void;
  counts: {
    all: number;
    urgent: number;
    upcoming: number;
    archived: number;
  };
  className?: string;
}

/**
 * Dumb Component: Sidebar für Erinnerungs-Filter
 * Schnellfilter für Status und Benachrichtigungseinstellungen
 */
export const RemindersSidebar = ({
  selectedStatus,
  onStatusChange,
  emailNotifications,
  onEmailNotificationsChange,
  pushNotifications,
  onPushNotificationsChange,
  counts,
  className,
}: RemindersSidebarProps) => {
  const statusFilters = [
    { 
      key: 'urgent' as const, 
      label: 'Dringend', 
      icon: AlertTriangle, 
      color: 'text-destructive',
      bgActive: 'bg-destructive/10',
    },
    { 
      key: 'upcoming' as const, 
      label: 'Demnächst', 
      icon: Clock, 
      color: 'text-primary',
      bgActive: 'bg-primary/10',
    },
    { 
      key: 'archived' as const, 
      label: 'Archiviert', 
      icon: Archive, 
      color: 'text-muted-foreground',
      bgActive: 'bg-muted',
    },
  ];

  return (
    <aside className={cn('w-full lg:w-56 flex-shrink-0 space-y-6', className)}>
      {/* Status Filters */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Status
        </h2>
        <nav className="space-y-1">
          <Button
            variant={selectedStatus === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onStatusChange('all')}
            className="w-full justify-between h-10"
          >
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alle
            </span>
            <Badge variant="secondary" className="text-xs">
              {counts.all}
            </Badge>
          </Button>

          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={selectedStatus === filter.key ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onStatusChange(filter.key)}
              className={cn(
                'w-full justify-between h-10',
                selectedStatus === filter.key && filter.bgActive
              )}
            >
              <span className={cn('flex items-center gap-2', filter.color)}>
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </span>
              <Badge
                variant={filter.key === 'urgent' && counts.urgent > 0 ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {counts[filter.key]}
              </Badge>
            </Button>
          ))}
        </nav>
      </section>

      {/* Notification Settings */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Benachrichtigungen
        </h2>
        <div className="space-y-3">
          <label
            className={cn(
              'flex items-center justify-between p-3 rounded-xl cursor-pointer',
              'bg-card/50 border border-border/30',
              'transition-colors hover:bg-card'
            )}
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
              E-Mail
            </span>
            <Switch
              checked={emailNotifications}
              onCheckedChange={onEmailNotificationsChange}
            />
          </label>

          <label
            className={cn(
              'flex items-center justify-between p-3 rounded-xl cursor-pointer',
              'bg-card/50 border border-border/30',
              'transition-colors hover:bg-card'
            )}
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              <BellRing className="h-4 w-4 text-muted-foreground" />
              Push
            </span>
            <Switch
              checked={pushNotifications}
              onCheckedChange={onPushNotificationsChange}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Premium-Feature: Erhalte Benachrichtigungen vor wichtigen Fristen.
        </p>
      </section>
    </aside>
  );
};
