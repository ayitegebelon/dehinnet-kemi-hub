import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Atom, 
  Calculator, 
  Shield,
  FolderKanban
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelKey: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/recipes', icon: FlaskConical, labelKey: 'nav.recipes' },
  { to: '/projects', icon: FolderKanban, labelKey: 'nav.home' },
  { to: '/periodic-table', icon: Atom, labelKey: 'nav.periodic' },
  { to: '/calculator', icon: Calculator, labelKey: 'nav.calculator' },
  { to: '/safety', icon: Shield, labelKey: 'nav.safety' },
];

const BottomNavigation: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  // Only show for authenticated users
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[56px]",
                isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-lg transition-all duration-300",
                isActive && "bg-primary/20"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive && "animate-pulse"
                )} />
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-primary/20 animate-ping opacity-75" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium truncate max-w-[56px] text-center leading-tight",
                isActive && "font-semibold"
              )}>
                {item.labelKey === 'nav.home' ? (t('nav.home') === 'Home' ? 'Projects' : 'ፕሮጀክቶች') : t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
