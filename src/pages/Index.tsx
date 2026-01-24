import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Bell, 
  PieChart, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Star,
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

const benefits = [
  'Durchschnittlich 47€ Ersparnis pro Monat',
  'Nie wieder vergessene Kündigungsfristen',
  'Kostenlose Nutzung für Einzelpersonen',
  'Keine versteckten Gebühren',
];

const stats = [
  { value: '50.000+', label: 'Aktive Nutzer' },
  { value: '234€', label: 'Ø Ersparnis/Jahr' },
  { value: '500.000+', label: 'Verwaltete Abos' },
  { value: '4.8/5', label: 'Nutzer-Bewertung' },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '0€',
    period: '/Monat',
    features: ['Bis zu 5 Abos', 'Basis Erinnerungen', 'Mobile App', 'Kosten-Übersicht'],
    buttonText: 'Kostenlos starten',
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Premium',
    price: '4,99€',
    period: '/Monat',
    features: ['Unbegrenzte Abos', 'Erweiterte Analytics', 'Abo-Sharing', 'Budget-Management', 'Kalender-Sync', 'Priority Support'],
    buttonText: 'Jetzt upgraden',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Business',
    price: '14,99€',
    period: '/Monat',
    features: ['Alles aus Premium', 'Team-Funktionen', 'API-Zugang', 'Custom Branding', 'Dedizierter Support'],
    buttonText: 'Kontakt',
    buttonVariant: 'outline' as const,
    popular: false,
  },
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
                <Link to="/dashboard">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
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

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Transparent & Fair
            </h2>
            <p className="text-lg text-muted-foreground">
              Wähle den Plan, der zu dir passt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative transition-all hover:shadow-xl ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Beliebt
                    </Badge>
                  </div>
                )}
                <CardContent className="pt-8 pb-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${plan.popular ? 'text-primary' : 'text-foreground'}`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.buttonVariant} 
                    className="w-full"
                    asChild
                  >
                    <Link to="/dashboard">{plan.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
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
