import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface TrendData {
  month: string;
  amount: number;
}

interface TrendLineChartProps {
  data: TrendData[];
  className?: string;
}

/**
 * Dumb Component: Minimalistisches Liniendiagramm für Ausgabenverlauf
 * Zeigt 12-Monats-Trend der Kosten
 */
export const TrendLineChart = ({ data, className }: TrendLineChartProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-card/50 backdrop-blur-sm',
        'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
        'before:bg-gradient-to-br before:from-border/60 before:via-transparent before:to-border/20',
        'before:-z-10 before:content-[""]',
        className
      )}
    >
      <header className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Ausgabenverlauf</h2>
        <p className="text-sm text-muted-foreground">
          Monatliche Kosten der letzten 12 Monate
        </p>
      </header>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}€`}
              width={50}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}€`, 'Ausgaben']}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
