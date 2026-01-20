import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { mockReminders, mockSubscriptions } from '@/data/mockSubscriptions';
import { Reminder } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, CalendarClock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

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

  const activeReminders = reminders.filter(
    (r) => r.isActive && !dismissedIds.includes(r.id)
  );
  const inactiveReminders = reminders.filter(
    (r) => !r.isActive || dismissedIds.includes(r.id)
  );

  const getSubscriptionForReminder = (subscriptionId: string) => {
    return mockSubscriptions.find((s) => s.id === subscriptionId);
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Erinnerungen</h1>
            <p className="text-muted-foreground">
              Verpasse keine Kündigungsfristen mehr
            </p>
          </div>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Neue Erinnerung
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Aktive Erinnerungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{activeReminders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Diese Woche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {activeReminders.filter((r) => {
                  const days = Math.ceil(
                    (new Date(r.reminderDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return days >= 0 && days <= 7;
                }).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Erledigt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{dismissedIds.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Aktiv ({activeReminders.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <BellOff className="h-4 w-4" />
              Inaktiv ({inactiveReminders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeReminders.length > 0 ? (
              <div className="space-y-4">
                {activeReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    subscription={getSubscriptionForReminder(reminder.subscriptionId)}
                    onToggle={handleToggle}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Alles erledigt!
                  </p>
                  <p className="text-muted-foreground">
                    Du hast keine aktiven Erinnerungen.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {inactiveReminders.length > 0 ? (
              <div className="space-y-4">
                {inactiveReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    subscription={getSubscriptionForReminder(reminder.subscriptionId)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Keine inaktiven Erinnerungen
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">
              💡 So funktionieren Erinnerungen
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Erinnerungen werden automatisch aus deinen Abo-Daten generiert</li>
              <li>• Kündigungsfristen werden 7 Tage vorher markiert</li>
              <li>• Du kannst Erinnerungen jederzeit aktivieren oder deaktivieren</li>
              <li>• Premium-Nutzer erhalten zusätzlich E-Mail-Benachrichtigungen</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
