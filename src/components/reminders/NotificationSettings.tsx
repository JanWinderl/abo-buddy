import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  BellRing,
  Mail,
  MessageSquare,
  Moon,
  Clock,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSettingsProps {
  emailEnabled: boolean;
  onEmailChange: (enabled: boolean) => void;
  pushEnabled: boolean;
  onPushChange: (enabled: boolean) => void;
  smsEnabled: boolean;
  onSmsChange: (enabled: boolean) => void;
  daysBefore: number;
  onDaysBeforeChange: (days: number) => void;
  quietHoursStart: string;
  quietHoursEnd: string;
  onQuietHoursChange: (start: string, end: string) => void;
  isPremium?: boolean;
  className?: string;
}

/**
 * Dumb Component: Erweiterte Benachrichtigungseinstellungen
 */
export const NotificationSettings = ({
  emailEnabled,
  onEmailChange,
  pushEnabled,
  onPushChange,
  smsEnabled,
  onSmsChange,
  daysBefore,
  onDaysBeforeChange,
  quietHoursStart,
  quietHoursEnd,
  onQuietHoursChange,
  isPremium = false,
  className,
}: NotificationSettingsProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-card/50 backdrop-blur-sm',
        'border border-border/30',
        className
      )}
    >
      <header className="mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Benachrichtigungseinstellungen
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Passe an, wie und wann du erinnert wirst
        </p>
      </header>

      <div className="space-y-5">
        {/* Email Notifications */}
        <label
          className={cn(
            'flex items-center justify-between p-4 rounded-xl cursor-pointer',
            'bg-background/50 border border-border/30',
            'transition-colors hover:bg-background'
          )}
        >
          <span className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">E-Mail</p>
              <p className="text-xs text-muted-foreground">Benachrichtigungen per E-Mail</p>
            </div>
          </span>
          <Switch checked={emailEnabled} onCheckedChange={onEmailChange} />
        </label>

        {/* Push Notifications */}
        <label
          className={cn(
            'flex items-center justify-between p-4 rounded-xl cursor-pointer',
            'bg-background/50 border border-border/30',
            'transition-colors hover:bg-background'
          )}
        >
          <span className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BellRing className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Push-Benachrichtigungen</p>
              <p className="text-xs text-muted-foreground">Browser-Benachrichtigungen</p>
            </div>
          </span>
          <Switch checked={pushEnabled} onCheckedChange={onPushChange} />
        </label>

        {/* SMS Notifications (Premium) */}
        <label
          className={cn(
            'flex items-center justify-between p-4 rounded-xl',
            'bg-background/50 border border-border/30',
            !isPremium && 'opacity-60 cursor-not-allowed'
          )}
        >
          <span className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <MessageSquare className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                SMS-Benachrichtigungen
                <Badge variant="outline" className="text-xs gap-1 bg-amber-500/10 text-amber-400 border-amber-500/30">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground">Kritische Erinnerungen per SMS</p>
            </div>
          </span>
          <Switch
            checked={smsEnabled && isPremium}
            onCheckedChange={onSmsChange}
            disabled={!isPremium}
          />
        </label>

        {/* Days Before Slider */}
        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Erinnerungsvorlauf</p>
                <p className="text-xs text-muted-foreground">Tage vor Fälligkeit</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {daysBefore} Tage
            </Badge>
          </div>
          <Slider
            value={[daysBefore]}
            onValueChange={(value) => onDaysBeforeChange(value[0])}
            min={1}
            max={30}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 Tag</span>
            <span>30 Tage</span>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Moon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Ruhezeiten</p>
              <p className="text-xs text-muted-foreground">Keine Benachrichtigungen in dieser Zeit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={quietHoursStart} onValueChange={(v) => onQuietHoursChange(v, quietHoursEnd)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                    {`${i.toString().padStart(2, '0')}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">bis</span>
            <Select value={quietHoursEnd} onValueChange={(v) => onQuietHoursChange(quietHoursStart, v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                    {`${i.toString().padStart(2, '0')}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};
