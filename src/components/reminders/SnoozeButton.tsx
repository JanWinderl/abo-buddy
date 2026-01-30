import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, ChevronDown } from 'lucide-react';

interface SnoozeButtonProps {
  onSnooze: (days: number) => void;
  className?: string;
}

/**
 * Dumb Component: Snooze-Button mit Dropdown-Optionen
 */
export const SnoozeButton = ({ onSnooze, className }: SnoozeButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Clock className="h-4 w-4 mr-1" />
          Später
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSnooze(1)}>
          In 1 Tag erinnern
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSnooze(3)}>
          In 3 Tagen erinnern
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSnooze(7)}>
          In 1 Woche erinnern
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
