import { CreditCard, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">SubMate</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Der Abo-Killer gegen die Inflation. Behalte den Überblick über alle deine Abonnements 
              und spare bares Geld.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produkt</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="text-sm text-muted-foreground hover:text-foreground">
                  Kostenanalyse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@submate.de" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@submate.de
                </a>
              </li>
              <li>
                <a href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 SubMate - Web-Programmierung Prüfungsleistung WI2024
          </p>
        </div>
      </div>
    </footer>
  );
};
