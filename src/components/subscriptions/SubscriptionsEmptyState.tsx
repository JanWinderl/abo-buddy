import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionsEmptyStateProps {
  type: 'no-subscriptions' | 'no-results';
  onAddFirst: () => void;
  onResetFilters?: () => void;
  className?: string;
}

/**
 * Dumb Component: Empty State für Abonnements-Seite
 * Zeigt Illustration und Call-to-Action
 */
export const SubscriptionsEmptyState = ({
  type,
  onAddFirst,
  onResetFilters,
  className,
}: SubscriptionsEmptyStateProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-12',
        'bg-card/50 backdrop-blur-sm',
        'border border-border/30',
        'text-center',
        className
      )}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative">
        {type === 'no-subscriptions' ? (
          <>
            {/* Illustration */}
            <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-12 w-12 text-primary" />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
              Füge dein erstes Abo hinzu
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Behalte den Überblick über all deine Abonnements, werde rechtzeitig an 
              Kündigungsfristen erinnert und entdecke Einsparpotenziale.
            </p>

            <Button onClick={onAddFirst} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Erstes Abo hinzufügen
            </Button>
          </>
        ) : (
          <>
            {/* No Results Illustration */}
            <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
              Keine Abonnements gefunden
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Für deine aktuelle Suche oder Filterauswahl wurden keine passenden 
              Abonnements gefunden. Versuche andere Filter.
            </p>

            <div className="flex gap-3 justify-center">
              {onResetFilters && (
                <Button variant="outline" onClick={onResetFilters}>
                  Filter zurücksetzen
                </Button>
              )}
              <Button onClick={onAddFirst} className="gap-2">
                <Plus className="h-4 w-4" />
                Neues Abo hinzufügen
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
