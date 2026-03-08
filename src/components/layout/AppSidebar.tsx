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
  FolderKanban,
  GraduationCap,
  Brain,
  MessagesSquare,
  CreditCard,
  User,
  Settings,
  LogOut,
  Trophy,
  Bell,
  Award,
  BarChart3,
  Bot,
  BookOpen,
  Blocks,
  Zap,
  Timer,
  Beaker,
  Users,
  Wrench,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { ChevronDown } from 'lucide-react';

const AppSidebar: React.FC = () => {
  const { t, language } = useLanguage();
  const isAm = language === 'am';
  const { user, profile, signOut, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  if (!user) return null;

  const navGroups = [
    {
      label: isAm ? 'ዋና' : 'Overview',
      icon: LayoutDashboard,
      items: [
        { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      ],
    },
    {
      label: isAm ? 'ትምህርት' : 'Learning',
      icon: GraduationCap,
      items: [
        { path: '/learn', label: isAm ? 'ትምህርት' : 'Courses', icon: GraduationCap },
        { path: '/flashcards', label: isAm ? 'ፍላሽ ካርድ' : 'Flashcards', icon: Brain },
        { path: '/element-quiz', label: isAm ? 'የንጥረ ነገር ጥያቄ' : 'Element Quiz', icon: Brain },
        { path: '/certificates', label: isAm ? 'ምስክር ወረቀቶች' : 'Certificates', icon: Award },
        { path: '/analytics', label: isAm ? 'ትንተና' : 'Analytics', icon: BarChart3 },
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
      label: isAm ? 'መሣሪያዎች' : 'Reference',
      icon: Wrench,
      items: [
        { path: '/periodic-table', label: t('nav.periodic'), icon: Atom },
        { path: '/calculator', label: t('nav.calculator'), icon: Calculator },
        { path: '/safety', label: t('nav.safety'), icon: Shield },
        { path: '/ai-assistant', label: isAm ? 'AI ረዳት' : 'AI Assistant', icon: Bot },
      ],
    },
    {
      label: isAm ? 'ማህበረሰብ' : 'Community',
      icon: Users,
      items: [
        { path: '/discussion', label: isAm ? 'ውይይት' : 'Discussion', icon: MessagesSquare },
        { path: '/leaderboard', label: isAm ? 'ደረጃ ሰንጠረዥ' : 'Leaderboard', icon: Trophy },
        { path: '/notifications', label: isAm ? 'ማሳወቂያዎች' : 'Notifications', icon: Bell },
      ],
    },
  ];

  const accountNav = [
    { path: '/profile', label: t('nav.profile'), icon: User },
    { path: '/subscription', label: t('nav.subscription'), icon: CreditCard },
  ];

  const isActive = (path: string) => location.pathname === path;
  const groupHasActive = (items: { path: string }[]) => items.some(i => isActive(i.path));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <img src={logo} alt="ደህንነት ኬሚ" className="h-9 w-9 rounded-lg object-contain flex-shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-foreground font-amharic truncate">ደህንነት ኬሚ</h1>
            <p className="text-[10px] text-muted-foreground">Safety First Chemistry</p>
          </div>
        )}
      </div>

      <SidebarContent className="scrollbar-thin">
        {navGroups.map((group) => {
          // Dashboard standalone - no collapsible
          if (group.items.length === 1) {
            const item = group.items[0];
            return (
              <SidebarGroup key={group.label}>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      tooltip={collapsed ? item.label : undefined}
                    >
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
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={item.label}
                      >
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            );
          }

          return (
            <Collapsible key={group.label} defaultOpen={groupHasActive(group.items)} className="group/collapsible">
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center justify-between pr-2">
                    <span className="flex items-center gap-2">
                      <group.icon className="h-3.5 w-3.5" />
                      {group.label}
                    </span>
                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.path)}
                            tooltip={collapsed ? item.label : undefined}
                          >
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

        {/* Account */}
        <Collapsible defaultOpen={groupHasActive(accountNav)} className="group/collapsible">
          <SidebarGroup>
            {!collapsed && (
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center justify-between pr-2">
                  <span className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    {isAm ? 'መለያ' : 'Account'}
                  </span>
                  <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountNav.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={collapsed ? item.label : undefined}
                      >
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {(isAdmin || isSuperAdmin) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin')}
                        tooltip={collapsed ? t('nav.admin') : undefined}
                      >
                        <Link to="/admin" className="flex items-center gap-3">
                          <Settings className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && <span className="truncate">{t('nav.admin')}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-medium">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut()}
            className="mx-auto p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
