import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatTileProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
}

/**
 * Dumb Component: Kompakte Status-Kachel für das Bento-Grid
 * Zeigt eine einzelne Metrik mit Icon und optionalem Untertitel
 */
export const StatTile = ({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
}: StatTileProps) => {
  return (
    <article
      className={cn(
        'relative group overflow-hidden rounded-2xl p-5',
        'bg-card/50 backdrop-blur-sm',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-border/60 before:via-transparent before:to-border/20',
        'before:-z-10 before:content-[""]',
        'transition-all duration-300 hover:before:from-primary/40 hover:before:to-accent/20',
        className
      )}
    >
      <div className="flex flex-col h-full justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </article>
  );
};
