import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RemindersEmptyStateProps {
  filter: string;
  onResetFilter?: () => void;
  className?: string;
}

/**
 * Dumb Component: Empty State für Erinnerungen
 */
export const RemindersEmptyState = ({
  filter,
  onResetFilter,
  className,
}: RemindersEmptyStateProps) => {
  const isFiltered = filter !== 'all';

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        'rounded-2xl border border-dashed border-border/50',
        'bg-muted/10',
        className
      )}
    >
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Bell className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {isFiltered ? 'Keine Erinnerungen in dieser Kategorie' : 'Keine Erinnerungen'}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-sm">
        {isFiltered
          ? 'Ändere den Filter, um andere Erinnerungen anzuzeigen.'
          : 'Du hast keine ausstehenden Erinnerungen. Erstelle eine neue oder füge Abos hinzu.'}
      </p>

      {isFiltered ? (
        <Button variant="outline" onClick={onResetFilter}>
          Alle anzeigen
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/subscriptions">
              <Plus className="h-4 w-4 mr-2" />
              Abo hinzufügen
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};
