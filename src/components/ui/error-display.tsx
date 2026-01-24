import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'card' | 'inline' | 'full-page';
}

/**
 * Wiederverwendbare Fehleranzeige-Komponente
 * Dumb Component - erhält alle Daten über Props
 */
export const ErrorDisplay = ({
  title = 'Ein Fehler ist aufgetreten',
  message,
  onRetry,
  className,
  variant = 'card',
}: ErrorDisplayProps) => {
  const content = (
    <>
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div className="text-center">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Erneut versuchen
        </Button>
      )}
    </>
  );

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-destructive', className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  if (variant === 'full-page') {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[400px] gap-4', className)}>
        {content}
      </div>
    );
  }

  return (
    <Card className={cn('border-destructive/50', className)}>
      <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
        {content}
      </CardContent>
    </Card>
  );
};
