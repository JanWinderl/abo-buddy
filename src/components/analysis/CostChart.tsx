import { CostAnalysis, SubscriptionCategory } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const categoryLabels: Record<SubscriptionCategory, string> = {
  streaming: 'Streaming',
  software: 'Software',
  fitness: 'Fitness',
  cloud: 'Cloud',
  gaming: 'Gaming',
  news: 'News',
  other: 'Sonstiges',
};

const categoryColors: Record<SubscriptionCategory, string> = {
  streaming: 'hsl(198, 93%, 59%)',
  software: 'hsl(213, 93%, 67%)',
  fitness: 'hsl(45, 93%, 47%)',
  cloud: 'hsl(200, 98%, 39%)',
  gaming: 'hsl(142, 76%, 36%)',
  news: 'hsl(215, 16%, 46%)',
  other: 'hsl(215, 19%, 34%)',
};

interface CostChartProps {
  analysis: CostAnalysis;
}

export const CostChart = ({ analysis }: CostChartProps) => {
  const data = Object.entries(analysis.byCategory)
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as SubscriptionCategory],
      value: Number(value.toFixed(2)),
      color: categoryColors[category as SubscriptionCategory],
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ausgaben nach Kategorie</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}€`, 'Monatlich']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Keine aktiven Abonnements vorhanden
          </div>
        )}
      </CardContent>
    </Card>
  );
};
