import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, TrendingDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GamificationBadgesProps {
  streakDays: number;
  totalSaved: number;
  cancelledOnTime: number;
  className?: string;
}

/**
 * Dumb Component: Gamification Badges für Erinnerungen
 */
export const GamificationBadges = ({
  streakDays,
  totalSaved,
  cancelledOnTime,
  className,
}: GamificationBadgesProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-gradient-to-br from-amber-500/5 via-card/50 to-primary/5',
        'border border-amber-500/20',
        className
      )}
    >
      <header className="mb-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          Deine Erfolge
        </h3>
        <p className="text-sm text-muted-foreground">Behalte deinen Streak!</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {/* Streak Badge */}
        <div
          className={cn(
            'flex flex-col items-center p-4 rounded-xl text-center',
            'bg-background/50 border border-border/30'
          )}
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
            <Flame className={cn('h-6 w-6', streakDays > 0 ? 'text-orange-400' : 'text-muted-foreground')} />
          </div>
          <p className="text-2xl font-bold text-foreground">{streakDays}</p>
          <p className="text-xs text-muted-foreground">Tage Streak</p>
          {streakDays >= 7 && (
            <Badge className="mt-2 text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
              🔥 On Fire!
            </Badge>
          )}
        </div>

        {/* Savings Counter */}
        <div
          className={cn(
            'flex flex-col items-center p-4 rounded-xl text-center',
            'bg-background/50 border border-border/30'
          )}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
            <TrendingDown className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalSaved.toFixed(0)}€</p>
          <p className="text-xs text-muted-foreground">Gesamt gespart</p>
          {totalSaved >= 100 && (
            <Badge className="mt-2 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              💰 Sparer!
            </Badge>
          )}
        </div>

        {/* Cancelled On Time */}
        <div
          className={cn(
            'flex flex-col items-center p-4 rounded-xl text-center',
            'bg-background/50 border border-border/30'
          )}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{cancelledOnTime}</p>
          <p className="text-xs text-muted-foreground">Rechtzeitig gekündigt</p>
          {cancelledOnTime >= 5 && (
            <Badge className="mt-2 text-xs bg-primary/20 text-primary border-primary/30">
              ⭐ Profi!
            </Badge>
          )}
        </div>
      </div>
    </section>
  );
};
