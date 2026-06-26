import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FlaskConical, Atom, Calculator, Shield, FolderKanban,
  User, Settings, LogOut, Bell, Bot, BookOpen, Blocks, Zap, Timer,
  Beaker, Wrench, ChevronDown, Search, Sparkles, HeartPulse, Wand2,
  Wind, ScanLine, ShieldAlert, Siren, Gauge, Database,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInput, useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface NavItem { path: string; label: string; icon: React.ElementType; }
interface NavGroup { label: string; icon: React.ElementType; items: NavItem[]; }

const AppSidebar: React.FC = () => {
  const { t, language } = useLanguage();
  const isAm = language === 'am';
  const { user, profile, signOut, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [search, setSearch] = useState('');

  const navGroups: NavGroup[] = [
    {
      label: isAm ? 'ዋና' : 'Overview',
      icon: LayoutDashboard,
      items: [{ path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard }],
    },
    {
      label: isAm ? 'ራስ-ገዝ ስርዓት' : 'Autonomous System',
      icon: Zap,
      items: [
        { path: '/investigation', label: isAm ? 'ሙሉ የደህንነት ምርመራ' : 'Full Safety Investigation', icon: Zap },
      ],
    },
    {
      label: isAm ? 'AI ደህንነት' : 'AI Safety',
      icon: Sparkles,
      items: [
        { path: '/what-if', label: isAm ? '"ምን ቢሆንስ?"' : 'What If? Predictor', icon: Sparkles },
        { path: '/human-impact', label: isAm ? 'የሰው አካል ተጽዕኖ' : 'Human Impact', icon: HeartPulse },
        { path: '/simplify', label: isAm ? 'በቀላል ግለጽ' : 'Simplify', icon: Wand2 },
        { path: '/environment', label: isAm ? 'የአካባቢ ደህንነት' : 'Environment-Aware', icon: Wind },
        { path: '/label-interpreter', label: isAm ? 'መለያ ተርጓሚ' : 'Label Interpreter', icon: ScanLine },
        { path: '/risk-engine', label: isAm ? 'አደጋ ስርዓት' : 'Risk Engine', icon: ShieldAlert },
        { path: '/lab-safety-score', label: isAm ? 'የላብ ነጥብ' : 'Lab Safety Score', icon: Gauge },
        { path: '/ai-assistant', label: isAm ? 'AI ረዳት' : 'AI Assistant', icon: Bot },
      ],
    },
    {
      label: isAm ? 'አደጋ' : 'Emergency',
      icon: Siren,
      items: [
        { path: '/emergency-response', label: isAm ? 'የአደጋ ምላሽ' : 'Emergency Response', icon: Siren },
        { path: '/safety', label: t('nav.safety'), icon: Shield },
      ],
    },
    {
      label: isAm ? 'ማመሳከሪያ' : 'Reference',
      icon: Wrench,
      items: [
        { path: '/chemicals', label: isAm ? 'ኬሚካል ዳታቤዝ' : 'Chemical Database', icon: Database },
        { path: '/periodic-table', label: t('nav.periodic'), icon: Atom },
        { path: '/calculator', label: t('nav.calculator'), icon: Calculator },
      ],
    },
    {
      label: isAm ? 'ላብራቶሪ' : 'Lab Tools',
      icon: Beaker,
      items: [
        { path: '/recipes', label: t('nav.recipes'), icon: FlaskConical },
        { path: '/projects', label: isAm ? 'ፕሮጀክቶች' : 'Projects', icon: FolderKanban },
        { path: '/molecule-builder', label: isAm ? 'ሞለኪዩል ገንቢ' : 'Molecule Builder', icon: Blocks },
        { path: '/reaction-simulator', label: isAm ? 'የምላሽ ሲሙሌተር' : 'Reaction Simulator', icon: Zap },
        { path: '/lab-timer', label: isAm ? 'ላብ ሰዓት ቆጣሪ' : 'Lab Timer', icon: Timer },
        { path: '/lab-notebook', label: isAm ? 'ላብ ማስታወሻ' : 'Lab Notebook', icon: BookOpen },
      ],
    },
    {
      label: isAm ? 'ሌላ' : 'Other',
      icon: Bell,
      items: [{ path: '/notifications', label: isAm ? 'ማሳወቂያዎች' : 'Notifications', icon: Bell }],
    },
  ];

  const accountNav: NavItem[] = [{ path: '/profile', label: t('nav.profile'), icon: User }];

  const isActive = (path: string) => location.pathname === path;
  const groupHasActive = (items: NavItem[]) => items.some((i) => isActive(i.path));
  const query = search.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!query) return navGroups;
    return navGroups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(query)) }))
      .filter((g) => g.items.length > 0);
  }, [query, language]);

  const filteredAccount = useMemo(() => {
    if (!query) return accountNav;
    return accountNav.filter((i) => i.label.toLowerCase().includes(query));
  }, [query, language]);

  const showAdmin = (isAdmin || isSuperAdmin) && (!query || 'admin'.includes(query));

  if (!user) return null;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-sidebar-border', collapsed && 'justify-center px-2')}>
        <img src={logo} alt="Dehinnet Kemi AI" className="h-9 w-9 rounded-lg object-contain flex-shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-foreground truncate">Dehinnet Kemi AI</h1>
            <p className="text-[10px] text-muted-foreground">Smart Chemistry Safety</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <SidebarInput placeholder={isAm ? 'ፈልግ...' : 'Search…'} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
          </div>
        </div>
      )}

      <SidebarContent className="scrollbar-thin">
        {filteredGroups.map((group) => {
          if (!query && group.items.length === 1) {
            const item = group.items[0];
            return (
              <SidebarGroup key={group.label}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            );
          }
          if (collapsed) {
            return (
              <SidebarGroup key={group.label}>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.label}>
                        <Link to={item.path}><item.icon className="h-4 w-4 flex-shrink-0" /></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            );
          }
          return (
            <Collapsible key={group.label} defaultOpen={!!query || groupHasActive(group.items)} className="group/collapsible">
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center justify-between pr-2">
                    <span className="flex items-center gap-2"><group.icon className="h-3.5 w-3.5" />{group.label}</span>
                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton asChild isActive={isActive(item.path)}>
                            <Link to={item.path} className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {(filteredAccount.length > 0 || showAdmin) && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAccount.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={collapsed ? item.label : undefined}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {showAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/admin')} tooltip={collapsed ? t('nav.admin') : undefined}>
                      <Link to="/admin" className="flex items-center gap-3">
                        <Settings className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{t('nav.admin')}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-medium">
                {profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <button onClick={() => signOut()} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => signOut()} className="mx-auto p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
