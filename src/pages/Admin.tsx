import { Layout } from '@/components/layout/Layout';
import { useRole } from '@/contexts/RoleContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Shield,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock users for admin view
const mockUsers = [
  { id: '1', name: 'Max Mustermann', email: 'max@example.com', role: 'premium', subscriptions: 8, monthlySpend: 137.84 },
  { id: '2', name: 'Anna Schmidt', email: 'anna@example.com', role: 'user', subscriptions: 4, monthlySpend: 45.96 },
  { id: '3', name: 'Tim Weber', email: 'tim@example.com', role: 'premium', subscriptions: 12, monthlySpend: 189.50 },
  { id: '4', name: 'Lisa Müller', email: 'lisa@example.com', role: 'user', subscriptions: 3, monthlySpend: 29.97 },
];

export default function Admin() {
  const { currentRole } = useRole();
  const { subscriptions, costAnalysis } = useSubscriptions();

  // Redirect non-admin users
  if (currentRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const stats = [
    {
      title: 'Gesamtnutzer',
      value: mockUsers.length,
      icon: Users,
      change: '+12%',
    },
    {
      title: 'Aktive Abos',
      value: subscriptions.filter((s) => s.isActive).length,
      icon: CreditCard,
      change: '+5%',
    },
    {
      title: 'Durchschn. Ausgaben',
      value: `${(mockUsers.reduce((sum, u) => sum + u.monthlySpend, 0) / mockUsers.length).toFixed(2)}€`,
      icon: TrendingUp,
      change: '-3%',
    },
    {
      title: 'Premium-Nutzer',
      value: mockUsers.filter((u) => u.role === 'premium').length,
      icon: Shield,
      change: '+20%',
    },
  ];

  const handleExport = () => {
    toast.success('Daten werden exportiert...');
  };

  const handleRefresh = () => {
    toast.success('Daten aktualisiert');
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Admin-Bereich</h1>
            </div>
            <p className="text-muted-foreground">
              Verwalte Nutzer und überwache die Plattform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Admin Notice */}
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Admin-Zugang aktiv</p>
              <p className="text-sm text-muted-foreground">
                Du hast vollen Zugriff auf alle Nutzer- und Systemdaten. Änderungen hier wirken sich 
                auf alle Nutzer aus.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} zum Vormonat
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Nutzerverwaltung</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead className="text-right">Abos</TableHead>
                  <TableHead className="text-right">Monatl. Ausgaben</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'premium' ? 'default' : 'secondary'}>
                        {user.role === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{user.subscriptions}</TableCell>
                    <TableCell className="text-right">{user.monthlySpend.toFixed(2)}€</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>System-Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API-Status</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Datenbank</span>
                <Badge variant="default">Verbunden</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Letztes Backup</span>
                <span className="text-sm text-foreground">Heute, 03:00 Uhr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version</span>
                <span className="text-sm text-foreground">1.0.0 (MVP)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Nutzer einladen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Monatsbericht generieren
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Cache leeren
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
