import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SubscriptionFilterBar, ViewMode, StatusFilter, SortOption } from '@/components/subscriptions/SubscriptionFilterBar';
import { EnhancedSubscriptionCard } from '@/components/subscriptions/EnhancedSubscriptionCard';
import { SubscriptionListItem } from '@/components/subscriptions/SubscriptionListItem';
import { BulkActionsBar } from '@/components/subscriptions/BulkActionsBar';
import { SubscriptionsEmptyState } from '@/components/subscriptions/SubscriptionsEmptyState';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Subscription, SubscriptionCategory } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, CreditCard, TrendingUp, AlertCircle, Euro } from 'lucide-react';
import { toast } from 'sonner';
import { parseISO, differenceInDays } from 'date-fns';

export default function Subscriptions() {
  const {
    subscriptions,
    activeSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscription,
    costAnalysis,
  } = useSubscriptions();
  const { currentRole } = useRole();

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SubscriptionCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('expensive');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const showBulkActions = selectedIds.length > 0;

  // Handlers
  const handleAdd = () => {
    setEditingSubscription(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (subscription: Subscription) => {
    if (currentRole === 'user') {
      toast.error('Bearbeiten erfordert Premium-Zugang');
      return;
    }
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (currentRole === 'user') {
      toast.error('Löschen erfordert Premium-Zugang');
      return;
    }
    deleteSubscription(id);
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success('Abonnement gelöscht');
  };

  const handleShare = (id: string) => {
    toast.info('Teilen-Funktion kommt bald');
  };

  const handleFormSubmit = (data: any) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, data);
      toast.success('Abonnement aktualisiert');
    } else {
      addSubscription({ ...data, userId: '1' });
      toast.success('Abonnement hinzugefügt');
    }
    setIsFormOpen(false);
    setEditingSubscription(undefined);
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((sid) => sid !== id)
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredSubscriptions.map((s) => s.id));
  };

  const handleBulkDelete = () => {
    if (currentRole === 'user') {
      toast.error('Löschen erfordert Premium-Zugang');
      return;
    }
    selectedIds.forEach((id) => deleteSubscription(id));
    toast.success(`${selectedIds.length} Abonnements gelöscht`);
    setSelectedIds([]);
  };

  const handleBulkChangeCategory = () => {
    toast.info('Kategorie ändern kommt bald');
  };

  const handleCancelBulk = () => {
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortOption('expensive');
  };

  // Compute monthly cost for sorting
  const getMonthlyPrice = (sub: Subscription) => {
    switch (sub.billingCycle) {
      case 'weekly': return sub.price * 4.33;
      case 'monthly': return sub.price;
      case 'quarterly': return sub.price / 3;
      case 'yearly': return sub.price / 12;
      default: return sub.price;
    }
  };

  // Filter and Sort
  const filteredSubscriptions = useMemo(() => {
    let result = subscriptions.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && sub.isActive) ||
        (statusFilter === 'inactive' && !sub.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    switch (sortOption) {
      case 'expensive':
        result.sort((a, b) => getMonthlyPrice(b) - getMonthlyPrice(a));
        break;
      case 'cheapest':
        result.sort((a, b) => getMonthlyPrice(a) - getMonthlyPrice(b));
        break;
      case 'nextPayment':
        result.sort(
          (a, b) =>
            differenceInDays(parseISO(a.nextBillingDate), new Date()) -
            differenceInDays(parseISO(b.nextBillingDate), new Date())
        );
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [subscriptions, searchQuery, categoryFilter, statusFilter, sortOption]);

  // Get upcoming renewals (within 7 days)
  const upcomingRenewals = activeSubscriptions.filter((sub) => {
    const daysUntil = differenceInDays(parseISO(sub.nextBillingDate), new Date());
    return daysUntil >= 0 && daysUntil <= 7;
  });

  const hasSubscriptions = subscriptions.length > 0;
  const hasFilteredResults = filteredSubscriptions.length > 0;

  return (
    <Layout>
      <div className="container py-8 space-y-6 pb-24 lg:pb-8">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meine Abonnements</h1>
            <p className="text-muted-foreground mt-1">
              Verwalte und organisiere alle deine Abonnements
            </p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2 hidden lg:flex">
            <Plus className="h-5 w-5" />
            Neues Abo hinzufügen
          </Button>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeSubscriptions.length}</p>
                  <p className="text-xs text-muted-foreground">Aktive Abos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Euro className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{costAnalysis.totalMonthly.toFixed(0)}€</p>
                  <p className="text-xs text-muted-foreground">Pro Monat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <TrendingUp className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{costAnalysis.totalYearly.toFixed(0)}€</p>
                  <p className="text-xs text-muted-foreground">Pro Jahr</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${upcomingRenewals.length > 0 ? 'border-l-destructive' : 'border-l-muted'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${upcomingRenewals.length > 0 ? 'bg-destructive/10' : 'bg-muted'}`}>
                  <AlertCircle className={`h-5 w-5 ${upcomingRenewals.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcomingRenewals.length}</p>
                  <p className="text-xs text-muted-foreground">Bald fällig</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <SubscriptionFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={subscriptions.length}
          filteredCount={filteredSubscriptions.length}
        />

        {/* Subscriptions Display */}
        {!hasSubscriptions ? (
          <SubscriptionsEmptyState type="no-subscriptions" onAddFirst={handleAdd} />
        ) : !hasFilteredResults ? (
          <SubscriptionsEmptyState
            type="no-results"
            onAddFirst={handleAdd}
            onResetFilters={handleResetFilters}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSubscriptions.map((sub) => (
              <EnhancedSubscriptionCard
                key={sub.id}
                subscription={sub}
                isSelected={selectedIds.includes(sub.id)}
                showCheckbox={showBulkActions}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0 divide-y divide-border/30">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionListItem
                  key={sub.id}
                  subscription={sub}
                  isSelected={selectedIds.includes(sub.id)}
                  showCheckbox={showBulkActions}
                  onSelect={handleSelect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onDelete={handleBulkDelete}
          onChangeCategory={handleBulkChangeCategory}
          onCancel={handleCancelBulk}
          onSelectAll={handleSelectAll}
          totalCount={filteredSubscriptions.length}
        />

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSubscription ? 'Abonnement bearbeiten' : 'Neues Abonnement'}
              </DialogTitle>
            </DialogHeader>
            <SubscriptionForm
              subscription={editingSubscription}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onAddSubscription={(data) => addSubscription({ ...data, userId: '1' })} />
    </Layout>
  );
}
