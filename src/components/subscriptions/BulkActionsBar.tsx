import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, FolderEdit, X, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onChangeCategory: () => void;
  onCancel: () => void;
  onSelectAll?: () => void;
  totalCount?: number;
  className?: string;
}

/**
 * Dumb Component: Floating Action Bar für Bulk-Operationen
 * Erscheint am unteren Bildschirmrand wenn Items ausgewählt sind
 */
export const BulkActionsBar = ({
  selectedCount,
  onDelete,
  onChangeCategory,
  onCancel,
  onSelectAll,
  totalCount,
  className,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-4 px-6 py-3 rounded-2xl',
          'bg-card/95 backdrop-blur-xl',
          'border border-border/50',
          'shadow-2xl shadow-black/20'
        )}
      >
        {/* Selected Count */}
        <div className="flex items-center gap-2">
          <Badge variant="default" className="px-3 py-1">
            {selectedCount}
          </Badge>
          <span className="text-sm text-foreground font-medium">
            Abo{selectedCount !== 1 ? 's' : ''} ausgewählt
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Select All */}
        {onSelectAll && totalCount && selectedCount < totalCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            Alle auswählen
          </Button>
        )}

        {/* Change Category */}
        <Button
          variant="outline"
          size="sm"
          onClick={onChangeCategory}
          className="gap-2"
        >
          <FolderEdit className="h-4 w-4" />
          Kategorie ändern
        </Button>

        {/* Delete */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
          Alle löschen
        </Button>

        {/* Cancel */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Abbrechen
        </Button>
      </div>
    </div>
  );
};
