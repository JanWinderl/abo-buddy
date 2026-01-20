import { CostAnalysis } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarClock } from 'lucide-react';

interface UpcomingPaymentsProps {
  analysis: CostAnalysis;
}

export const UpcomingPayments = ({ analysis }: UpcomingPaymentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Anstehende Zahlungen
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysis.upcomingPayments.length > 0 ? (
          <ul className="space-y-3">
            {analysis.upcomingPayments.map(({ subscription, dueDate, amount }) => (
              <li
                key={subscription.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{subscription.icon || '📦'}</span>
                  <div>
                    <p className="font-medium text-foreground">{subscription.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(dueDate), 'dd. MMMM yyyy', { locale: de })}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-foreground">{amount.toFixed(2)}€</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Keine anstehenden Zahlungen
          </p>
        )}
      </CardContent>
    </Card>
  );
};
