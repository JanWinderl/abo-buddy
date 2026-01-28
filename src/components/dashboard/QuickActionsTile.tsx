import { Button } from '@/components/ui/button';
import { Plus, Search, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickActionsTileProps {
  className?: string;
}

/**
 * Dumb Component: Schnellaktionen-Kachel
 * Prominenter Add-Button und sekundäre Aktionen
 */
export const QuickActionsTile = ({ className }: QuickActionsTileProps) => {
  const secondaryActions = [
    { icon: Search, label: 'Suchen', href: '/subscriptions' },
    { icon: Bell, label: 'Erinnerungen', href: '/reminders' },
    { icon: Settings, label: 'Einstellungen', href: '/settings' },
  ];

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl p-5',
        'bg-card/50 backdrop-blur-sm',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-border/60 before:via-transparent before:to-border/20',
        'before:-z-10 before:content-[""]',
        className
      )}
    >
      <div className="flex flex-col h-full gap-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Schnellaktionen
        </span>

        {/* Primary Action */}
        <Button
          asChild
          size="lg"
          className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Link to="/subscriptions">
            <Plus className="h-5 w-5" />
            Neues Abo
          </Link>
        </Button>

        {/* Secondary Actions */}
        <div className="flex gap-2 mt-auto">
          {secondaryActions.map((action) => (
            <Button
              key={action.label}
              asChild
              variant="ghost"
              size="sm"
              className="flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Link to={action.href} className="flex flex-col items-center gap-1 py-2">
                <action.icon className="h-4 w-4" />
                <span className="text-[10px]">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </article>
  );
};
