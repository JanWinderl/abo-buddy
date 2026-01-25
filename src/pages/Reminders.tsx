import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { mockReminders, mockSubscriptions } from '@/data/mockSubscriptions';
import { Reminder } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellOff, CalendarClock, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
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

  // Categorize active reminders by urgency
  const urgentReminders = activeReminders.filter((r) => {
    const days = Math.ceil(
      (new Date(r.reminderDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days >= 0 && days <= 3;
  });

  const thisWeekReminders = activeReminders.filter((r) => {
    const days = Math.ceil(
      (new Date(r.reminderDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days > 3 && days <= 7;
  });

  const laterReminders = activeReminders.filter((r) => {
    const days = Math.ceil(
      (new Date(r.reminderDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days > 7;
  });

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
          <Button size="lg">
            <Bell className="mr-2 h-5 w-5" />
            Neue Erinnerung
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeReminders.length}</p>
                  <p className="text-xs text-muted-foreground">Aktiv</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${urgentReminders.length > 0 ? 'from-destructive/10 to-destructive/5 border-destructive/20' : 'from-muted/50 to-muted/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${urgentReminders.length > 0 ? 'bg-destructive/20' : 'bg-muted'}`}>
                  <AlertTriangle className={`h-5 w-5 ${urgentReminders.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{urgentReminders.length}</p>
                  <p className="text-xs text-muted-foreground">Dringend</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <CalendarClock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{thisWeekReminders.length}</p>
                  <p className="text-xs text-muted-foreground">Diese Woche</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dismissedIds.length}</p>
                  <p className="text-xs text-muted-foreground">Erledigt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Aktiv
              <Badge variant="secondary" className="ml-1">{activeReminders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <BellOff className="h-4 w-4" />
              Inaktiv
              <Badge variant="outline" className="ml-1">{inactiveReminders.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeReminders.length > 0 ? (
              <>
                {/* Urgent Section */}
                {urgentReminders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <h2 className="text-lg font-semibold text-foreground">Dringend (nächste 3 Tage)</h2>
                      <Badge variant="destructive">{urgentReminders.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {urgentReminders.map((reminder) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          subscription={getSubscriptionForReminder(reminder.subscriptionId)}
                          onToggle={handleToggle}
                          onDismiss={handleDismiss}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* This Week Section */}
                {thisWeekReminders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarClock className="h-5 w-5 text-accent" />
                      <h2 className="text-lg font-semibold text-foreground">Diese Woche</h2>
                      <Badge variant="secondary">{thisWeekReminders.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {thisWeekReminders.map((reminder) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          subscription={getSubscriptionForReminder(reminder.subscriptionId)}
                          onToggle={handleToggle}
                          onDismiss={handleDismiss}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Later Section */}
                {laterReminders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-lg font-semibold text-foreground">Später</h2>
                      <Badge variant="outline">{laterReminders.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {laterReminders.map((reminder) => (
                        <ReminderCard
                          key={reminder.id}
                          reminder={reminder}
                          subscription={getSubscriptionForReminder(reminder.subscriptionId)}
                          onToggle={handleToggle}
                          onDismiss={handleDismiss}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <CheckCircle className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Alles erledigt!
                  </h3>
                  <p className="text-muted-foreground">
                    Du hast keine aktiven Erinnerungen.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {inactiveReminders.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
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
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">
                    Keine inaktiven Erinnerungen
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💡 So funktionieren Erinnerungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Erinnerungen werden automatisch aus deinen Abo-Daten generiert</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Kündigungsfristen werden 7 Tage vorher markiert</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Du kannst Erinnerungen jederzeit aktivieren oder deaktivieren</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Premium-Nutzer erhalten zusätzlich E-Mail-Benachrichtigungen</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
