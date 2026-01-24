import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  HelpCircle, 
  User, 
  Crown, 
  Shield, 
  BookOpen,
  CreditCard,
  Bell,
  BarChart3,
  Settings
} from 'lucide-react';

/**
 * Hilfe & Anleitung Seite
 * Dokumentation für Benutzer inkl. Rollenwechsel-Anleitung
 */
export default function Help() {
  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Hilfe & Anleitung</h1>
          <p className="text-muted-foreground">
            Alles was du über SubMate wissen musst.
          </p>
        </div>

        {/* Role System Guide */}
        <Card className="mb-8 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Rollensystem - Anleitung zum Rollenwechsel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              SubMate verwendet ein Rollensystem mit drei verschiedenen Benutzerrollen. 
              Jede Rolle hat unterschiedliche Berechtigungen und Funktionen.
            </p>

            {/* How to switch roles */}
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">
                So wechselst du die Rolle:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Klicke auf den <strong>Rollen-Selektor</strong> im Header (oben rechts)</li>
                <li>Wähle zwischen <Badge variant="secondary">Benutzer</Badge>, <Badge>Premium</Badge> oder <Badge variant="destructive">Admin</Badge></li>
                <li>Die Anwendung passt sich sofort an die neue Rolle an</li>
              </ol>
            </div>

            {/* Role Details */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4" />
                    Benutzer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Abos verwalten</li>
                    <li>✓ Erinnerungen erstellen</li>
                    <li>✓ Kostenübersicht</li>
                    <li>✗ Erweiterte Analysen</li>
                    <li>✗ Admin-Bereich</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Crown className="h-4 w-4 text-primary" />
                    Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Alle Benutzer-Features</li>
                    <li>✓ Personalisierte Spartipps</li>
                    <li>✓ Erweiterte Analysen</li>
                    <li>✓ Prognosen & Trends</li>
                    <li>✗ Admin-Bereich</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-4 w-4 text-destructive" />
                    Admin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Alle Premium-Features</li>
                    <li>✓ Benutzerverwaltung</li>
                    <li>✓ System-Statistiken</li>
                    <li>✓ Job-Management</li>
                    <li>✓ Voller Systemzugriff</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Feature Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Funktionsübersicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Abonnements verwalten</h4>
                    <p className="text-sm text-muted-foreground">
                      Füge alle deine Abos hinzu, bearbeite sie und behalte den Überblick.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Erinnerungen</h4>
                    <p className="text-sm text-muted-foreground">
                      Verpasse keine Kündigungsfristen mehr mit automatischen Erinnerungen.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Kostenanalyse</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualisiere deine monatlichen und jährlichen Abo-Kosten.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Einstellungen</h4>
                    <p className="text-sm text-muted-foreground">
                      Passe SubMate an deine Bedürfnisse an.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Häufig gestellte Fragen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Wie füge ich ein neues Abo hinzu?</AccordionTrigger>
                <AccordionContent>
                  Gehe zur Seite "Abonnements" und klicke auf "Abo hinzufügen". 
                  Fülle das Formular mit Name, Preis, Abrechnungszyklus und Kategorie aus.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Wie erstelle ich eine Erinnerung?</AccordionTrigger>
                <AccordionContent>
                  Navigiere zu "Erinnerungen" und klicke auf "Neue Erinnerung". 
                  Wähle das zugehörige Abo, das Datum und eine Nachricht aus.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Was ist der Unterschied zwischen den Rollen?</AccordionTrigger>
                <AccordionContent>
                  Benutzer haben Zugriff auf Basis-Funktionen. Premium-Nutzer erhalten 
                  erweiterte Analysen und Spartipps. Admins haben vollen Systemzugriff 
                  inkl. Benutzerverwaltung.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Werden meine Daten gespeichert?</AccordionTrigger>
                <AccordionContent>
                  Ja, alle Daten werden sicher in unserer Datenbank gespeichert. 
                  Du kannst deine Daten jederzeit exportieren oder löschen.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Wie kann ich ein Abo kündigen?</AccordionTrigger>
                <AccordionContent>
                  SubMate zeigt dir nur die Kündigungsfristen an. Die eigentliche Kündigung 
                  musst du beim jeweiligen Anbieter durchführen. Wir erinnern dich rechtzeitig!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
