import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Flame, Target, Crown } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  skill_level: string;
  completed_lessons: number;
  avg_quiz_score: number;
  current_streak: number;
  total_points: number;
}

const LeaderboardPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // Query the leaderboard view
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url, skill_level');
    
    if (data) {
      // Get progress data for all users
      const { data: allProgress } = await supabase
        .from('user_progress')
        .select('user_id, completed, quiz_score');
      
      const { data: allStreaks } = await supabase
        .from('study_streaks')
        .select('user_id, current_streak');

      const leaderboardData: LeaderboardEntry[] = data.map(profile => {
        const userProgress = allProgress?.filter(p => p.user_id === profile.user_id && p.completed) || [];
        const userStreak = allStreaks?.find(s => s.user_id === profile.user_id);
        const scores = userProgress.filter(p => p.quiz_score != null).map(p => p.quiz_score!);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const completedLessons = userProgress.length;
        const currentStreak = userStreak?.current_streak || 0;
        
        return {
          user_id: profile.user_id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          skill_level: profile.skill_level || 'beginner',
          completed_lessons: completedLessons,
          avg_quiz_score: avgScore,
          current_streak: currentStreak,
          total_points: completedLessons * 10 + avgScore + currentStreak * 5,
        };
      }).sort((a, b) => b.total_points - a.total_points);

      setEntries(leaderboardData);
    }
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-amber-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border-amber-500/30';
    if (index === 1) return 'bg-gradient-to-r from-gray-400/10 to-gray-300/5 border-gray-400/20';
    if (index === 2) return 'bg-gradient-to-r from-amber-700/10 to-amber-600/5 border-amber-700/20';
    return 'border-border/50';
  };

  const myRank = entries.findIndex(e => e.user_id === user?.id) + 1;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 mb-4">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'am' ? 'ደረጃ ሰንጠረዥ' : 'Leaderboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'am' ? 'ከሌሎች ተማሪዎች ጋር ይወዳደሩ' : 'Compete with fellow students'}
          </p>
          {myRank > 0 && (
            <Badge className="mt-3 bg-primary/20 text-primary border border-primary/30">
              {language === 'am' ? `የእርስዎ ደረጃ: #${myRank}` : `Your Rank: #${myRank}`}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : entries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">{language === 'am' ? 'ገና ደረጃ የለም' : 'No rankings yet'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <Card
                key={entry.user_id}
                className={`border transition-all hover:scale-[1.01] ${getRankBg(i)} ${entry.user_id === user?.id ? 'ring-2 ring-primary/40' : ''}`}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex-shrink-0">{getRankIcon(i)}</div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {entry.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {entry.full_name}
                      {entry.user_id === user?.id && <span className="text-xs text-primary ml-2">({language === 'am' ? 'እርስዎ' : 'You'})</span>}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" />{entry.completed_lessons} lessons</span>
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-orange-500" />{entry.current_streak}d</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{entry.total_points}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">XP</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
