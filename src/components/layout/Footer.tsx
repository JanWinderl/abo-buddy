import { CreditCard, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">SubMate</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Der Abo-Killer gegen die Inflation. Behalte den Überblick über alle deine Abonnements 
              und spare bares Geld.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Kostenanalyse
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preise
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/agb" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:info@submate.de" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info@submate.de
                </a>
              </li>
              <li>
                <a 
                  href="tel:+4915123456789" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  +49 151 234 567 89
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 SubMate. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};
