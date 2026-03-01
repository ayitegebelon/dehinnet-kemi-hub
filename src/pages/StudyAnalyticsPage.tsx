import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart3, TrendingUp, Clock, Target, Flame, BookOpen, Trophy, Brain,
  Calendar, ChevronUp, ChevronDown, Minus
} from 'lucide-react';

const StudyAnalyticsPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isAm = language === 'am';

  const [stats, setStats] = useState({
    totalLessons: 0, completedLessons: 0, avgScore: 0, bestScore: 0,
    totalStudyDays: 0, currentStreak: 0, longestStreak: 0,
    courseProgress: [] as { title: string; completed: number; total: number }[],
    recentScores: [] as { lesson: string; score: number; date: string }[],
    strengthAreas: [] as { category: string; avg: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const [progressRes, coursesRes, lessonsRes, streakRes] = await Promise.all([
        supabase.from('user_progress').select('*').eq('user_id', user!.id),
        supabase.from('courses').select('*'),
        supabase.from('lessons').select('*'),
        supabase.from('study_streaks').select('*').eq('user_id', user!.id).maybeSingle(),
      ]);

      const progress = progressRes.data || [];
      const courses = coursesRes.data || [];
      const lessons = lessonsRes.data || [];
      const streak = streakRes.data;

      const completed = progress.filter(p => p.completed);
      const scores = completed.filter(p => p.quiz_score !== null).map(p => p.quiz_score!);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      const courseProgress = courses.map(c => {
        const courseLessons = lessons.filter(l => l.course_id === c.id);
        const courseCompleted = courseLessons.filter(l => progress.some(p => p.lesson_id === l.id && p.completed));
        return {
          title: isAm ? c.title_am : c.title_en,
          completed: courseCompleted.length,
          total: courseLessons.length,
        };
      }).filter(c => c.total > 0);

      const recentScores = completed
        .filter(p => p.quiz_score !== null)
        .sort((a, b) => new Date(b.completed_at || '').getTime() - new Date(a.completed_at || '').getTime())
        .slice(0, 8)
        .map(p => {
          const lesson = lessons.find(l => l.id === p.lesson_id);
          return {
            lesson: lesson ? (isAm ? lesson.title_am : lesson.title_en) : 'Unknown',
            score: p.quiz_score!,
            date: p.completed_at ? new Date(p.completed_at).toLocaleDateString() : '',
          };
        });

      // Group by course category for strength areas
      const categoryScores: Record<string, number[]> = {};
      completed.forEach(p => {
        if (p.quiz_score === null) return;
        const lesson = lessons.find(l => l.id === p.lesson_id);
        if (!lesson) return;
        const course = courses.find(c => c.id === lesson.course_id);
        if (!course) return;
        const cat = course.category;
        if (!categoryScores[cat]) categoryScores[cat] = [];
        categoryScores[cat].push(p.quiz_score!);
      });

      const strengthAreas = Object.entries(categoryScores).map(([category, scores]) => ({
        category,
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      })).sort((a, b) => b.avg - a.avg);

      setStats({
        totalLessons: lessons.length,
        completedLessons: completed.length,
        avgScore, bestScore,
        totalStudyDays: streak?.total_study_days || 0,
        currentStreak: streak?.current_streak || 0,
        longestStreak: streak?.longest_streak || 0,
        courseProgress, recentScores, strengthAreas,
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  const completionRate = stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የጥናት ትንተና' : 'Study Analytics'}</h1>
            <p className="text-muted-foreground text-sm">{isAm ? 'የእርስዎን የመማር ሂደት ይከታተሉ' : 'Track your learning journey'}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: isAm ? 'የተጠናቀቁ' : 'Completed', value: `${stats.completedLessons}/${stats.totalLessons}`, color: 'from-primary/10 to-primary/5' },
            { icon: Target, label: isAm ? 'አማካይ ውጤት' : 'Avg Score', value: `${stats.avgScore}%`, color: 'from-accent/10 to-accent/5' },
            { icon: Flame, label: isAm ? 'የአሁን ተከታታይ' : 'Current Streak', value: `${stats.currentStreak} ${isAm ? 'ቀናት' : 'days'}`, color: 'from-destructive/10 to-destructive/5' },
            { icon: Trophy, label: isAm ? 'ከፍተኛ ውጤት' : 'Best Score', value: `${stats.bestScore}%`, color: 'from-ethiopian-gold/10 to-ethiopian-gold/5' },
          ].map((kpi, i) => (
            <Card key={i} className={`bg-gradient-to-br ${kpi.color}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50"><kpi.icon className="h-5 w-5 text-foreground" /></div>
                  <div>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {isAm ? 'የኮርስ ሂደት' : 'Course Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.courseProgress.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">{isAm ? 'ገና ኮርስ አልጀመሩም' : 'No courses started yet'}</p>
              ) : (
                stats.courseProgress.map((cp, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="truncate font-medium">{cp.title}</span>
                      <span className="text-muted-foreground">{cp.completed}/{cp.total}</span>
                    </div>
                    <Progress value={cp.total > 0 ? (cp.completed / cp.total) * 100 : 0} className="h-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Quiz Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {isAm ? 'የቅርብ ጊዜ ውጤቶች' : 'Recent Quiz Scores'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentScores.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">{isAm ? 'ገና ፈተና አልወሰዱም' : 'No quizzes taken yet'}</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentScores.map((rs, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{rs.lesson}</p>
                        <p className="text-xs text-muted-foreground">{rs.date}</p>
                      </div>
                      <Badge className={rs.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : rs.score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}>
                        {rs.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strength Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {isAm ? 'ጠንካራ ጎኖች' : 'Strength Areas'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.strengthAreas.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">{isAm ? 'በቂ ውሂብ የለም' : 'Not enough data yet'}</p>
              ) : (
                <div className="space-y-3">
                  {stats.strengthAreas.map((sa, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{sa.category}</span>
                          <span className="text-muted-foreground">{sa.avg}%</span>
                        </div>
                        <Progress value={sa.avg} className="h-2" />
                      </div>
                      {i === 0 && <ChevronUp className="h-4 w-4 text-emerald-500" />}
                      {i === stats.strengthAreas.length - 1 && stats.strengthAreas.length > 1 && <ChevronDown className="h-4 w-4 text-red-400" />}
                      {i > 0 && i < stats.strengthAreas.length - 1 && <Minus className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Streak Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {isAm ? 'የጥናት ተከታታይ' : 'Study Streak'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-3xl font-bold text-primary">{stats.currentStreak}</p>
                  <p className="text-xs text-muted-foreground">{isAm ? 'የአሁን' : 'Current'}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-3xl font-bold text-ethiopian-gold">{stats.longestStreak}</p>
                  <p className="text-xs text-muted-foreground">{isAm ? 'ረጅሙ' : 'Longest'}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-3xl font-bold">{stats.totalStudyDays}</p>
                  <p className="text-xs text-muted-foreground">{isAm ? 'ጠቅላላ ቀናት' : 'Total Days'}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{isAm ? 'ጠቅላላ ሂደት' : 'Overall Progress'}</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StudyAnalyticsPage;
