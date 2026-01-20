import { CostAnalysis } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Users, Calendar } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CostSummaryProps {
  analysis: CostAnalysis;
}

export const CostSummary = ({ analysis }: CostSummaryProps) => {
  const { householdSize, setHouseholdSize } = useRole();

  const stats = [
    {
      title: 'Monatliche Kosten',
      value: `${analysis.totalMonthly.toFixed(2)}€`,
      icon: Calendar,
      description: 'Alle aktiven Abos',
    },
    {
      title: 'Jährliche Kosten',
      value: `${analysis.totalYearly.toFixed(2)}€`,
      icon: TrendingUp,
      description: 'Hochgerechnet auf 12 Monate',
    },
    {
      title: 'Pro Person / Monat',
      value: `${analysis.perPersonMonthly.toFixed(2)}€`,
      icon: Users,
      description: `Bei ${householdSize} Person${householdSize > 1 ? 'en' : ''}`,
    },
    {
      title: 'Einsparpotenzial',
      value: `${(analysis.totalMonthly * 0.2).toFixed(2)}€`,
      icon: TrendingDown,
      description: 'Geschätzt 20% möglich',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Household Size Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Users className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <Label htmlFor="household">Haushaltsgröße</Label>
              <p className="text-sm text-muted-foreground">
                Anzahl der Personen für die Kostenaufteilung
              </p>
            </div>
            <Input
              id="household"
              type="number"
              min={1}
              max={10}
              value={householdSize}
              onChange={(e) => setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
