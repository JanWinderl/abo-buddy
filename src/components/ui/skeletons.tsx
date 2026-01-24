import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton für Abo-Karten
 * Dumb Component für Loading-States
 */
export const SubscriptionCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton für Statistik-Karten
 */
export const StatCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32 mt-2" />
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton für Tabellen-Zeilen
 */
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Skeleton für Charts
 */
export const ChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton für Listen-Einträge
 */
export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
};
