import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { StatCard } from '@/components/common/StatCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  CreditCard, 
  Tag,
  Bell,
  TrendingUp 
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { useState } from 'react';

/**
 * Detail-Seite für einzelne Abonnements
 * Smart Component - lädt Daten und verwaltet State
 */
export default function SubscriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subscriptions, deleteSubscription, toggleSubscription } = useSubscriptions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const subscription = subscriptions.find((s) => s.id === id);

  if (!subscription) {
    return (
      <Layout>
        <div className="container py-8">
          <ErrorDisplay
            variant="full-page"
            title="Abonnement nicht gefunden"
            message="Das gesuchte Abonnement existiert nicht oder wurde gelöscht."
            onRetry={() => navigate('/subscriptions')}
          />
        </div>
      </Layout>
    );
  }

  const daysUntilPayment = differenceInDays(
    parseISO(subscription.nextBillingDate),
    new Date()
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      deleteSubscription(subscription.id);
      navigate('/subscriptions');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const yearlyTotal =
    subscription.billingCycle === 'yearly'
      ? subscription.price
      : subscription.billingCycle === 'monthly'
      ? subscription.price * 12
      : subscription.price * 52;

  const billingCycleLabel = {
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    weekly: 'Wöchentlich',
  }[subscription.billingCycle];

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              {subscription.icon && (
                <img
                  src={subscription.icon}
                  alt={subscription.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground">{subscription.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
                    {subscription.isActive ? 'Aktiv' : 'Pausiert'}
                  </Badge>
                  <Badge variant="outline">{subscription.category}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/subscriptions?edit=${subscription.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Monatliche Kosten"
            value={`${subscription.price.toFixed(2)}€`}
            description={billingCycleLabel}
            icon={CreditCard}
          />
          <StatCard
            title="Jährliche Kosten"
            value={`${yearlyTotal.toFixed(2)}€`}
            description="Hochgerechnet"
            icon={TrendingUp}
          />
          <StatCard
            title="Nächste Zahlung"
            value={format(parseISO(subscription.nextBillingDate), 'dd. MMM', { locale: de })}
            description={`In ${daysUntilPayment} Tagen`}
            icon={Calendar}
          />
          <StatCard
            title="Kategorie"
            value={subscription.category}
            icon={Tag}
          />
        </div>

        {/* Details Card */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Abo-Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Notizen</h4>
                  <p className="text-foreground mt-1">{subscription.notes}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Abrechnungszyklus</h4>
                <p className="text-foreground mt-1">{billingCycleLabel}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant={subscription.isActive ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleSubscription(subscription.id)}
                  >
                    {subscription.isActive ? 'Pausieren' : 'Aktivieren'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Erinnerungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Verwalte Erinnerungen für dieses Abonnement, um keine Kündigungsfristen zu verpassen.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/reminders?subscription=${subscription.id}`}>
                  Erinnerungen verwalten
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Abonnement löschen?"
        description={`Möchtest du "${subscription.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        isDestructive
        isLoading={isDeleting}
      />
    </Layout>
  );
}
