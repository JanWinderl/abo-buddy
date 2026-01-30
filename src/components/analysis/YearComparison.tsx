import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface YearComparisonData {
  month: string;
  current: number;
  previous: number;
}

interface YearComparisonProps {
  data: YearComparisonData[];
  currentYear: number;
  previousYear: number;
  totalCurrent: number;
  totalPrevious: number;
  className?: string;
}

/**
 * Dumb Component: Jahresvergleich Chart
 */
export const YearComparison = ({
  data,
  currentYear,
  previousYear,
  totalCurrent,
  totalPrevious,
  className,
}: YearComparisonProps) => {
  const difference = totalCurrent - totalPrevious;
  const percentChange = totalPrevious > 0 ? (difference / totalPrevious) * 100 : 0;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-card/50 backdrop-blur-sm',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-border/60 before:via-transparent before:to-border/20',
        'before:-z-10 before:content-[""]',
        className
      )}
    >
      <header className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Jahresvergleich</h3>
          <p className="text-sm text-muted-foreground">
            {currentYear} vs {previousYear}
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg',
            isIncrease && 'bg-destructive/10 text-destructive',
            isDecrease && 'bg-emerald-500/10 text-emerald-400',
            !isIncrease && !isDecrease && 'bg-muted text-muted-foreground'
          )}
        >
          {isIncrease ? (
            <TrendingUp className="h-4 w-4" />
          ) : isDecrease ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {Math.abs(percentChange).toFixed(1)}%
          </span>
        </div>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{currentYear}</p>
          <p className="text-xl font-bold text-foreground">{totalCurrent.toFixed(0)}€</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{previousYear}</p>
          <p className="text-xl font-bold text-muted-foreground">{totalPrevious.toFixed(0)}€</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Differenz</p>
          <p
            className={cn(
              'text-xl font-bold',
              isIncrease && 'text-destructive',
              isDecrease && 'text-emerald-400',
              !isIncrease && !isDecrease && 'text-muted-foreground'
            )}
          >
            {difference > 0 ? '+' : ''}{difference.toFixed(0)}€
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v) => `${v}€`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(0)}€`,
                name === 'current' ? currentYear : previousYear,
              ]}
            />
            <Bar dataKey="previous" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-xs text-muted-foreground">{currentYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted" />
          <span className="text-xs text-muted-foreground">{previousYear}</span>
        </div>
      </div>
    </article>
  );
};
