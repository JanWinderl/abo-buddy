import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Filter, Users, RotateCcw } from 'lucide-react';
import { SubscriptionCategory } from '@/types/subscription';
import { cn } from '@/lib/utils';

const categoryLabels: Record<SubscriptionCategory, string> = {
  streaming: 'Streaming',
  software: 'Software',
  fitness: 'Fitness',
  cloud: 'Cloud',
  gaming: 'Gaming',
  news: 'News',
  other: 'Sonstiges',
};

interface AnalysisSidebarProps {
  selectedCategories: SubscriptionCategory[];
  onCategoryChange: (categories: SubscriptionCategory[]) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  householdSize: number;
  onHouseholdChange: (size: number) => void;
  onReset: () => void;
  className?: string;
}

/**
 * Dumb Component: Filter-Sidebar für Kostenanalyse
 * Ermöglicht Filterung nach Zeitraum und Kategorien
 */
export const AnalysisSidebar = ({
  selectedCategories,
  onCategoryChange,
  selectedPeriod,
  onPeriodChange,
  householdSize,
  onHouseholdChange,
  onReset,
  className,
}: AnalysisSidebarProps) => {
  const periods = [
    { value: '3m', label: '3 Monate' },
    { value: '6m', label: '6 Monate' },
    { value: '12m', label: '12 Monate' },
    { value: 'all', label: 'Gesamt' },
  ];

  const allCategories = Object.keys(categoryLabels) as SubscriptionCategory[];

  const handleCategoryToggle = (category: SubscriptionCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <aside
      className={cn(
        'w-full lg:w-64 flex-shrink-0 space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Zurücksetzen
        </Button>
      </div>

      {/* Time Period */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <Calendar className="h-3.5 w-3.5" />
          Zeitraum
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPeriodChange(period.value)}
              className="h-9 text-xs"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Kategorien
        </Label>
        <div className="space-y-2">
          {allCategories.map((category) => (
            <label
              key={category}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors',
                'hover:bg-muted/50',
                selectedCategories.includes(category) && 'bg-primary/5'
              )}
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <span className="text-sm text-foreground">
                {categoryLabels[category]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Household Size */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <Users className="h-3.5 w-3.5" />
          Haushaltsgröße
        </Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onHouseholdChange(Math.max(1, householdSize - 1))}
            disabled={householdSize <= 1}
            className="h-9 w-9 p-0"
          >
            -
          </Button>
          <Input
            type="number"
            min={1}
            max={10}
            value={householdSize}
            onChange={(e) => onHouseholdChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-9 w-14 text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onHouseholdChange(Math.min(10, householdSize + 1))}
            disabled={householdSize >= 10}
            className="h-9 w-9 p-0"
          >
            +
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Kosten werden pro Person berechnet
        </p>
      </div>
    </aside>
  );
};
