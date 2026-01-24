import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/contexts/RoleContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { StatCard } from '@/components/common/StatCard';
import { User, Mail, Bell, Shield, CreditCard, Crown } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Benutzer-Profil Seite
 * Smart Component - verwaltet User-State und Einstellungen
 */
export default function Profile() {
  const { currentRole } = useRole();
  const { costAnalysis, activeSubscriptions } = useSubscriptions();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
  });

  const handleSave = () => {
    toast({
      title: 'Profil gespeichert',
      description: 'Deine Änderungen wurden erfolgreich gespeichert.',
    });
  };

  const roleDisplay = {
    user: { label: 'Benutzer', icon: User, color: 'secondary' as const },
    premium: { label: 'Premium', icon: Crown, color: 'default' as const },
    admin: { label: 'Administrator', icon: Shield, color: 'destructive' as const },
  };

  const roleInfo = roleDisplay[currentRole];

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mein Profil</h1>
          <p className="text-muted-foreground">
            Verwalte deine persönlichen Einstellungen und Kontodaten.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Aktive Abos"
            value={activeSubscriptions.length}
            icon={CreditCard}
          />
          <StatCard
            title="Monatliche Kosten"
            value={`${costAnalysis.totalMonthly.toFixed(2)}€`}
            icon={CreditCard}
          />
          <StatCard
            title="Aktuelle Rolle"
            value={roleInfo.label}
            icon={roleInfo.icon}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Persönliche Daten
              </CardTitle>
              <CardDescription>
                Aktualisiere deine Kontoinformationen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Max Mustermann" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" defaultValue="max@beispiel.de" />
              </div>
              <Button onClick={handleSave} className="w-full">
                Änderungen speichern
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Benachrichtigungen
              </CardTitle>
              <CardDescription>
                Konfiguriere wann und wie du benachrichtigt wirst
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-Mail Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Erhalte Erinnerungen per E-Mail
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push-Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Browser-Benachrichtigungen aktivieren
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Kündigungs-Erinnerungen</Label>
                  <p className="text-sm text-muted-foreground">
                    7 Tage vor Ablauf erinnern
                  </p>
                </div>
                <Switch
                  checked={notifications.reminders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, reminders: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Konto-Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Aktuelle Rolle</span>
                <Badge variant={roleInfo.color}>
                  {roleInfo.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Konto erstellt</span>
                <span className="text-foreground">15. Januar 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Letzte Anmeldung</span>
                <span className="text-foreground">Heute, 10:30 Uhr</span>
              </div>
              
              {currentRole === 'user' && (
                <>
                  <Separator />
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-foreground font-medium mb-2">
                      Upgrade auf Premium
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Erhalte personalisierte Spartipps und erweiterte Analysen.
                    </p>
                    <Button size="sm" className="w-full">
                      <Crown className="mr-2 h-4 w-4" />
                      Premium entdecken
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
              <CardDescription>
                Irreversible Aktionen für dein Konto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Alle Daten exportieren
              </Button>
              <Button variant="destructive" className="w-full">
                Konto löschen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
