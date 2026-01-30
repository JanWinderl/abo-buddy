import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubscriptionCategory } from '@/types/subscription';
import { Search, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list';
export type StatusFilter = 'all' | 'active' | 'inactive';
export type SortOption = 'expensive' | 'cheapest' | 'nextPayment' | 'alphabetical';

interface CategoryOption {
  value: SubscriptionCategory | 'all';
  label: string;
  icon: string;
}

const categoryOptions: CategoryOption[] = [
  { value: 'all', label: 'Alle Kategorien', icon: '📋' },
  { value: 'streaming', label: 'Streaming', icon: '🎬' },
  { value: 'software', label: 'Software', icon: '💻' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'cloud', label: 'Cloud', icon: '☁️' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'news', label: 'News', icon: '📰' },
  { value: 'other', label: 'Sonstiges', icon: '📦' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'expensive', label: 'Teuerste zuerst' },
  { value: 'cheapest', label: 'Günstigste zuerst' },
  { value: 'nextPayment', label: 'Nächste Zahlung' },
  { value: 'alphabetical', label: 'Alphabetisch' },
];

interface SubscriptionFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: SubscriptionCategory | 'all';
  onCategoryChange: (category: SubscriptionCategory | 'all') => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
  className?: string;
}

/**
 * Dumb Component: Erweiterte Filter-Bar für Abonnements
 * Suche, Kategorie, Status, Sortierung, Ansicht-Toggle
 */
export const SubscriptionFilterBar = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  className,
}: SubscriptionFilterBarProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-4',
        'bg-card/50 backdrop-blur-sm',
        'border border-border/30',
        className
      )}
    >
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full xl:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Abonnement suchen..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(value) => onCategoryChange(value as SubscriptionCategory | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusChange(value as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-[140px] bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Inaktiv</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select
            value={sortOption}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
              <span className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <SelectValue placeholder="Sortieren nach" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle & Count */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredCount} von {totalCount} Abos
          </span>
          <div className="flex border border-border/50 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3"
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
