import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import AppSidebar from './AppSidebar';
import EmergencyButton from '@/components/safety/EmergencyButton';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

function getSidebarDefault(): boolean {
  const match = document.cookie.match(/(?:^|;\s*)sidebar:state=([^;]*)/);
  return match ? match[1] === 'true' : true;
}

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const { user } = useAuth();

  return (
    <SidebarProvider defaultOpen={getSidebarDefault()}>
      <div className="min-h-screen flex w-full">
        {user && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          {showFooter && <Footer />}
          {user && <EmergencyButton />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
