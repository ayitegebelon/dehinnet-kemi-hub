import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import EmergencyButton from '@/components/safety/EmergencyButton';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      {user && <EmergencyButton />}
    </div>
  );
};

export default Layout;
