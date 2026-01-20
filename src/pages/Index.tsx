import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { 
  CreditCard, 
  Bell, 
  PieChart, 
  Users, 
  ArrowRight, 
  CheckCircle,
  TrendingDown,
  Shield
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const features = [
  {
    icon: CreditCard,
    title: 'Alle Abos im Blick',
    description: 'Verwalte Netflix, Spotify, iCloud und alle anderen Abonnements an einem zentralen Ort.',
  },
  {
    icon: Bell,
    title: 'Kündigungsfristen',
    description: 'Erhalte rechtzeitig Erinnerungen bevor sich Abos automatisch verlängern.',
  },
  {
    icon: PieChart,
    title: 'Kosten-Analyse',
    description: 'Detaillierte Aufschlüsselung deiner Ausgaben nach Kategorie und pro Kopf.',
  },
  {
    icon: Users,
    title: 'Haushalts-Splitting',
    description: 'Berechne die Kosten pro Person für geteilte Abonnements.',
  },
];

const benefits = [
  'Durchschnittlich 47€ Ersparnis pro Monat',
  'Nie wieder vergessene Kündigungsfristen',
  'Kostenlose Nutzung für Einzelpersonen',
  'Keine versteckten Gebühren',
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Der Abo-Killer gegen die Inflation</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Behalte den Überblick über
              <span className="text-primary"> alle deine Abos</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Streaming, Gym, iCloud, Software – jeder hat zu viele Abos und vergisst 
              Kündigungsfristen. SubMate hilft dir, bares Geld zu sparen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/dashboard">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/subscriptions">
                  Demo ansehen
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Datensicherheit</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Kostenlos testen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Alles was du brauchst
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SubMate bietet dir alle Werkzeuge, um deine Abonnements effizient zu verwalten 
              und unnötige Kosten zu vermeiden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Spare bares Geld mit SubMate
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Die meisten Menschen geben mehr für Abonnements aus als sie denken. 
                Mit SubMate behältst du den Überblick und kündigst rechtzeitig, was du nicht brauchst.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Card className="p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Durchschnittliche Ersparnis</p>
                <p className="text-5xl md:text-6xl font-bold text-primary mb-2">564€</p>
                <p className="text-muted-foreground">pro Jahr</p>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Basierend auf 500+ Nutzern, die ihre Abos mit SubMate optimiert haben
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Bereit, Geld zu sparen?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Starte jetzt kostenlos und behalte den Überblick über alle deine Abonnements.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/dashboard">
              Kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
