import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockReminders, mockSubscriptions } from '@/data/mockSubscriptions';
import { Reminder } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Plus,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const handleToggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      toast.success(
        reminder.isActive ? 'Erinnerung deaktiviert' : 'Erinnerung aktiviert'
      );
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    toast.success('Erinnerung als erledigt markiert');
  };

  const getSubscriptionForReminder = (subscriptionId: string) => {
    return mockSubscriptions.find((s) => s.id === subscriptionId);
  };

  const getDaysUntil = (dateString: string) => {
    return differenceInDays(parseISO(dateString), new Date());
  };

  const getUrgencyLevel = (days: number) => {
    if (days < 0) return 'past';
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'soon';
    return 'later';
  };

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'active') return r.isActive && !dismissedIds.includes(r.id);
    if (filter === 'inactive') return !r.isActive || dismissedIds.includes(r.id);
    return !dismissedIds.includes(r.id);
  });

  const activeReminders = reminders.filter(
    (r) => r.isActive && !dismissedIds.includes(r.id)
  );

  const urgentCount = activeReminders.filter(
    (r) => getDaysUntil(r.reminderDate) >= 0 && getDaysUntil(r.reminderDate) <= 3
  ).length;

  const typeConfig = {
    cancellation: {
      icon: AlertTriangle,
      label: 'Kündigung',
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    renewal: {
      icon: CalendarClock,
      label: 'Verlängerung',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    price_change: {
      icon: Bell,
      label: 'Preisänderung',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  };

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Erinnerungen</h1>
              <p className="text-muted-foreground">
                Verpasse keine wichtigen Termine und Fristen
              </p>
            </div>
            <Button className="sm:w-auto w-full">
              <Plus className="mr-2 h-4 w-4" />
              Neue Erinnerung
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeReminders.length}</p>
                  <p className="text-xs text-muted-foreground">Aktiv</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "border-0 shadow-sm",
            urgentCount > 0 ? "bg-destructive/5" : "bg-card"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  urgentCount > 0 ? "bg-destructive/10" : "bg-muted"
                )}>
                  <AlertTriangle className={cn(
                    "h-5 w-5",
                    urgentCount > 0 ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{urgentCount}</p>
                  <p className="text-xs text-muted-foreground">Dringend</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {activeReminders.filter((r) => getDaysUntil(r.reminderDate) > 3 && getDaysUntil(r.reminderDate) <= 7).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Diese Woche</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dismissedIds.length}</p>
                  <p className="text-xs text-muted-foreground">Erledigt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Alle' },
              { key: 'active', label: 'Aktiv' },
              { key: 'inactive', label: 'Inaktiv' },
            ].map((item) => (
              <Button
                key={item.key}
                variant={filter === item.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(item.key as typeof filter)}
                className="h-8"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Reminders List */}
        {filteredReminders.length > 0 ? (
          <div className="space-y-3">
            {filteredReminders
              .sort((a, b) => getDaysUntil(a.reminderDate) - getDaysUntil(b.reminderDate))
              .map((reminder) => {
                const subscription = getSubscriptionForReminder(reminder.subscriptionId);
                const daysUntil = getDaysUntil(reminder.reminderDate);
                const urgency = getUrgencyLevel(daysUntil);
                const config = typeConfig[reminder.type];
                const TypeIcon = config.icon;

                return (
                  <Card
                    key={reminder.id}
                    className={cn(
                      "border-0 shadow-sm transition-all hover:shadow-md",
                      !reminder.isActive && "opacity-60",
                      urgency === 'urgent' && reminder.isActive && "ring-1 ring-destructive/20 bg-destructive/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          config.bg
                        )}>
                          <TypeIcon className={cn("h-6 w-6", config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground truncate">
                                {reminder.message}
                              </h3>
                              <Badge 
                                variant={urgency === 'urgent' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {config.label}
                              </Badge>
                              {urgency === 'urgent' && reminder.isActive && (
                                <Badge variant="destructive" className="text-xs animate-pulse">
                                  Dringend
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1.5">
                              <CalendarClock className="h-3.5 w-3.5" />
                              {format(parseISO(reminder.reminderDate), 'dd. MMMM yyyy', { locale: de })}
                            </span>
                            {daysUntil >= 0 && (
                              <span className={cn(
                                "font-medium",
                                urgency === 'urgent' && "text-destructive"
                              )}>
                                in {daysUntil} {daysUntil === 1 ? 'Tag' : 'Tagen'}
                              </span>
                            )}
                            {daysUntil < 0 && (
                              <span className="text-muted-foreground">
                                vor {Math.abs(daysUntil)} {Math.abs(daysUntil) === 1 ? 'Tag' : 'Tagen'}
                              </span>
                            )}
                          </div>

                          {subscription && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-lg">{subscription.icon}</span>
                              <span className="text-foreground font-medium">{subscription.name}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{subscription.price.toFixed(2)}€/Monat</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(reminder.id)}
                          >
                            {reminder.isActive ? (
                              <Bell className="h-4 w-4 text-primary" />
                            ) : (
                              <BellOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          
                          {reminder.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleDismiss(reminder.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Erledigt
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'active' ? 'Keine aktiven Erinnerungen' : 
                 filter === 'inactive' ? 'Keine inaktiven Erinnerungen' : 
                 'Alles erledigt!'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? 'Du hast keine ausstehenden Erinnerungen.'
                  : 'Ändere den Filter, um andere Erinnerungen zu sehen.'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Erinnerung erstellen
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              So funktionieren Erinnerungen
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Automatische Generierung aus deinen Abo-Daten</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Kündigungsfristen werden 7 Tage vorher markiert</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Aktivieren/Deaktivieren mit einem Klick</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Premium: E-Mail-Benachrichtigungen verfügbar</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
