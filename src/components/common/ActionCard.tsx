import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel: string;
  onAction: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline';
  className?: string;
}

/**
 * Wiederverwendbare Aktions-Karte Komponente
 * Dumb Component - erhält alle Daten über Props
 * Wird für Admin-Aktionen und schnelle Operationen verwendet
 */
export const ActionCard = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  isLoading = false,
  disabled = false,
  variant = 'default',
  className,
}: ActionCardProps) => {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant={variant}
          onClick={onAction}
          disabled={disabled || isLoading}
          className="w-full"
        >
          {isLoading ? 'Wird ausgeführt...' : actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
