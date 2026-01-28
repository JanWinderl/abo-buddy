import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Dumb Component: Skeleton für Sidebar
 */
export const SidebarSkeleton = () => (
  <aside className="w-full lg:w-64 space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-12" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-16" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </aside>
);

/**
 * Dumb Component: Skeleton für Trend-Chart
 */
export const TrendChartSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-2xl p-6 bg-card/50', className)}>
    <Skeleton className="h-5 w-32 mb-2" />
    <Skeleton className="h-4 w-48 mb-6" />
    <Skeleton className="h-64 w-full" />
  </div>
);

/**
 * Dumb Component: Skeleton für Donut-Chart
 */
export const DonutChartSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-2xl p-6 bg-card/50', className)}>
    <Skeleton className="h-5 w-36 mb-2" />
    <Skeleton className="h-4 w-28 mb-6" />
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <Skeleton className="h-[180px] w-[180px] rounded-full" />
      <div className="w-full lg:w-1/2 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Dumb Component: Skeleton für Spartipps
 */
export const TipsSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-2xl p-6 bg-card/50', className)}>
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-36 mt-1" />
      </div>
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

/**
 * Dumb Component: Full Analysis Skeleton
 */
export const AnalysisSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8">
    <SidebarSkeleton />
    <div className="flex-1 space-y-6">
      <TrendChartSkeleton />
      <div className="grid md:grid-cols-2 gap-6">
        <DonutChartSkeleton />
        <TipsSkeleton />
      </div>
    </div>
  </div>
);
