import { Button } from '@/components/ui/button';
import { FileX, Plus, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AnalysisEmptyStateProps {
  type: 'no-data' | 'no-filter-results';
  onReset?: () => void;
  className?: string;
}

/**
 * Dumb Component: Empty/Error State für Analyse
 * Zeigt Feedback wenn keine Daten verfügbar sind
 */
export const AnalysisEmptyState = ({
  type,
  onReset,
  className,
}: AnalysisEmptyStateProps) => {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        'rounded-2xl border border-dashed border-border/50',
        'bg-muted/10',
        className
      )}
    >
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>

      {type === 'no-data' ? (
        <>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keine Abonnements gefunden
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Füge dein erstes Abonnement hinzu, um detaillierte Kostenanalysen zu erhalten.
          </p>
          <Button asChild>
            <Link to="/subscriptions">
              <Plus className="h-4 w-4 mr-2" />
              Abo hinzufügen
            </Link>
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keine Ergebnisse für diese Filter
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Ändere die Filtereinstellungen, um Daten anzuzeigen.
          </p>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Filter zurücksetzen
          </Button>
        </>
      )}
    </section>
  );
};
