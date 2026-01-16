import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  FlaskConical, 
  Atom, 
  Shield, 
  Calculator, 
  User, 
  LogOut, 
  Menu,
  Globe,
  LayoutDashboard,
  CreditCard,
  Settings,
  X
} from 'lucide-react';
import logo from '@/assets/logo.png';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/recipes', label: t('nav.recipes'), icon: FlaskConical },
    { path: '/periodic-table', label: t('nav.periodic'), icon: Atom },
    { path: '/calculator', label: t('nav.calculator'), icon: Calculator },
    { path: '/safety', label: t('nav.safety'), icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languageOptions = [
    { code: 'am', label: 'አማ', name: 'Amharic' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'or', label: 'OR', name: 'Oromiffa' },
  ] as const;

  const currentLang = languageOptions.find(l => l.code === language) || languageOptions[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Ethiopian Heritage Stripe */}
      <div className="ethiopian-stripe" />
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src={logo} alt="ደህንነት ኬሚ" className="h-10 w-10 rounded-lg object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground font-amharic">ደህንነት ኬሚ</h1>
              <p className="text-xs text-muted-foreground">Safety First</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {user && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{currentLang.label}</span>
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">
                      {profile?.full_name?.split(' ')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {profile?.subscription_tier && (
                      <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
                        profile.subscription_tier === 'premium' ? 'bg-ethiopian-gold/20 text-ethiopian-gold' :
                        profile.subscription_tier === 'institution' ? 'bg-science/20 text-science' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {profile.subscription_tier === 'premium' ? '⭐ Premium' : 
                         profile.subscription_tier === 'institution' ? '🏛️ Institution' : 
                         '🆓 Free'}
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscription" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {t('nav.subscription')}
                    </Link>
                  </DropdownMenuItem>
                  {(isAdmin || isSuperAdmin) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Link to="/signup">{t('nav.signup')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && user && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              {(isAdmin || isSuperAdmin) && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>{t('nav.admin')}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
