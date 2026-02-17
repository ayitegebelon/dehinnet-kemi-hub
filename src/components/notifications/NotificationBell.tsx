import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, string> = {
  new_lesson: '📚',
  quiz_deadline: '⏰',
  streak_reminder: '🔥',
  achievement: '🏆',
  certificate: '🎓',
  info: 'ℹ️',
};

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Subscribe to realtime
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setNotifications(prev => [payload.new as any, ...prev]);
          setUnreadCount(prev => prev + 1);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    }
  };

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user!.id)
      .eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return language === 'am' ? 'አሁን' : 'now';
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h4 className="text-sm font-semibold">
            {language === 'am' ? 'ማሳወቂያዎች' : 'Notifications'}
          </h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              {language === 'am' ? 'ሁሉንም አንብብ' : 'Mark all read'}
            </button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {language === 'am' ? 'ምንም ማሳወቂያ የለም' : 'No notifications yet'}
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => { if (!n.is_read) markRead(n.id); }}
                className={cn(
                  'flex gap-3 p-3 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors',
                  !n.is_read && 'bg-primary/5'
                )}
              >
                <span className="text-lg flex-shrink-0">{typeIcons[n.type] || 'ℹ️'}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !n.is_read && 'font-semibold')}>
                    {language === 'am' ? n.title_am : n.title_en}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {language === 'am' ? n.message_am : n.message_en}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </ScrollArea>
        <div className="p-2 border-t border-border">
          <Button asChild variant="ghost" size="sm" className="w-full text-xs">
            <Link to="/notifications" onClick={() => setOpen(false)}>
              {language === 'am' ? 'ሁሉንም ይመልከቱ' : 'View all notifications'}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
