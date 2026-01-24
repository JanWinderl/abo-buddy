import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { StatCard } from '@/components/common/StatCard';
import { 
  Tv, 
  Music, 
  Dumbbell, 
  Cloud, 
  Newspaper, 
  Gamepad2,
  ShoppingBag,
  MoreHorizontal,
  Folder
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Kategorien-Übersicht Seite
 * Smart Component - aggregiert Daten nach Kategorien
 */
export default function Categories() {
  const { subscriptions } = useSubscriptions();

  const categoryIcons: Record<string, React.ReactNode> = {
    'Streaming': <Tv className="h-6 w-6" />,
    'Musik': <Music className="h-6 w-6" />,
    'Fitness': <Dumbbell className="h-6 w-6" />,
    'Cloud': <Cloud className="h-6 w-6" />,
    'Nachrichten': <Newspaper className="h-6 w-6" />,
    'Gaming': <Gamepad2 className="h-6 w-6" />,
    'Shopping': <ShoppingBag className="h-6 w-6" />,
    'Sonstiges': <MoreHorizontal className="h-6 w-6" />,
  };

  const categoryData = useMemo(() => {
    const categories: Record<string, { count: number; total: number; subscriptions: string[] }> = {};

    subscriptions.forEach((sub) => {
      const category = sub.category || 'Sonstiges';
      if (!categories[category]) {
        categories[category] = { count: 0, total: 0, subscriptions: [] };
      }
      categories[category].count += 1;
      categories[category].total += sub.price;
      categories[category].subscriptions.push(sub.name);
    });

    return Object.entries(categories)
      .map(([name, data]) => ({
        name,
        ...data,
        icon: categoryIcons[name] || <Folder className="h-6 w-6" />,
      }))
      .sort((a, b) => b.total - a.total);
  }, [subscriptions]);

  const totalCategories = categoryData.length;
  const totalMonthly = categoryData.reduce((sum, cat) => sum + cat.total, 0);
  const mostExpensiveCategory = categoryData[0]?.name || '-';

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Kategorien</h1>
          <p className="text-muted-foreground">
            Übersicht deiner Abonnements nach Kategorien.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Kategorien gesamt"
            value={totalCategories}
            icon={Folder}
          />
          <StatCard
            title="Gesamtkosten / Monat"
            value={`${totalMonthly.toFixed(2)}€`}
          />
          <StatCard
            title="Teuerste Kategorie"
            value={mostExpensiveCategory}
          />
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary">{category.count} Abos</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-foreground">
                    {category.total.toFixed(2)}€
                    <span className="text-sm font-normal text-muted-foreground"> / Monat</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Abonnements:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.subscriptions.slice(0, 4).map((name) => (
                      <Badge key={name} variant="outline" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                    {category.subscriptions.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.subscriptions.length - 4} weitere
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categoryData.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Noch keine Abonnements vorhanden.{' '}
                <Link to="/subscriptions" className="text-primary hover:underline">
                  Füge dein erstes Abo hinzu
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
