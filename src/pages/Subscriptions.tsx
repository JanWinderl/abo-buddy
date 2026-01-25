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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const categoryOptions: { value: SubscriptionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle Kategorien' },
  { value: 'streaming', label: '🎬 Streaming' },
  { value: 'software', label: '💻 Software' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'cloud', label: '☁️ Cloud' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'news', label: '📰 News' },
  { value: 'other', label: '📦 Sonstiges' },
];

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

  const filterSubscriptions = (subs: Subscription[]) => {
    return subs.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  const inactiveSubscriptions = subscriptions.filter((sub) => !sub.isActive);

  // Get upcoming renewals (within 7 days)
  const upcomingRenewals = activeSubscriptions.filter((sub) => {
    const daysUntil = Math.ceil(
      (new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 7;
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Abonnements</h1>
            <p className="text-muted-foreground">
              Verwalte alle deine Abonnements an einem Ort
            </p>
          </div>
          <Button onClick={handleAdd} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Neues Abo
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aktive Abos</p>
                  <p className="text-3xl font-bold text-foreground">{activeSubscriptions.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monatliche Kosten</p>
                  <p className="text-3xl font-bold text-foreground">{costAnalysis.totalMonthly.toFixed(2)}€</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${upcomingRenewals.length > 0 ? 'from-destructive/10 to-destructive/5 border-destructive/20' : 'from-muted/50 to-muted/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bald fällig</p>
                  <p className="text-3xl font-bold text-foreground">{upcomingRenewals.length}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${upcomingRenewals.length > 0 ? 'bg-destructive/20' : 'bg-muted'}`}>
                  <AlertCircle className={`h-6 w-6 ${upcomingRenewals.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Abonnement suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value as SubscriptionCategory | 'all')}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              Aktiv
              <Badge variant="secondary" className="ml-1">{activeSubscriptions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              Inaktiv
              <Badge variant="outline" className="ml-1">{inactiveSubscriptions.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {filterSubscriptions(activeSubscriptions).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterSubscriptions(activeSubscriptions).map((sub) => (
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
              <Card>
                <CardContent className="py-16 text-center">
                  <CreditCard className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchQuery || categoryFilter !== 'all'
                      ? 'Keine Abonnements gefunden'
                      : 'Noch keine aktiven Abonnements'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || categoryFilter !== 'all'
                      ? 'Versuche eine andere Suche oder Kategorie'
                      : 'Füge dein erstes Abonnement hinzu, um loszulegen'}
                  </p>
                  <Button onClick={handleAdd} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Erstes Abo hinzufügen
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {filterSubscriptions(inactiveSubscriptions).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterSubscriptions(inactiveSubscriptions).map((sub) => (
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
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">Keine inaktiven Abonnements</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

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
