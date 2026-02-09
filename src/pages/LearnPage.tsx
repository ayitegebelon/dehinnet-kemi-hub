import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, Search, GraduationCap, Atom, FlaskConical, Dna,
  Microscope, Beaker, Clock, ChevronRight
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  general: Atom,
  organic: FlaskConical,
  physical: Beaker,
  analytical: Microscope,
  inorganic: Atom,
  biochemistry: Dna,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  advanced: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const LearnPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*').order('created_at');
    if (!error && data) setCourses(data);
    setLoading(false);
  };

  const filtered = courses.filter(c =>
    (language === 'am' ? c.title_am : c.title_en).toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-science/20 border border-border/50 p-8 mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {language === 'am' ? 'ኬሚስትሪ ይማሩ' : 'Learn Chemistry'}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'am' ? 'ለዩኒቨርሲቲ ተማሪዎች የተዘጋጀ' : 'University-level courses for students'}
                </p>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'am' ? 'ኮርሶችን ይፈልጉ...' : 'Search courses...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{language === 'am' ? 'ምንም ኮርስ አልተገኘም' : 'No courses found'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => {
              const Icon = categoryIcons[course.category] || BookOpen;
              return (
                <Link key={course.id} to={`/learn/${course.id}`}>
                  <Card className="group h-full hover:shadow-lg hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className={`text-xs ${difficultyColors[course.difficulty] || ''}`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                        {language === 'am' ? course.title_am : course.title_en}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {language === 'am' ? course.description_am : course.description_en}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.total_lessons} {language === 'am' ? 'ትምህርቶች' : 'lessons'}
                        </span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearnPage;
