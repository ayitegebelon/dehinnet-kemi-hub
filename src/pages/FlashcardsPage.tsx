import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  RotateCcw, ChevronLeft, ChevronRight, Brain,
  ThumbsUp, ThumbsDown, Layers, Sparkles
} from 'lucide-react';

const FlashcardsPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id, title_en, title_am');
    if (data) setCourses(data);
  };

  const fetchFlashcards = async () => {
    setLoading(true);
    let query = supabase.from('flashcards').select('*');
    if (selectedCourse !== 'all') query = query.eq('course_id', selectedCourse);
    const { data } = await query;
    setFlashcards(data || []);
    setCurrentIndex(0);
    setFlipped(false);

    if (user && data && data.length > 0) {
      const { data: prog } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('flashcard_id', data.map(f => f.id));
      const map: Record<string, any> = {};
      prog?.forEach((p: any) => { map[p.flashcard_id] = p; });
      setProgress(map);
    }
    setLoading(false);
  };

  const handleConfidence = async (level: number) => {
    if (!user || !flashcards[currentIndex]) return;
    const card = flashcards[currentIndex];

    await supabase.from('user_flashcard_progress').upsert({
      user_id: user.id,
      flashcard_id: card.id,
      confidence_level: level,
      last_reviewed_at: new Date().toISOString(),
      review_count: (progress[card.id]?.review_count || 0) + 1,
    }, { onConflict: 'user_id,flashcard_id' });

    setProgress(prev => ({
      ...prev,
      [card.id]: { ...prev[card.id], confidence_level: level, review_count: (prev[card.id]?.review_count || 0) + 1 }
    }));

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFlipped(false);
    } else {
      toast.success(language === 'am' ? 'ሁሉንም ካርዶች ጨርሰዋል!' : 'You reviewed all cards!');
    }
  };

  const card = flashcards[currentIndex];
  const masteredCount = Object.values(progress).filter((p: any) => p.confidence_level >= 4).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'am' ? 'ፍላሽ ካርዶች' : 'Flashcards'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'am' ? 'ቀመሮችን እና ምላሾችን ያስታውሱ' : 'Memorize formulas, reactions & properties'}
            </p>
          </div>
        </div>

        {/* Filters & Stats */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'am' ? 'ሁሉም' : 'All Courses'}</SelectItem>
              {courses.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {language === 'am' ? c.title_am : c.title_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
            <span className="flex items-center gap-1">
              <Layers className="h-4 w-4" /> {flashcards.length} {language === 'am' ? 'ካርዶች' : 'cards'}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" /> {masteredCount} {language === 'am' ? 'ተካኗል' : 'mastered'}
            </span>
          </div>
        </div>

        {/* Flashcard Display */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : flashcards.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">{language === 'am' ? 'ምንም ፍላሽ ካርድ አልተገኘም' : 'No flashcards available'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{currentIndex + 1}/{flashcards.length}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Card */}
            <div
              onClick={() => setFlipped(!flipped)}
              className="cursor-pointer perspective-1000"
            >
              <Card className={`min-h-[280px] flex items-center justify-center transition-all duration-500 hover:shadow-xl border-2 ${
                flipped ? 'border-primary/40 bg-primary/5' : 'border-border'
              }`}>
                <CardContent className="text-center p-8">
                  {progress[card?.id]?.confidence_level >= 4 && (
                    <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {language === 'am' ? 'ተካኗል' : 'Mastered'}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                    {flipped ? (language === 'am' ? 'መልስ' : 'Answer') : (language === 'am' ? 'ጥያቄ' : 'Question')}
                  </p>
                  <p className="text-xl font-medium leading-relaxed">
                    {flipped
                      ? (language === 'am' ? card?.back_am : card?.back_en)
                      : (language === 'am' ? card?.front_am : card?.front_en)
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-6">
                    {language === 'am' ? 'ለመገለባበጥ ይጫኑ' : 'Click to flip'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  onClick={() => handleConfidence(1)}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {language === 'am' ? 'እንደገና' : 'Again'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                  onClick={() => handleConfidence(3)}
                >
                  {language === 'am' ? 'ጥሩ' : 'Good'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                  onClick={() => handleConfidence(5)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {language === 'am' ? 'ቀላል' : 'Easy'}
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => { setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1)); setFlipped(false); }}
                disabled={currentIndex === flashcards.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Reset */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setCurrentIndex(0); setFlipped(false); }}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {language === 'am' ? 'ዳግም ጀምር' : 'Start Over'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FlashcardsPage;
