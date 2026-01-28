import { Badge } from '@/components/ui/badge';
import { Lightbulb, Calendar, Users, Target, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsTip {
  title: string;
  description: string;
  icon: LucideIcon;
  potential: number;
}

interface SavingsTipsCardProps {
  tips: SavingsTip[];
  className?: string;
}

/**
 * Dumb Component: Intelligente Spartipps-Sektion
 * Zeigt personalisierte Empfehlungen
 */
export const SavingsTipsCard = ({ tips, className }: SavingsTipsCardProps) => {
  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-gradient-to-br from-primary/5 via-card/50 to-accent/5',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-primary/30 before:via-border/40 before:to-accent/20',
        'before:-z-10 before:content-[""]',
        className
      )}
    >
      <header className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Spartipps für dich</h3>
          <p className="text-sm text-muted-foreground">Personalisierte Empfehlungen</p>
        </div>
      </header>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3 p-3 rounded-xl',
              'bg-background/50 backdrop-blur-sm',
              'border border-border/30',
              'transition-colors hover:border-primary/30'
            )}
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <tip.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{tip.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {tip.description}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 text-xs flex-shrink-0"
            >
              ~{tip.potential}€/Jahr
            </Badge>
          </div>
        ))}
      </div>
    </article>
  );
};

// Default tips generator
export const generateDefaultTips = (totalMonthly: number, totalYearly: number): SavingsTip[] => [
  {
    title: 'Jahresabos nutzen',
    description: 'Bei jährlicher Zahlung sparst du oft 15-20%.',
    icon: Calendar,
    potential: Math.round(totalYearly * 0.15),
  },
  {
    title: 'Familien-Tarife teilen',
    description: 'Spotify, Netflix oder Apple One bieten Familien-Optionen.',
    icon: Users,
    potential: Math.round(totalMonthly * 0.3 * 12),
  },
  {
    title: 'Ungenutzte kündigen',
    description: 'Überprüfe regelmäßig deine Abo-Nutzung.',
    icon: Target,
    potential: Math.round(totalMonthly * 0.25 * 12),
  },
];
