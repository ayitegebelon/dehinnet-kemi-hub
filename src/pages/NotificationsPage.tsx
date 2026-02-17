import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const typeIcons: Record<string, string> = {
  new_lesson: '📚', quiz_deadline: '⏰', streak_reminder: '🔥',
  achievement: '🏆', certificate: '🎓', info: 'ℹ️',
};

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const fetchAll = async () => {
    const { data } = await supabase
      .from('notifications').select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user!.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success(language === 'am' ? 'ሁሉም ተነበቡ' : 'All marked as read');
  };

  const deleteAll = async () => {
    await supabase.from('notifications').delete().eq('user_id', user!.id);
    setNotifications([]);
    toast.success(language === 'am' ? 'ሁሉም ተሰርዘዋል' : 'All notifications cleared');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            {language === 'am' ? 'ማሳወቂያዎች' : 'Notifications'}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <Check className="h-3.5 w-3.5 mr-1" />
              {language === 'am' ? 'ሁሉንም አንብብ' : 'Read all'}
            </Button>
            <Button variant="outline" size="sm" onClick={deleteAll} className="text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {language === 'am' ? 'አጽዳ' : 'Clear'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">{language === 'am' ? 'ምንም ማሳወቂያ የለም' : 'No notifications'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card key={n.id} className={cn(!n.is_read && 'border-primary/30 bg-primary/5')}>
                <CardContent className="flex gap-3 py-4">
                  <span className="text-2xl">{typeIcons[n.type] || 'ℹ️'}</span>
                  <div className="flex-1">
                    <p className={cn('text-sm', !n.is_read && 'font-semibold')}>
                      {language === 'am' ? n.title_am : n.title_en}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'am' ? n.message_am : n.message_en}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1" />}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
