import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { RemindersSidebar } from '@/components/reminders/RemindersSidebar';
import { ReminderArticleCard } from '@/components/reminders/ReminderArticleCard';
import { ReminderTimeGroup } from '@/components/reminders/ReminderTimeGroup';
import { RemindersEmptyState } from '@/components/reminders/RemindersEmptyState';
import { NotificationSettings } from '@/components/reminders/NotificationSettings';
import { GamificationBadges } from '@/components/reminders/GamificationBadges';
import { SnoozeButton } from '@/components/reminders/SnoozeButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockReminders, mockSubscriptions } from '@/data/mockSubscriptions';
import { Reminder } from '@/types/subscription';
import { Plus, Bell, CheckCircle2, Clock, History, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { differenceInDays, parseISO, addDays, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';

type FilterStatus = 'all' | 'urgent' | 'upcoming' | 'archived';
type TabValue = 'active' | 'completed' | 'settings';

/**
 * Smart Component: Erweiterte Erinnerungen-Seite
 */
export default function Reminders() {
  const { addSubscription } = useSubscriptions();
  const { currentRole } = useRole();
  const isPremium = currentRole === 'premium' || currentRole === 'admin';

  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [snoozedReminders, setSnoozedReminders] = useState<Record<string, string>>({});
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [activeTab, setActiveTab] = useState<TabValue>('active');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [daysBefore, setDaysBefore] = useState(7);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

  // Gamification Stats (simulated)
  const [streakDays] = useState(12);
  const [totalSaved] = useState(247);
  const [cancelledOnTime] = useState(8);

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

  const handleSnooze = (id: string, days: number) => {
    const newDate = addDays(new Date(), days).toISOString();
    setSnoozedReminders((prev) => ({ ...prev, [id]: newDate }));
    toast.success(`Erinnerung auf ${format(addDays(new Date(), days), 'dd. MMM', { locale: de })} verschoben`, {
      icon: <Clock className="h-4 w-4 text-primary" />,
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

  const handleCancel = (id: string) => {
    toast.info('Kündigungs-Assistent wird geöffnet...', { duration: 2000 });
  };

  const handleExtend = (id: string) => {
    handleDismiss(id);
    toast.success('Als verlängert markiert', { duration: 2000 });
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

  // Completed reminders
  const completedReminders = useMemo(() => {
    return reminders.filter((r) => dismissedIds.includes(r.id));
  }, [reminders, dismissedIds]);

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
      <main className="container py-8 pb-24 lg:pb-8">
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

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Gamification Badges */}
            <GamificationBadges
              streakDays={streakDays}
              totalSaved={totalSaved}
              cancelledOnTime={cancelledOnTime}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="active" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Aktiv
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <History className="h-4 w-4" />
                  Erledigt
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Einstellungen
                </TabsTrigger>
              </TabsList>

              {/* Active Reminders Tab */}
              <TabsContent value="active" className="mt-6 space-y-6">
                {!hasReminders ? (
                  <RemindersEmptyState
                    filter={selectedStatus}
                    onResetFilter={() => setSelectedStatus('all')}
                  />
                ) : selectedStatus === 'archived' ? (
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
              </TabsContent>

              {/* Completed Reminders Tab */}
              <TabsContent value="completed" className="mt-6 space-y-6">
                {completedReminders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Keine erledigten Erinnerungen
                    </h3>
                    <p className="text-muted-foreground">
                      Erledigte Erinnerungen werden hier angezeigt
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Erinnerungsverlauf
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {completedReminders.length} erledigt
                      </span>
                    </div>
                    {completedReminders.map((reminder) => {
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
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <NotificationSettings
                  emailEnabled={emailNotifications}
                  onEmailChange={setEmailNotifications}
                  pushEnabled={pushNotifications}
                  onPushChange={setPushNotifications}
                  smsEnabled={smsNotifications}
                  onSmsChange={setSmsNotifications}
                  daysBefore={daysBefore}
                  onDaysBeforeChange={setDaysBefore}
                  quietHoursStart={quietHoursStart}
                  quietHoursEnd={quietHoursEnd}
                  onQuietHoursChange={(start, end) => {
                    setQuietHoursStart(start);
                    setQuietHoursEnd(end);
                  }}
                  isPremium={isPremium}
                />
              </TabsContent>
            </Tabs>

            {/* Info Card */}
            {hasReminders && activeTab === 'active' && (
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
                    Kündigungsfristen werden {daysBefore} Tage vorher markiert
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Snooze-Funktion für flexible Erinnerungen
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Premium: E-Mail & SMS-Benachrichtigungen
                  </li>
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onAddSubscription={(data) => addSubscription({ ...data, userId: '1' })} />
    </Layout>
  );
}
