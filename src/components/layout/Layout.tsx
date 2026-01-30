import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      {/* Footer nur auf Desktop anzeigen, da Mobile Bottom Nav auf Mobile */}
      {!isMobile && <Footer />}
    </div>
  );
};
