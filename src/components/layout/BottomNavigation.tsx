import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Sparkles, ShieldAlert, Siren, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/what-if', icon: Sparkles, label: 'What If' },
  { to: '/risk-engine', icon: ShieldAlert, label: 'Risk' },
  { to: '/emergency-response', icon: Siren, label: 'SOS' },
  { to: '/chemicals', icon: Database, label: 'DB' },
];

const BottomNavigation: React.FC = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[56px]',
                isActive ? 'text-primary bg-primary/10 scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-all', isActive && 'animate-pulse')} />
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>{item.label}</span>
            </Link>
          );
        })}
        <Link
          to="/profile"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[56px]',
            location.pathname === '/profile' ? 'text-primary bg-primary/10 scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-[9px] font-medium">
              {profile?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className={cn('text-[10px] font-medium', location.pathname === '/profile' && 'font-semibold')}>Me</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
