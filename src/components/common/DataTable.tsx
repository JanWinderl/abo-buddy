import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * Wiederverwendbare Daten-Tabelle Komponente
 * Dumb Component - erhält alle Daten über Props
 * Wird auf mehreren Detail-Seiten verwendet (Admin, Subscriptions, etc.)
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'Keine Daten vorhanden',
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Daten werden geladen..." />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key]?.toString() ?? '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
