import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/types/subscription';
import { CreditCard, User, Shield, Crown, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

const roleIcons: Record<UserRole, React.ReactNode> = {
  user: <User className="h-4 w-4" />,
  premium: <Crown className="h-4 w-4" />,
  admin: <Shield className="h-4 w-4" />,
};

const roleLabels: Record<UserRole, string> = {
  user: 'Benutzer',
  premium: 'Premium',
  admin: 'Admin',
};

export const Header = () => {
  const { currentRole, setRole } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">SubMate</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/subscriptions"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Abonnements
          </Link>
          <Link
            to="/analysis"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Analyse
          </Link>
          <Link
            to="/reminders"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Erinnerungen
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Preise
          </Link>
          {currentRole === 'admin' && (
            <Link
              to="/admin"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Theme Toggle & Role Selector */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Theme wechseln</span>
          </Button>
          
          <Select value={currentRole} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                {roleIcons[currentRole]}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">
                <div className="flex items-center gap-2">
                  {roleIcons.user}
                  {roleLabels.user}
                </div>
              </SelectItem>
              <SelectItem value="premium">
                <div className="flex items-center gap-2">
                  {roleIcons.premium}
                  {roleLabels.premium}
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  {roleIcons.admin}
                  {roleLabels.admin}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/subscriptions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Abonnements
            </Link>
            <Link
              to="/analysis"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analyse
            </Link>
            <Link
              to="/reminders"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Erinnerungen
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preise
            </Link>
            {currentRole === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-4 border-t border-border flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Theme wechseln</span>
              </Button>
              <Select value={currentRole} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger className="flex-1">
                  <div className="flex items-center gap-2">
                    {roleIcons[currentRole]}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{roleLabels.user}</SelectItem>
                  <SelectItem value="premium">{roleLabels.premium}</SelectItem>
                  <SelectItem value="admin">{roleLabels.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
