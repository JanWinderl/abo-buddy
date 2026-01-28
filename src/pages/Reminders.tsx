import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RemindersSidebar } from '@/components/reminders/RemindersSidebar';
import { ReminderArticleCard } from '@/components/reminders/ReminderArticleCard';
import { ReminderTimeGroup } from '@/components/reminders/ReminderTimeGroup';
import { RemindersEmptyState } from '@/components/reminders/RemindersEmptyState';
import { Button } from '@/components/ui/button';
import { mockReminders, mockSubscriptions } from '@/data/mockSubscriptions';
import { Reminder } from '@/types/subscription';
import { Plus, Bell, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { differenceInDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | 'urgent' | 'upcoming' | 'archived';

/**
 * Smart Component: Erinnerungen-Seite
 * Verarbeitet Status-Logik und orchestriert Dumb Components
 */
export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Helper functions
  const getDaysUntil = (dateString: string) =>
    differenceInDays(parseISO(dateString), new Date());

  const getUrgencyLevel = (days: number) => {
    if (days < 0) return 'past' as const;
    if (days <= 3) return 'urgent' as const;
    if (days <= 7) return 'soon' as const;
    return 'later' as const;
  };

  const getSubscriptionForReminder = (subscriptionId: string) =>
    mockSubscriptions.find((s) => s.id === subscriptionId);

  // Handlers
  const handleToggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    const reminder = reminders.find((r) => r.id === id);
    toast.success(
      reminder?.isActive ? 'Erinnerung deaktiviert' : 'Erinnerung aktiviert',
      { duration: 2000 }
    );
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    toast.success('Erinnerung als erledigt markiert', {
      icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
      duration: 2000,
    });
  };

  const handleEdit = (id: string) => {
    toast.info('Bearbeiten-Funktion kommt bald', { duration: 2000 });
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast.success('Erinnerung gelöscht', { duration: 2000 });
  };

  // Computed values
  const counts = useMemo(() => {
    const active = reminders.filter(
      (r) => r.isActive && !dismissedIds.includes(r.id)
    );
    return {
      all: active.length,
      urgent: active.filter((r) => getUrgencyLevel(getDaysUntil(r.reminderDate)) === 'urgent').length,
      upcoming: active.filter((r) => getUrgencyLevel(getDaysUntil(r.reminderDate)) === 'soon').length,
      archived: dismissedIds.length,
    };
  }, [reminders, dismissedIds]);

  // Filter reminders based on selected status
  const filteredReminders = useMemo(() => {
    let result = reminders;

    switch (selectedStatus) {
      case 'urgent':
        result = reminders.filter(
          (r) =>
            r.isActive &&
            !dismissedIds.includes(r.id) &&
            getUrgencyLevel(getDaysUntil(r.reminderDate)) === 'urgent'
        );
        break;
      case 'upcoming':
        result = reminders.filter(
          (r) =>
            r.isActive &&
            !dismissedIds.includes(r.id) &&
            getUrgencyLevel(getDaysUntil(r.reminderDate)) === 'soon'
        );
        break;
      case 'archived':
        result = reminders.filter((r) => dismissedIds.includes(r.id));
        break;
      default:
        result = reminders.filter(
          (r) => r.isActive && !dismissedIds.includes(r.id)
        );
    }

    return result.sort(
      (a, b) => getDaysUntil(a.reminderDate) - getDaysUntil(b.reminderDate)
    );
  }, [reminders, dismissedIds, selectedStatus]);

  // Group reminders by urgency
  const groupedReminders = useMemo(() => {
    const groups = {
      urgent: [] as typeof filteredReminders,
      soon: [] as typeof filteredReminders,
      later: [] as typeof filteredReminders,
    };

    filteredReminders.forEach((reminder) => {
      const urgency = getUrgencyLevel(getDaysUntil(reminder.reminderDate));
      if (urgency === 'urgent') groups.urgent.push(reminder);
      else if (urgency === 'soon') groups.soon.push(reminder);
      else groups.later.push(reminder);
    });

    return groups;
  }, [filteredReminders]);

  const hasReminders = filteredReminders.length > 0;

  return (
    <Layout>
      <main className="container py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Erinnerungen</h1>
            <p className="text-muted-foreground mt-1">
              Verpasse keine wichtigen Termine und Fristen
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neue Erinnerung
          </Button>
        </header>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <RemindersSidebar
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            emailNotifications={emailNotifications}
            onEmailNotificationsChange={setEmailNotifications}
            pushNotifications={pushNotifications}
            onPushNotificationsChange={setPushNotifications}
            counts={counts}
          />

          {/* Main Content - Priority Feed */}
          <div className="flex-1 space-y-6">
            {!hasReminders ? (
              <RemindersEmptyState
                filter={selectedStatus}
                onResetFilter={() => setSelectedStatus('all')}
              />
            ) : selectedStatus === 'archived' ? (
              // Archived view - flat list
              <section className="space-y-3">
                {filteredReminders.map((reminder) => {
                  const subscription = getSubscriptionForReminder(reminder.subscriptionId);
                  const daysUntil = getDaysUntil(reminder.reminderDate);

                  return (
                    <ReminderArticleCard
                      key={reminder.id}
                      id={reminder.id}
                      message={reminder.message}
                      reminderDate={reminder.reminderDate}
                      daysUntil={daysUntil}
                      urgency={getUrgencyLevel(daysUntil)}
                      type={reminder.type}
                      isActive={false}
                      subscriptionName={subscription?.name}
                      subscriptionIcon={subscription?.icon}
                      subscriptionPrice={subscription?.price}
                      onToggle={handleToggle}
                      onDismiss={handleDismiss}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </section>
            ) : (
              // Grouped view by urgency
              <>
                {/* Urgent */}
                {groupedReminders.urgent.length > 0 && (
                  <ReminderTimeGroup
                    title="Dringend"
                    count={groupedReminders.urgent.length}
                    variant="urgent"
                  >
                    {groupedReminders.urgent.map((reminder) => {
                      const subscription = getSubscriptionForReminder(reminder.subscriptionId);
                      const daysUntil = getDaysUntil(reminder.reminderDate);

                      return (
                        <ReminderArticleCard
                          key={reminder.id}
                          id={reminder.id}
                          message={reminder.message}
                          reminderDate={reminder.reminderDate}
                          daysUntil={daysUntil}
                          urgency="urgent"
                          type={reminder.type}
                          isActive={reminder.isActive}
                          subscriptionName={subscription?.name}
                          subscriptionIcon={subscription?.icon}
                          subscriptionPrice={subscription?.price}
                          onToggle={handleToggle}
                          onDismiss={handleDismiss}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      );
                    })}
                  </ReminderTimeGroup>
                )}

                {/* Soon (This Week) */}
                {groupedReminders.soon.length > 0 && (
                  <ReminderTimeGroup
                    title="Diese Woche"
                    count={groupedReminders.soon.length}
                    variant="soon"
                  >
                    {groupedReminders.soon.map((reminder) => {
                      const subscription = getSubscriptionForReminder(reminder.subscriptionId);
                      const daysUntil = getDaysUntil(reminder.reminderDate);

                      return (
                        <ReminderArticleCard
                          key={reminder.id}
                          id={reminder.id}
                          message={reminder.message}
                          reminderDate={reminder.reminderDate}
                          daysUntil={daysUntil}
                          urgency="soon"
                          type={reminder.type}
                          isActive={reminder.isActive}
                          subscriptionName={subscription?.name}
                          subscriptionIcon={subscription?.icon}
                          subscriptionPrice={subscription?.price}
                          onToggle={handleToggle}
                          onDismiss={handleDismiss}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      );
                    })}
                  </ReminderTimeGroup>
                )}

                {/* Later */}
                {groupedReminders.later.length > 0 && (
                  <ReminderTimeGroup
                    title="Später"
                    count={groupedReminders.later.length}
                    variant="later"
                  >
                    {groupedReminders.later.map((reminder) => {
                      const subscription = getSubscriptionForReminder(reminder.subscriptionId);
                      const daysUntil = getDaysUntil(reminder.reminderDate);

                      return (
                        <ReminderArticleCard
                          key={reminder.id}
                          id={reminder.id}
                          message={reminder.message}
                          reminderDate={reminder.reminderDate}
                          daysUntil={daysUntil}
                          urgency="later"
                          type={reminder.type}
                          isActive={reminder.isActive}
                          subscriptionName={subscription?.name}
                          subscriptionIcon={subscription?.icon}
                          subscriptionPrice={subscription?.price}
                          onToggle={handleToggle}
                          onDismiss={handleDismiss}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      );
                    })}
                  </ReminderTimeGroup>
                )}
              </>
            )}

            {/* Info Card */}
            {hasReminders && (
              <section
                className={cn(
                  'rounded-2xl p-6',
                  'bg-gradient-to-br from-primary/5 via-card/50 to-accent/5',
                  'border border-border/30'
                )}
              >
                <header className="flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">So funktionieren Erinnerungen</h3>
                </header>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Automatische Generierung aus deinen Abo-Daten
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Kündigungsfristen werden 7 Tage vorher markiert
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Aktivieren/Deaktivieren mit einem Klick
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Premium: E-Mail-Benachrichtigungen verfügbar
                  </li>
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
