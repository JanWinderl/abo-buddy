import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface CategoryData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface CategoryDonutChartProps {
  data: CategoryData[];
  totalMonthly: number;
  className?: string;
}

/**
 * Dumb Component: Donut-Chart für Kategorieverteilung
 * Zeigt prozentuale Aufteilung der Ausgaben
 */
export const CategoryDonutChart = ({
  data,
  totalMonthly,
  className,
}: CategoryDonutChartProps) => {
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
      <header className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Kategorieverteilung</h3>
        <p className="text-sm text-muted-foreground">Anteil pro Kategorie</p>
      </header>

      {data.length > 0 ? (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Chart */}
          <div className="w-full lg:w-1/2 relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}€`, 'Monatlich']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">
                  {totalMonthly.toFixed(0)}€
                </p>
                <p className="text-xs text-muted-foreground">pro Monat</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full lg:w-1/2 space-y-2">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground flex-1">{item.name}</span>
                <span className="text-sm font-medium text-foreground">
                  {item.value.toFixed(0)}€
                </span>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[180px] flex items-center justify-center text-muted-foreground">
          Keine Daten vorhanden
        </div>
      )}
    </article>
  );
};
