import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Subscription, SubscriptionCategory } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, CreditCard, TrendingUp, AlertCircle, LayoutGrid, List, Calendar, Euro } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

const categoryOptions: { value: SubscriptionCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Alle Kategorien', icon: '📋' },
  { value: 'streaming', label: 'Streaming', icon: '🎬' },
  { value: 'software', label: 'Software', icon: '💻' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'cloud', label: 'Cloud', icon: '☁️' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'other', label: 'Sonstiges', icon: '📦' },
];

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'active' | 'inactive';

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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SubscriptionCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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
    toast.success('Abonnement gelöscht');
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

  const inactiveSubscriptions = subscriptions.filter((sub) => !sub.isActive);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && sub.isActive) || 
      (statusFilter === 'inactive' && !sub.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get upcoming renewals (within 7 days)
  const upcomingRenewals = activeSubscriptions.filter((sub) => {
    const daysUntil = Math.ceil(
      (new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 7;
  });

  // Group subscriptions by category for list view
  const groupedByCategory = filteredSubscriptions.reduce((acc, sub) => {
    const cat = sub.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sub);
    return acc;
  }, {} as Record<string, Subscription[]>);

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meine Abonnements</h1>
            <p className="text-muted-foreground mt-1">
              Verwalte und organisiere alle deine Abonnements
            </p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Neues Abo hinzufügen
          </Button>
        </div>

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

        {/* Filters & Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Abonnement suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value as SubscriptionCategory | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle & Count */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredSubscriptions.length} von {subscriptions.length} Abos
                </span>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none px-3"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none px-3"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Display */}
        {filteredSubscriptions.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={toggleSubscription}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByCategory).map(([category, subs]) => {
                const categoryInfo = categoryOptions.find(c => c.value === category);
                return (
                  <Card key={category}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 p-4 border-b bg-muted/30">
                        <span className="text-lg">{categoryInfo?.icon}</span>
                        <h3 className="font-semibold text-foreground">
                          {categoryInfo?.label || category}
                        </h3>
                        <Badge variant="secondary" className="ml-auto">
                          {subs.length}
                        </Badge>
                      </div>
                      <div className="divide-y">
                        {subs.map((sub) => (
                          <div
                            key={sub.id}
                            className={`p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors ${!sub.isActive ? 'opacity-60' : ''}`}
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                              style={{ backgroundColor: sub.color + '20' }}
                            >
                              {sub.icon || '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{sub.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {format(parseISO(sub.nextBillingDate), 'dd. MMM yyyy', { locale: de })}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-foreground">{sub.price.toFixed(2)}€</p>
                              <p className="text-xs text-muted-foreground">
                                {sub.billingCycle === 'monthly' && 'monatlich'}
                                {sub.billingCycle === 'yearly' && 'jährlich'}
                                {sub.billingCycle === 'weekly' && 'wöchentlich'}
                                {sub.billingCycle === 'quarterly' && 'vierteljährlich'}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(sub)}
                              >
                                Bearbeiten
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <CreditCard className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Keine Abonnements gefunden'
                  : 'Noch keine Abonnements'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Versuche eine andere Suche oder passe die Filter an'
                  : 'Füge dein erstes Abonnement hinzu, um loszulegen und den Überblick über deine Ausgaben zu behalten'}
              </p>
              <Button onClick={handleAdd} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Erstes Abo hinzufügen
              </Button>
            </CardContent>
          </Card>
        )}

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
    </Layout>
  );
}
