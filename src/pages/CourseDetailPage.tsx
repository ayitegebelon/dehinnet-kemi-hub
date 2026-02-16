import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  BookOpen, CheckCircle, Circle, PlayCircle, ArrowLeft,
  Clock, Trophy, ChevronRight
} from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    const [courseRes, lessonsRes] = await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
      supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index'),
    ]);

    if (courseRes.data) setCourse(courseRes.data);
    if (lessonsRes.data) setLessons(lessonsRes.data);

    if (user) {
      const lessonIds = lessonsRes.data?.map((l: any) => l.id) || [];
      if (lessonIds.length > 0) {
        const { data: prog } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds);
        const map: Record<string, any> = {};
        prog?.forEach((p: any) => { map[p.lesson_id] = p; });
        setProgress(map);
      }
    }
    setLoading(false);
  };

  const openLesson = async (lesson: any) => {
    setActiveLesson(lesson);
    setQuizSubmitted(false);
    setQuizAnswers({});
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', lesson.id)
      .order('created_at');
    setQuizzes(data || []);
  };

  const completeLesson = async () => {
    if (!user || !activeLesson) return;
    const score = quizzes.length > 0
      ? Math.round((quizzes.filter(q => quizAnswers[q.id] === q.correct_answer).length / quizzes.length) * 100)
      : 100;

    const { error } = await supabase.from('user_progress').upsert({
      user_id: user.id,
      lesson_id: activeLesson.id,
      completed: true,
      quiz_score: score,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });

    if (!error) {
      toast.success(language === 'am' ? 'ትምህርት ተጠናቋል!' : `Lesson completed! Score: ${score}%`);
      setProgress(prev => ({ ...prev, [activeLesson.id]: { completed: true, quiz_score: score } }));
      setQuizSubmitted(true);
    }
  };

  const completedCount = Object.values(progress).filter((p: any) => p.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Course not found</p>
          <Button asChild className="mt-4"><Link to="/learn">Back to Courses</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/learn" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {language === 'am' ? 'ወደ ኮርሶች ተመለስ' : 'Back to Courses'}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Course info & lessons list */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">{course.category}</Badge>
                <CardTitle>{language === 'am' ? course.title_am : course.title_en}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'am' ? course.description_am : course.description_en}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === 'am' ? 'ሂደት' : 'Progress'}</span>
                    <span className="font-medium">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-3.5 w-3.5" />
                    {completedCount}/{lessons.length} {language === 'am' ? 'ተጠናቋል' : 'completed'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{language === 'am' ? 'ትምህርቶች' : 'Lessons'}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {lessons.map((lesson, i) => {
                    const isCompleted = progress[lesson.id]?.completed;
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => openLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${isActive ? 'bg-primary/10 border-l-2 border-primary' : ''}`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : ''}`}>
                            {i + 1}. {language === 'am' ? lesson.title_am : lesson.title_en}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration_minutes} min
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Active lesson */}
          <div className="lg:col-span-2">
            {!activeLesson ? (
              <Card className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <PlayCircle className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {language === 'am' ? 'ትምህርት ይምረጡ' : 'Select a lesson to begin'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'am' ? 'ከግራ ዝርዝር ውስጥ ትምህርት ይምረጡ' : 'Choose a lesson from the list on the left'}
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Video Player */}
                {activeLesson.video_url && (
                  <Card className="overflow-hidden">
                    <div className="aspect-video w-full">
                      <iframe
                        src={activeLesson.video_url}
                        title={language === 'am' ? activeLesson.title_am : activeLesson.title_en}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'am' ? activeLesson.title_am : activeLesson.title_en}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                        {language === 'am' ? activeLesson.content_am || 'ይዘት በቅርብ ይጨመራል...' : activeLesson.content_en || 'Content coming soon...'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz Section */}
                {quizzes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        {language === 'am' ? 'ፈተና' : 'Quiz'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {quizzes.map((q, qi) => {
                        const options = Array.isArray(q.options) ? q.options : [];
                        return (
                          <div key={q.id} className="space-y-3">
                            <p className="font-medium">
                              {qi + 1}. {language === 'am' ? q.question_am : q.question_en}
                            </p>
                            <div className="grid gap-2">
                              {options.map((opt: string, oi: number) => {
                                const selected = quizAnswers[q.id] === oi;
                                const isCorrect = quizSubmitted && oi === q.correct_answer;
                                const isWrong = quizSubmitted && selected && oi !== q.correct_answer;
                                return (
                                  <button
                                    key={oi}
                                    onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                                    className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                                      isCorrect ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                                      isWrong ? 'border-rose-500 bg-rose-500/10 text-rose-400' :
                                      selected ? 'border-primary bg-primary/10' :
                                      'border-border hover:border-primary/40'
                                    }`}
                                    disabled={quizSubmitted}
                                  >
                                    {String.fromCharCode(65 + oi)}. {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {quizSubmitted && (q.explanation_en || q.explanation_am) && (
                              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                💡 {language === 'am' ? q.explanation_am : q.explanation_en}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      {!quizSubmitted && (
                        <Button
                          onClick={completeLesson}
                          disabled={Object.keys(quizAnswers).length < quizzes.length}
                          className="w-full"
                        >
                          {language === 'am' ? 'መልስ ያስገቡ' : 'Submit Answers'}
                        </Button>
                      )}
                      {quizSubmitted && (
                        <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="font-medium">
                            🎉 {language === 'am' ? 'ውጤት' : 'Score'}: {progress[activeLesson.id]?.quiz_score || 0}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Complete without quiz */}
                {quizzes.length === 0 && !progress[activeLesson.id]?.completed && (
                  <Button onClick={completeLesson} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {language === 'am' ? 'ትምህርቱን ያጠናቅቁ' : 'Mark as Complete'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetailPage;
