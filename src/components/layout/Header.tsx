import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Menu, LogOut } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from './ThemeToggle';
import NotificationBell from '@/components/notifications/NotificationBell';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import logo from '@/assets/logo.png';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const languageOptions = [
    { code: 'am', label: 'አማ', name: 'Amharic' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'or', label: 'OR', name: 'Oromiffa' },
  ] as const;

  const currentLang = languageOptions.find(l => l.code === language) || languageOptions[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="ethiopian-stripe" />
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            {user && <SidebarTrigger className="-ml-1" />}
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src={logo} alt="ደህንነት ኬሚ" className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-bold text-foreground font-amharic hidden sm:inline">ደህንነት ኬሚ</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <NotificationBell />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2.5">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">{currentLang.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-primary/10' : ''}
                  >
                    <span className="font-medium mr-2">{lang.label}</span>
                    <span className="text-muted-foreground">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {!user ? (
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" asChild className="h-9">
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild className="h-9 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Link to="/signup">{t('nav.signup')}</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-medium">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <span className="truncate">{profile?.full_name || 'Profile'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscription')} className="cursor-pointer">
                    {t('nav.subscription')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {language === 'am' ? 'ውጣ' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
