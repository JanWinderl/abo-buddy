import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Dumb Component: Skeleton für Stat-Kachel
 */
export const StatTileSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative rounded-2xl p-5 bg-card/50',
      'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
      'before:bg-gradient-to-br before:from-border/30 before:via-transparent before:to-border/10',
      'before:-z-10',
      className
    )}
  >
    <div className="flex flex-col h-full justify-between gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

/**
 * Dumb Component: Skeleton für Payment-Item
 */
export const PaymentItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-background/30 border border-border/20">
    <Skeleton className="h-10 w-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-6 w-12 rounded-md" />
    <Skeleton className="h-5 w-16" />
  </div>
);

/**
 * Dumb Component: Skeleton für Hero-Kachel
 */
export const HeroTileSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative rounded-2xl p-6 bg-card/50',
      'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
      'before:bg-gradient-to-br before:from-border/30 before:via-transparent before:to-border/10',
      'before:-z-10',
      className
    )}
  >
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="space-y-3">
      <PaymentItemSkeleton />
      <PaymentItemSkeleton />
      <PaymentItemSkeleton />
      <PaymentItemSkeleton />
    </div>
  </div>
);

/**
 * Dumb Component: Vollständiges Dashboard-Skeleton
 */
export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
    {/* Hero Tile - spans 2 columns and 2 rows on larger screens */}
    <HeroTileSkeleton className="md:col-span-2 md:row-span-2" />
    
    {/* Stat Tiles */}
    <StatTileSkeleton />
    <StatTileSkeleton />
    <StatTileSkeleton />
    
    {/* Quick Actions */}
    <div className="rounded-2xl p-5 bg-card/50">
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-10 w-full rounded-lg mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </div>
    </div>
  </div>
);
