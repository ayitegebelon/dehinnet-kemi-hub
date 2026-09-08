import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  Shield, FlaskConical, Award, TrendingUp, Flame, Trophy,
  BookOpen, Target, Zap, Crown, Star, Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, user } = useAuth();
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, total_study_days: 0 });
  const [completedLessons, setCompletedLessons] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    const [streakRes, progressRes, coursesRes] = await Promise.all([
      supabase.from('study_streaks').select('*').eq('user_id', user!.id).maybeSingle(),
      supabase.from('user_progress').select('*').eq('user_id', user!.id),
      supabase.from('courses').select('id'),
    ]);

    if (streakRes.data) setStreak(streakRes.data);
    if (progressRes.data) {
      const completed = progressRes.data.filter((p: any) => p.completed);
      setCompletedLessons(completed.length);
      const scores = completed.filter((p: any) => p.quiz_score != null).map((p: any) => p.quiz_score);
      setAvgScore(scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0);
      setRecentActivity(completed.sort((a: any, b: any) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime()).slice(0, 5));
    }
    if (coursesRes.data) setTotalCourses(coursesRes.data.length);

    // Update study streak
    await updateStreak();
  };

  const updateStreak = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase.from('study_streaks').select('*').eq('user_id', user.id).maybeSingle();
    
    if (!existing) {
      await supabase.from('study_streaks').insert({
        user_id: user.id, current_streak: 1, longest_streak: 1, 
        last_study_date: today, total_study_days: 1
      });
      setStreak({ current_streak: 1, longest_streak: 1, total_study_days: 1 });
    } else if (existing.last_study_date !== today) {
      const lastDate = new Date(existing.last_study_date);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const newStreak = diffDays === 1 ? existing.current_streak + 1 : 1;
      const newLongest = Math.max(newStreak, existing.longest_streak);
      
      await supabase.from('study_streaks').update({
        current_streak: newStreak, longest_streak: newLongest,
        last_study_date: today, total_study_days: existing.total_study_days + 1,
      }).eq('user_id', user.id);
      setStreak({ current_streak: newStreak, longest_streak: newLongest, total_study_days: existing.total_study_days + 1 });
    }
  };

  const xp = completedLessons * 10 + avgScore + streak.current_streak * 5;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome + Level */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {t('dash.welcome')}, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground">
              {language === 'am' ? 'የኬሚስትሪ ጉዞዎን ይቀጥሉ' : 'Continue your chemistry journey'}
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">{level}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{language === 'am' ? 'ደረጃ' : 'Level'} {level}</p>
              <div className="flex items-center gap-2">
                <Progress value={xpInLevel} className="h-1.5 w-24" />
                <span className="text-xs text-muted-foreground">{xpInLevel}/100 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/20"><Flame className="h-5 w-5 text-orange-500" /></div>
                <div>
                  <p className="text-3xl font-bold">{streak.current_streak}</p>
                  <p className="text-xs text-muted-foreground">{language === 'am' ? 'ተከታታይ ቀናት' : 'Day Streak'} 🔥</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20"><BookOpen className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <p className="text-3xl font-bold">{completedLessons}</p>
                  <p className="text-xs text-muted-foreground">{language === 'am' ? 'ያጠናቀቁ ትምህርቶች' : 'Lessons Done'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20"><Target className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-3xl font-bold">{avgScore}%</p>
                  <p className="text-xs text-muted-foreground">{language === 'am' ? 'አማካይ ውጤት' : 'Avg Quiz Score'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20"><Zap className="h-5 w-5 text-amber-500" /></div>
                <div>
                  <p className="text-3xl font-bold">{xp}</p>
                  <p className="text-xs text-muted-foreground">{language === 'am' ? 'አጠቃላይ XP' : 'Total XP'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Banner */}
        {streak.current_streak >= 3 && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 border border-orange-500/30 flex items-center gap-4">
            <div className="text-4xl">🔥</div>
            <div>
              <p className="font-bold text-lg">
                {streak.current_streak} {language === 'am' ? 'ቀን ተከታታይ!' : 'Day Streak!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'am' ? `ከፍተኛ ተከታታይ: ${streak.longest_streak} ቀናት` : `Best streak: ${streak.longest_streak} days`}
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {language === 'am' ? 'ፈጣን ተግባራት' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-auto flex flex-col items-center gap-2 p-4">
                <Link to="/learn">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-xs">{language === 'am' ? 'ኮርሶች' : 'Courses'}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex flex-col items-center gap-2 p-4">
                <Link to="/flashcards">
                  <Star className="h-6 w-6 text-amber-500" />
                  <span className="text-xs">{language === 'am' ? 'ፍላሽ ካርዶች' : 'Flashcards'}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex flex-col items-center gap-2 p-4">
                <Link to="/leaderboard">
                  <Trophy className="h-6 w-6 text-amber-500" />
                  <span className="text-xs">{language === 'am' ? 'ደረጃ ሰንጠረዥ' : 'Leaderboard'}</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto flex flex-col items-center gap-2 p-4">
                <Link to="/periodic-table">
                  <FlaskConical className="h-6 w-6 text-science" />
                  <span className="text-xs">{language === 'am' ? 'ንጥረ ነገሮች' : 'Elements'}</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                {language === 'am' ? 'ስኬቶች' : 'Achievements'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg">🧪</div>
                  <div>
                    <p className="text-sm font-medium">{language === 'am' ? 'የመጀመሪያ ትምህርት' : 'First Lesson'}</p>
                    <p className="text-xs text-muted-foreground">{language === 'am' ? 'አንድ ትምህርት ያጠናቅቁ' : 'Complete 1 lesson'}</p>
                  </div>
                </div>
                {completedLessons >= 1 ? <Badge className="bg-emerald-500/20 text-emerald-500">✓</Badge> : <Badge variant="secondary">{completedLessons}/1</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">🎯</div>
                  <div>
                    <p className="text-sm font-medium">{language === 'am' ? 'ፍፁም ነጥብ' : 'Perfect Score'}</p>
                    <p className="text-xs text-muted-foreground">{language === 'am' ? '100% ያስመዝግቡ' : 'Score 100% on a quiz'}</p>
                  </div>
                </div>
                {avgScore === 100 ? <Badge className="bg-emerald-500/20 text-emerald-500">✓</Badge> : <Badge variant="secondary">{avgScore}%</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-lg">🔥</div>
                  <div>
                    <p className="text-sm font-medium">{language === 'am' ? '7 ቀን ተከታታይ' : '7-Day Streak'}</p>
                    <p className="text-xs text-muted-foreground">{language === 'am' ? '7 ተከታታይ ቀናት ይማሩ' : 'Study 7 days in a row'}</p>
                  </div>
                </div>
                {streak.current_streak >= 7 ? <Badge className="bg-emerald-500/20 text-emerald-500">✓</Badge> : <Badge variant="secondary">{streak.current_streak}/7</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">👑</div>
                  <div>
                    <p className="text-sm font-medium">{language === 'am' ? 'ኮርስ ማስተር' : 'Course Master'}</p>
                    <p className="text-xs text-muted-foreground">{language === 'am' ? '10 ትምህርቶች ያጠናቅቁ' : 'Complete 10 lessons'}</p>
                  </div>
                </div>
                {completedLessons >= 10 ? <Badge className="bg-emerald-500/20 text-emerald-500">✓</Badge> : <Badge variant="secondary">{completedLessons}/10</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
