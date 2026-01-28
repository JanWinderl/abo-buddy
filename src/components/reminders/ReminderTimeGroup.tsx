import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ReminderTimeGroupProps {
  title: string;
  count: number;
  variant?: 'urgent' | 'soon' | 'later' | 'default';
  children: ReactNode;
  className?: string;
}

/**
 * Dumb Component: Zeit-Gruppierung für Erinnerungen
 * Semantischer Container für nach Dringlichkeit gruppierte Erinnerungen
 */
export const ReminderTimeGroup = ({
  title,
  count,
  variant = 'default',
  children,
  className,
}: ReminderTimeGroupProps) => {
  const variantStyles = {
    urgent: 'border-destructive/30 bg-destructive/5',
    soon: 'border-primary/30 bg-primary/5',
    later: 'border-border/30 bg-card/30',
    default: 'border-border/30 bg-transparent',
  };

  const titleStyles = {
    urgent: 'text-destructive',
    soon: 'text-primary',
    later: 'text-muted-foreground',
    default: 'text-foreground',
  };

  return (
    <section
      className={cn(
        'rounded-2xl p-4 border',
        variantStyles[variant],
        className
      )}
    >
      <header className="flex items-center justify-between mb-4">
        <h2 className={cn('text-sm font-semibold uppercase tracking-wider', titleStyles[variant])}>
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">
          {count} {count === 1 ? 'Erinnerung' : 'Erinnerungen'}
        </span>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
};
