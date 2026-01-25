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
  Quote
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

const stats = [
  { value: '50.000+', label: 'Aktive Nutzer' },
  { value: '234€', label: 'Ø Ersparnis/Jahr' },
  { value: '500.000+', label: 'Verwaltete Abos' },
  { value: '4.8/5', label: 'Nutzer-Bewertung' },
];

const testimonials = [
  {
    quote: 'SubMate hat mir geholfen, endlich den Überblick über meine 12 Abos zu behalten. Ich habe bereits 180€ gespart!',
    name: 'Sarah M.',
    role: 'Marketing Managerin',
  },
  {
    quote: 'Einfach genial! Keine vergessenen Kündigungsfristen mehr. Die Erinnerungsfunktion ist Gold wert.',
    name: 'Thomas K.',
    role: 'Software Developer',
  },
  {
    quote: 'Das Abo-Sharing Feature ist perfekt für unsere WG. Wir teilen jetzt fair alle gemeinsamen Abos.',
    name: 'Julia R.',
    role: 'Studentin',
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
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
                <Link to="/pricing">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              SubMate in Zahlen
            </h2>
            <p className="text-primary-foreground/80">
              Vertrauen durch tausende zufriedene Nutzer
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/80 text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Das sagen unsere Nutzer
            </h2>
            <p className="text-lg text-muted-foreground">
              Echte Erfahrungen von echten Menschen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="relative transition-all hover:shadow-lg">
                <CardContent className="pt-8 pb-6">
                  <div className="absolute top-4 left-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-primary to-accent rounded-full" />
                  </div>
                  <div className="pl-6">
                    <Quote className="h-6 w-6 text-primary/20 mb-4" />
                    <p className="text-muted-foreground italic mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Bereit, Geld zu sparen?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Starte jetzt kostenlos und behalte den Überblick über alle deine Abonnements.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/pricing">
              Jetzt starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
