import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Dumb Component: Skeleton für Sidebar
 */
export const RemindersSidebarSkeleton = () => (
  <aside className="w-full lg:w-56 space-y-6">
    <div className="space-y-3">
      <Skeleton className="h-3 w-12" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  </aside>
);

/**
 * Dumb Component: Skeleton für einzelne Reminder-Karte
 */
export const ReminderCardSkeleton = () => (
  <div className="rounded-xl border-l-4 border-l-muted bg-card/50 p-4">
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  </div>
);

/**
 * Dumb Component: Skeleton für Zeit-Gruppe
 */
export const TimeGroupSkeleton = ({ itemCount = 2 }: { itemCount?: number }) => (
  <div className="rounded-2xl p-4 border border-border/30 bg-card/30">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: itemCount }).map((_, i) => (
        <ReminderCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Dumb Component: Full Reminders Skeleton
 */
export const RemindersSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8">
    <RemindersSidebarSkeleton />
    <div className="flex-1 space-y-6">
      <TimeGroupSkeleton itemCount={2} />
      <TimeGroupSkeleton itemCount={1} />
    </div>
  </div>
);
