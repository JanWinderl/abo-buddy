import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useRole } from '@/contexts/RoleContext';
import { Subscription, SubscriptionCategory } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Filter } from 'lucide-react';
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
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Neues Abo
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <SelectTrigger className="w-[180px]">
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

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Aktiv ({activeSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inaktiv ({inactiveSubscriptions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {filterSubscriptions(activeSubscriptions).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'Keine Abonnements gefunden'
                    : 'Noch keine aktiven Abonnements'}
                </p>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Erstes Abo hinzufügen
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {filterSubscriptions(inactiveSubscriptions).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-12">
                <p className="text-muted-foreground">Keine inaktiven Abonnements</p>
              </div>
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
