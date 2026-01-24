import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings as SettingsIcon, Palette, Globe, Database, Bell } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Einstellungen-Seite
 * Smart Component - verwaltet App-Einstellungen
 */
export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'de',
    currency: 'EUR',
    autoRefresh: true,
    compactView: false,
    animations: true,
  });

  const handleSave = () => {
    toast({
      title: 'Einstellungen gespeichert',
      description: 'Deine Einstellungen wurden erfolgreich aktualisiert.',
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Einstellungen</h1>
          <p className="text-muted-foreground">
            Passe SubMate an deine Bedürfnisse an.
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Erscheinungsbild
              </CardTitle>
              <CardDescription>
                Passe das Aussehen der Anwendung an
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Farbschema</Label>
                  <p className="text-sm text-muted-foreground">
                    Wähle zwischen hell, dunkel oder System
                  </p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Hell</SelectItem>
                    <SelectItem value="dark">Dunkel</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Kompakte Ansicht</Label>
                  <p className="text-sm text-muted-foreground">
                    Zeige mehr Inhalte auf kleineren Bildschirmen
                  </p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, compactView: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animationen</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktiviere sanfte Übergangseffekte
                  </p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, animations: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Lokalisierung
              </CardTitle>
              <CardDescription>
                Sprache und regionale Einstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sprache</Label>
                  <p className="text-sm text-muted-foreground">
                    Wähle deine bevorzugte Sprache
                  </p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Währung</Label>
                  <p className="text-sm text-muted-foreground">
                    Standardwährung für Preise
                  </p>
                </div>
                <Select
                  value={settings.currency}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="CHF">Schweizer Franken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data & Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Daten & Synchronisation
              </CardTitle>
              <CardDescription>
                Verwalte deine Daten und Synchronisierung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatische Aktualisierung</Label>
                  <p className="text-sm text-muted-foreground">
                    Daten automatisch im Hintergrund aktualisieren
                  </p>
                </div>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, autoRefresh: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                  Daten exportieren
                </Button>
                <Button variant="outline" className="flex-1">
                  Daten importieren
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Einstellungen speichern
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
