import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Plus, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useState } from 'react';
import { toast } from 'sonner';

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/subscriptions', label: 'Abos', icon: CreditCard },
  { path: '/analysis', label: 'Analyse', icon: BarChart3 },
  { path: '/profile', label: 'Profil', icon: User },
];

interface MobileBottomNavProps {
  onAddSubscription?: (data: any) => void;
}

/**
 * Mobile Bottom Navigation - nur sichtbar auf Smartphones (<768px)
 */
export const MobileBottomNav = ({ onAddSubscription }: MobileBottomNavProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Nur auf Mobile anzeigen
  if (!isMobile) return null;

  const handleAddSubmit = (data: any) => {
    onAddSubscription?.(data);
    setIsAddDialogOpen(false);
    toast.success('Abonnement hinzugefügt');
  };

  return (
    <>
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'h-[72px] px-2 pb-safe',
          'bg-card/95 backdrop-blur-xl',
          'border-t border-primary/20',
          'animate-in slide-in-from-bottom duration-300'
        )}
      >
        <div className="flex items-center justify-around h-full max-w-md mx-auto">
          {/* First two nav items */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] p-2 rounded-xl transition-all',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-6 w-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Center Add Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button
                className={cn(
                  'relative flex items-center justify-center',
                  'w-14 h-14 rounded-full',
                  '-translate-y-3',
                  'bg-gradient-to-br from-primary to-primary/80',
                  'shadow-lg shadow-primary/30',
                  'transition-transform hover:scale-105 active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                )}
                aria-label="Neues Abonnement hinzufügen"
              >
                <Plus className="h-7 w-7 text-primary-foreground" />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neues Abonnement</DialogTitle>
              </DialogHeader>
              <SubscriptionForm
                onSubmit={handleAddSubmit}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Last two nav items */}
          {navItems.slice(2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] p-2 rounded-xl transition-all',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-6 w-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for content */}
      <div className="h-[72px]" />
    </>
  );
};
