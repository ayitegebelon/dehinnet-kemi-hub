import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Users, FlaskConical, BarChart3, Shield, Search, Plus, Edit, Trash2,
  Crown, TrendingUp, Activity, DollarSign, BookOpen, Video, HelpCircle,
  AlertTriangle, Eye, Settings, Upload, Image, Bell, Send, CheckCircle2
} from 'lucide-react';

interface User {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  age: number | null;
  father_name: string | null;
  skill_level: string;
  subscription_tier: string;
  subscription_expiry: string | null;
  safety_score: number;
  avatar_url: string | null;
  created_at: string;
}

interface Recipe {
  id: string;
  name_en: string;
  name_am: string;
  category: string;
  difficulty: string;
  is_premium: boolean;
  created_at: string;
}

interface Course {
  id: string;
  title_en: string;
  title_am: string;
  category: string;
  difficulty: string;
  is_premium: boolean;
  total_lessons: number;
}

interface Lesson {
  id: string;
  course_id: string;
  title_en: string;
  title_am: string;
  video_url: string | null;
  order_index: number;
  duration_minutes: number;
  content_en: string | null;
  content_am: string | null;
}

interface Quiz {
  id: string;
  lesson_id: string;
  question_en: string;
  question_am: string;
  options: string[];
  correct_answer: number;
  explanation_en: string | null;
  explanation_am: string | null;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  quiz_score: number;
  integrity_score: number;
  tab_switch_count: number;
  copy_paste_count: number;
  focus_lost_count: number;
  rapid_answer_count: number;
  flagged: boolean;
  warnings: string[];
  student_name: string | null;
  completed_at: string;
}

const Admin: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');
  const [flaggedAttempts, setFlaggedAttempts] = useState<QuizAttempt[]>([]);

  // Recipe form state
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [recipeForm, setRecipeForm] = useState({
    name_en: '', name_am: '', description_en: '', description_am: '',
    category: 'soap', difficulty: 'beginner', is_premium: false,
    ingredients: '[]', steps: '[]', safety_requirements: '[]',
  });

  // Course form state
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title_en: '', title_am: '', description_en: '', description_am: '',
    category: 'general', difficulty: 'beginner', is_premium: false,
  });

  // Lesson form state
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    course_id: '', title_en: '', title_am: '', video_url: '',
    content_en: '', content_am: '', duration_minutes: '10', order_index: '0',
  });
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Quiz state
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({
    lesson_id: '', question_en: '', question_am: '',
    option_0: '', option_1: '', option_2: '', option_3: '',
    correct_answer: '0', explanation_en: '', explanation_am: '',
  });

  // Signature state
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [uploadingSignature, setUploadingSignature] = useState(false);

  // User management state
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    full_name: '', father_name: '', phone: '', age: '', skill_level: 'beginner',
    subscription_tier: 'free', safety_score: '100',
  });

  // Notification state
  const [notifTarget, setNotifTarget] = useState<'all' | 'specific'>('all');
  const [notifSelectedUsers, setNotifSelectedUsers] = useState<string[]>([]);
  const [notifForm, setNotifForm] = useState({
    title_en: '', title_am: '', message_en: '', message_am: '', type: 'info', link: '',
  });
  const [sendingNotif, setSendingNotif] = useState(false);

  const fetchSignature = async () => {
    const { data } = supabase.storage.from('signatures').getPublicUrl('director-signature.png');
    // Check if file exists
    const res = await fetch(data.publicUrl, { method: 'HEAD' });
    if (res.ok) setSignatureUrl(data.publicUrl);
    else setSignatureUrl(null);
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSignature(true);
    try {
      // Remove old file first
      await supabase.storage.from('signatures').remove(['director-signature.png']);
      const { error } = await supabase.storage.from('signatures').upload('director-signature.png', file, { upsert: true });
      if (error) throw error;
      toast.success('Signature uploaded successfully!');
      await fetchSignature();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload signature');
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleRemoveSignature = async () => {
    try {
      await supabase.storage.from('signatures').remove(['director-signature.png']);
      setSignatureUrl(null);
      toast.success('Signature removed');
    } catch {
      toast.error('Failed to remove signature');
    }
  };

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
    fetchSignature();
  }, [isAdmin, isSuperAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, recipesRes, coursesRes, lessonsRes, quizzesRes, attemptsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('recipes').select('*').order('created_at', { ascending: false }),
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('lessons').select('*').order('order_index'),
        supabase.from('quizzes').select('*').order('created_at'),
        (supabase.from('quiz_attempts' as any) as any).select('*').order('completed_at', { ascending: false }),
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (recipesRes.data) setRecipes(recipesRes.data);
      if (coursesRes.data) setCourses(coursesRes.data as Course[]);
      if (lessonsRes.data) setLessons(lessonsRes.data as Lesson[]);
      if (quizzesRes.data) setQuizzes(quizzesRes.data as Quiz[]);
      if (attemptsRes.data) setFlaggedAttempts((attemptsRes.data as unknown as QuizAttempt[]).filter(a => a.flagged || a.integrity_score < 80));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: 'user' | 'admin') => {
    if (!isSuperAdmin) { toast.error('Only superadmins can change roles'); return; }
    try {
      const { data: existingRole } = await supabase.from('user_roles').select('*').eq('user_id', userId).single();
      if (existingRole) {
        await supabase.from('user_roles').update({ role }).eq('user_id', userId);
      } else {
        await supabase.from('user_roles').insert({ user_id: userId, role });
      }
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const openEditUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      full_name: u.full_name || '', father_name: u.father_name || '', phone: u.phone || '',
      age: u.age?.toString() || '', skill_level: u.skill_level || 'beginner',
      subscription_tier: u.subscription_tier || 'free', safety_score: String(u.safety_score ?? 100),
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: userForm.full_name,
        father_name: userForm.father_name || null,
        phone: userForm.phone || null,
        age: userForm.age ? parseInt(userForm.age) : null,
        skill_level: userForm.skill_level as any,
        subscription_tier: userForm.subscription_tier as any,
        safety_score: parseInt(userForm.safety_score) || 100,
      } as any).eq('user_id', editingUser.user_id);
      if (error) throw error;
      toast.success('User updated successfully');
      setIsUserDialogOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (u: User) => {
    if (!confirm(`Are you sure you want to delete user "${u.full_name}"? This will remove their profile and all associated data.`)) return;
    try {
      // Delete related data first
      await Promise.all([
        supabase.from('user_progress').delete().eq('user_id', u.user_id),
        supabase.from('achievements').delete().eq('user_id', u.user_id),
        supabase.from('certificates').delete().eq('user_id', u.user_id),
        supabase.from('experiments').delete().eq('user_id', u.user_id),
        supabase.from('study_streaks').delete().eq('user_id', u.user_id),
        supabase.from('notifications').delete().eq('user_id', u.user_id),
        supabase.from('user_roles').delete().eq('user_id', u.user_id),
        supabase.from('lab_notebook').delete().eq('user_id', u.user_id),
      ]);
      const { error } = await supabase.from('profiles').delete().eq('user_id', u.user_id);
      if (error) throw error;
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Some data may require manual cleanup.');
    }
  };

  const openViewUser = (u: User) => {
    setViewingUser(u);
    setIsUserDetailOpen(true);
  };

  const handleSendNotification = async () => {
    if (!notifForm.title_en || !notifForm.message_en || !notifForm.title_am || !notifForm.message_am) {
      toast.error('Please fill in all title and message fields');
      return;
    }
    if (notifTarget === 'specific' && notifSelectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    setSendingNotif(true);
    try {
      const targetUsers = notifTarget === 'all' ? users : users.filter(u => notifSelectedUsers.includes(u.user_id));
      const notifications = targetUsers.map(u => ({
        user_id: u.user_id,
        title_en: notifForm.title_en,
        title_am: notifForm.title_am,
        message_en: notifForm.message_en,
        message_am: notifForm.message_am,
        type: notifForm.type,
        link: notifForm.link || null,
      }));

      // Insert in batches of 100
      for (let i = 0; i < notifications.length; i += 100) {
        const batch = notifications.slice(i, i + 100);
        const { error } = await supabase.from('notifications').insert(batch);
        if (error) throw error;
      }

      toast.success(`Notification sent to ${targetUsers.length} user(s)`);
      setNotifForm({ title_en: '', title_am: '', message_en: '', message_am: '', type: 'info', link: '' });
      setNotifSelectedUsers([]);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSendingNotif(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setNotifSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateRecipe = async () => {
    try {
      const { error } = await supabase.from('recipes').insert({
        name_en: recipeForm.name_en, name_am: recipeForm.name_am,
        description_en: recipeForm.description_en, description_am: recipeForm.description_am,
        category: recipeForm.category,
        difficulty: recipeForm.difficulty as 'beginner' | 'intermediate' | 'advanced',
        is_premium: recipeForm.is_premium,
        ingredients: JSON.parse(recipeForm.ingredients),
        steps: JSON.parse(recipeForm.steps),
        safety_requirements: JSON.parse(recipeForm.safety_requirements),
      });
      if (error) throw error;
      toast.success('Recipe created successfully');
      setIsRecipeDialogOpen(false);
      fetchData();
      setRecipeForm({ name_en: '', name_am: '', description_en: '', description_am: '', category: 'soap', difficulty: 'beginner', is_premium: false, ingredients: '[]', steps: '[]', safety_requirements: '[]' });
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Recipe deleted');
      fetchData();
    } catch (error) { toast.error('Failed to delete recipe'); }
  };

  const handleCreateCourse = async () => {
    try {
      const { error } = await supabase.from('courses').insert({
        title_en: courseForm.title_en, title_am: courseForm.title_am,
        description_en: courseForm.description_en, description_am: courseForm.description_am,
        category: courseForm.category, difficulty: courseForm.difficulty, is_premium: courseForm.is_premium,
      });
      if (error) throw error;
      toast.success('Course created!');
      setIsCourseDialogOpen(false);
      setCourseForm({ title_en: '', title_am: '', description_en: '', description_am: '', category: 'general', difficulty: 'beginner', is_premium: false });
      fetchData();
    } catch (error) { toast.error('Failed to create course'); }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course and all its lessons?')) return;
    try {
      await supabase.from('lessons').delete().eq('course_id', id);
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      toast.success('Course deleted');
      fetchData();
    } catch (error) { toast.error('Failed to delete course'); }
  };

  const handleSaveLesson = async () => {
    try {
      const data = {
        course_id: lessonForm.course_id,
        title_en: lessonForm.title_en, title_am: lessonForm.title_am,
        video_url: lessonForm.video_url || null,
        content_en: lessonForm.content_en || null, content_am: lessonForm.content_am || null,
        duration_minutes: parseInt(lessonForm.duration_minutes) || 10,
        order_index: parseInt(lessonForm.order_index) || 0,
      };
      if (editingLesson) {
        const { error } = await supabase.from('lessons').update(data).eq('id', editingLesson.id);
        if (error) throw error;
        toast.success('Lesson updated!');
      } else {
        const { error } = await supabase.from('lessons').insert(data);
        if (error) throw error;
        toast.success('Lesson created!');
      }
      setIsLessonDialogOpen(false);
      setEditingLesson(null);
      setLessonForm({ course_id: '', title_en: '', title_am: '', video_url: '', content_en: '', content_am: '', duration_minutes: '10', order_index: '0' });
      fetchData();
    } catch (error) { toast.error('Failed to save lesson'); }
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      course_id: lesson.course_id, title_en: lesson.title_en, title_am: lesson.title_am,
      video_url: lesson.video_url || '', content_en: lesson.content_en || '', content_am: lesson.content_am || '',
      duration_minutes: String(lesson.duration_minutes || 10), order_index: String(lesson.order_index || 0),
    });
    setIsLessonDialogOpen(true);
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
      toast.success('Lesson deleted');
      fetchData();
    } catch (error) { toast.error('Failed to delete lesson'); }
  };

  const handleSaveQuiz = async () => {
    try {
      const options = [quizForm.option_0, quizForm.option_1, quizForm.option_2, quizForm.option_3].filter(o => o.trim());
      const data = {
        lesson_id: quizForm.lesson_id, question_en: quizForm.question_en, question_am: quizForm.question_am,
        options, correct_answer: parseInt(quizForm.correct_answer),
        explanation_en: quizForm.explanation_en || null, explanation_am: quizForm.explanation_am || null,
      };
      if (editingQuiz) {
        const { error } = await supabase.from('quizzes').update(data).eq('id', editingQuiz.id);
        if (error) throw error;
        toast.success('Quiz updated!');
      } else {
        const { error } = await supabase.from('quizzes').insert(data);
        if (error) throw error;
        toast.success('Quiz created!');
      }
      setIsQuizDialogOpen(false);
      setEditingQuiz(null);
      resetQuizForm();
      fetchData();
    } catch (error) { toast.error('Failed to save quiz'); }
  };

  const resetQuizForm = () => setQuizForm({
    lesson_id: '', question_en: '', question_am: '',
    option_0: '', option_1: '', option_2: '', option_3: '',
    correct_answer: '0', explanation_en: '', explanation_am: '',
  });

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    const opts = Array.isArray(quiz.options) ? quiz.options : [];
    setQuizForm({
      lesson_id: quiz.lesson_id, question_en: quiz.question_en, question_am: quiz.question_am,
      option_0: opts[0] || '', option_1: opts[1] || '', option_2: opts[2] || '', option_3: opts[3] || '',
      correct_answer: String(quiz.correct_answer),
      explanation_en: quiz.explanation_en || '', explanation_am: quiz.explanation_am || '',
    });
    setIsQuizDialogOpen(true);
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm('Delete this quiz question?')) return;
    try {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Quiz deleted');
      fetchData();
    } catch (error) { toast.error('Failed to delete quiz'); }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRecipes = recipes.filter(r =>
    r.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) || r.name_am?.includes(searchTerm)
  );

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.subscription_tier === 'premium').length;
  const institutionUsers = users.filter(u => u.subscription_tier === 'institution').length;
  const avgSafetyScore = users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + (u.safety_score || 0), 0) / users.length) : 0;

  if (!isAdmin && !isSuperAdmin) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
              <p className="text-muted-foreground">
                {isSuperAdmin ? '🔐 Superadmin Access' : '👤 Admin Access'}
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20"><Users className="h-5 w-5 text-primary" /></div>
                <div><p className="text-2xl font-bold">{totalUsers}</p><p className="text-sm text-muted-foreground">{t('admin.users')}</p></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-ethiopian-gold/10 to-ethiopian-gold/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-ethiopian-gold/20"><Crown className="h-5 w-5 text-ethiopian-gold" /></div>
                <div><p className="text-2xl font-bold">{premiumUsers}</p><p className="text-sm text-muted-foreground">Premium</p></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-science/10 to-science/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-science/20"><BookOpen className="h-5 w-5 text-science" /></div>
                <div><p className="text-2xl font-bold">{courses.length}</p><p className="text-sm text-muted-foreground">Courses</p></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20"><Shield className="h-5 w-5 text-success" /></div>
                <div><p className="text-2xl font-bold">{avgSafetyScore}%</p><p className="text-sm text-muted-foreground">Avg Safety</p></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
                <div><p className="text-2xl font-bold">{flaggedAttempts.length}</p><p className="text-sm text-muted-foreground">Flagged</p></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs"><Users className="h-4 w-4" />{t('admin.users')}</TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-1 text-xs"><FlaskConical className="h-4 w-4" />{t('admin.recipes')}</TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-1 text-xs"><BookOpen className="h-4 w-4" />Courses</TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-1 text-xs"><HelpCircle className="h-4 w-4" />Quizzes</TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs"><Bell className="h-4 w-4" />Notify</TabsTrigger>
            <TabsTrigger value="integrity" className="flex items-center gap-1 text-xs">
              <AlertTriangle className="h-4 w-4" />Integrity
              {flaggedAttempts.length > 0 && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{flaggedAttempts.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs"><BarChart3 className="h-4 w-4" />{t('admin.analytics')}</TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-xs"><Settings className="h-4 w-4" />Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('admin.users')}</CardTitle>
                  <CardDescription>Full user management — view, edit, change roles, and remove users</CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">{filteredUsers.length} users</Badge>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Safety</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                                  {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : u.full_name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{u.full_name}</p>
                                  {u.father_name && <p className="text-xs text-muted-foreground">{u.father_name}</p>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{u.email}</TableCell>
                            <TableCell className="text-sm">{u.phone || '-'}</TableCell>
                            <TableCell><Badge variant="secondary" className="text-xs">{u.skill_level}</Badge></TableCell>
                            <TableCell>
                              <Badge className={
                                u.subscription_tier === 'premium' ? 'bg-ethiopian-gold text-foreground' :
                                u.subscription_tier === 'institution' ? 'bg-science text-primary-foreground' : 'bg-muted'
                              }>{u.subscription_tier}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary transition-all" style={{ width: `${u.safety_score || 0}%` }} />
                                </div>
                                <span className="text-xs">{u.safety_score || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(u.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openViewUser(u)} title="View">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditUser(u)} title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {isSuperAdmin && (
                                  <>
                                    <Select defaultValue="user" onValueChange={(value) => handleUpdateUserRole(u.user_id, value as 'user' | 'admin')}>
                                      <SelectTrigger className="w-20 h-8 text-xs"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteUser(u)} title="Delete">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Edit Dialog */}
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit User: {editingUser?.full_name}</DialogTitle>
                  <DialogDescription>Update user profile information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input value={userForm.full_name} onChange={(e) => setUserForm({...userForm, full_name: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Father's Name</Label><Input value={userForm.father_name} onChange={(e) => setUserForm({...userForm, father_name: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Phone</Label><Input value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Age</Label><Input type="number" value={userForm.age} onChange={(e) => setUserForm({...userForm, age: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Skill Level</Label>
                      <Select value={userForm.skill_level} onValueChange={(v) => setUserForm({...userForm, skill_level: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Subscription</Label>
                      <Select value={userForm.subscription_tier} onValueChange={(v) => setUserForm({...userForm, subscription_tier: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="institution">Institution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Safety Score</Label><Input type="number" max={100} min={0} value={userForm.safety_score} onChange={(e) => setUserForm({...userForm, safety_score: e.target.value})} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveUser}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* User Detail Dialog */}
            <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                {viewingUser && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
                        {viewingUser.avatar_url ? <img src={viewingUser.avatar_url} className="w-full h-full object-cover" /> : viewingUser.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{viewingUser.full_name}</h3>
                        {viewingUser.father_name && <p className="text-sm text-muted-foreground">Father: {viewingUser.father_name}</p>}
                        <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewingUser.phone || 'N/A'}</span></div>
                      <div className="p-3 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Age:</span> <span className="font-medium">{viewingUser.age || 'N/A'}</span></div>
                      <div className="p-3 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Skill:</span> <Badge variant="secondary" className="ml-1">{viewingUser.skill_level}</Badge></div>
                      <div className="p-3 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Plan:</span> <Badge className="ml-1">{viewingUser.subscription_tier}</Badge></div>
                      <div className="p-3 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Safety:</span> <span className="font-medium">{viewingUser.safety_score}%</span></div>
                      <div className="p-3 bg-muted/50 rounded-lg"><span className="text-muted-foreground">Joined:</span> <span className="font-medium">{new Date(viewingUser.created_at).toLocaleDateString()}</span></div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>Close</Button>
                  {viewingUser && <Button onClick={() => { setIsUserDetailOpen(false); openEditUser(viewingUser); }}>Edit User</Button>}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('admin.recipes')}</CardTitle>
                  <CardDescription>Manage chemistry recipes</CardDescription>
                </div>
                <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2"><Plus className="h-4 w-4" />Add Recipe</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Recipe</DialogTitle>
                      <DialogDescription>Add a new chemistry recipe to the platform</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Name (English)</Label><Input value={recipeForm.name_en} onChange={(e) => setRecipeForm({...recipeForm, name_en: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Name (Amharic)</Label><Input value={recipeForm.name_am} onChange={(e) => setRecipeForm({...recipeForm, name_am: e.target.value})} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Description (EN)</Label><Textarea value={recipeForm.description_en} onChange={(e) => setRecipeForm({...recipeForm, description_en: e.target.value})} /></div>
                        <div className="space-y-2"><Label>Description (AM)</Label><Textarea value={recipeForm.description_am} onChange={(e) => setRecipeForm({...recipeForm, description_am: e.target.value})} /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Category</Label>
                          <Select value={recipeForm.category} onValueChange={(v) => setRecipeForm({...recipeForm, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="soap">Soap</SelectItem><SelectItem value="detergent">Detergent</SelectItem><SelectItem value="cleaner">Cleaner</SelectItem><SelectItem value="cosmetic">Cosmetic</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2"><Label>Difficulty</Label>
                          <Select value={recipeForm.difficulty} onValueChange={(v) => setRecipeForm({...recipeForm, difficulty: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2"><Label>Premium</Label><div className="flex items-center h-10"><Switch checked={recipeForm.is_premium} onCheckedChange={(c) => setRecipeForm({...recipeForm, is_premium: c})} /></div></div>
                      </div>
                      <div className="space-y-2"><Label>Ingredients (JSON)</Label><Textarea value={recipeForm.ingredients} onChange={(e) => setRecipeForm({...recipeForm, ingredients: e.target.value})} className="font-mono text-sm" /></div>
                      <div className="space-y-2"><Label>Steps (JSON)</Label><Textarea value={recipeForm.steps} onChange={(e) => setRecipeForm({...recipeForm, steps: e.target.value})} className="font-mono text-sm" /></div>
                      <div className="space-y-2"><Label>Safety Requirements (JSON)</Label><Textarea value={recipeForm.safety_requirements} onChange={(e) => setRecipeForm({...recipeForm, safety_requirements: e.target.value})} className="font-mono text-sm" /></div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRecipeDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateRecipe}>Create Recipe</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Difficulty</TableHead><TableHead>Premium</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {filteredRecipes.map((recipe) => (
                          <TableRow key={recipe.id}>
                            <TableCell className="font-medium">{language === 'am' ? recipe.name_am : recipe.name_en}</TableCell>
                            <TableCell><Badge variant="secondary">{recipe.category}</Badge></TableCell>
                            <TableCell><Badge className={recipe.difficulty === 'advanced' ? 'bg-destructive' : recipe.difficulty === 'intermediate' ? 'bg-accent' : 'bg-primary'}>{recipe.difficulty}</Badge></TableCell>
                            <TableCell>{recipe.is_premium ? <Crown className="h-4 w-4 text-ethiopian-gold" /> : <span className="text-muted-foreground">—</span>}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteRecipe(recipe.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses & Lessons Tab */}
          <TabsContent value="courses">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Courses</CardTitle><CardDescription>Manage university courses</CardDescription></div>
                  <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
                    <DialogTrigger asChild><Button className="flex items-center gap-2"><Plus className="h-4 w-4" />Add Course</Button></DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>Create New Course</DialogTitle></DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Title (EN)</Label><Input value={courseForm.title_en} onChange={(e) => setCourseForm({...courseForm, title_en: e.target.value})} /></div>
                          <div className="space-y-2"><Label>Title (AM)</Label><Input value={courseForm.title_am} onChange={(e) => setCourseForm({...courseForm, title_am: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Description (EN)</Label><Textarea value={courseForm.description_en} onChange={(e) => setCourseForm({...courseForm, description_en: e.target.value})} /></div>
                          <div className="space-y-2"><Label>Description (AM)</Label><Textarea value={courseForm.description_am} onChange={(e) => setCourseForm({...courseForm, description_am: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2"><Label>Category</Label><Input value={courseForm.category} onChange={(e) => setCourseForm({...courseForm, category: e.target.value})} /></div>
                          <div className="space-y-2"><Label>Difficulty</Label>
                            <Select value={courseForm.difficulty} onValueChange={(v) => setCourseForm({...courseForm, difficulty: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem></SelectContent></Select>
                          </div>
                          <div className="space-y-2"><Label>Premium</Label><div className="flex items-center h-10"><Switch checked={courseForm.is_premium} onCheckedChange={(c) => setCourseForm({...courseForm, is_premium: c})} /></div></div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateCourse}>Create Course</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Category</TableHead><TableHead>Difficulty</TableHead><TableHead>Lessons</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {courses.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{language === 'am' ? c.title_am : c.title_en}</TableCell>
                            <TableCell><Badge variant="secondary">{c.category}</Badge></TableCell>
                            <TableCell><Badge>{c.difficulty}</Badge></TableCell>
                            <TableCell>{lessons.filter(l => l.course_id === c.id).length}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" />Lessons</CardTitle><CardDescription>Manage lessons</CardDescription></div>
                  <Button className="flex items-center gap-2" onClick={() => { setEditingLesson(null); setLessonForm({ course_id: courses[0]?.id || '', title_en: '', title_am: '', video_url: '', content_en: '', content_am: '', duration_minutes: '10', order_index: '0' }); setIsLessonDialogOpen(true); }}>
                    <Plus className="h-4 w-4" />Add Lesson
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Lesson</TableHead><TableHead>Course</TableHead><TableHead>Video</TableHead><TableHead>Duration</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {lessons.map((l) => {
                          const course = courses.find(c => c.id === l.course_id);
                          return (
                            <TableRow key={l.id}>
                              <TableCell className="font-medium">{l.title_en}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{course?.title_en || '—'}</TableCell>
                              <TableCell>{l.video_url ? <Badge variant="secondary" className="text-xs">✓ Has Video</Badge> : <span className="text-muted-foreground text-xs">No video</span>}</TableCell>
                              <TableCell>{l.duration_minutes} min</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => openEditLesson(l)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(l.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Course</Label>
                      <Select value={lessonForm.course_id} onValueChange={(v) => setLessonForm({...lessonForm, course_id: v})}>
                        <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                        <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title_en}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Title (EN)</Label><Input value={lessonForm.title_en} onChange={(e) => setLessonForm({...lessonForm, title_en: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Title (AM)</Label><Input value={lessonForm.title_am} onChange={(e) => setLessonForm({...lessonForm, title_am: e.target.value})} /></div>
                    </div>
                    <div className="space-y-2">
                      <Label>Video URL</Label>
                      <Input value={lessonForm.video_url} onChange={(e) => setLessonForm({...lessonForm, video_url: e.target.value})} placeholder="https://www.youtube.com/embed/VIDEO_ID" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" value={lessonForm.duration_minutes} onChange={(e) => setLessonForm({...lessonForm, duration_minutes: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Order</Label><Input type="number" value={lessonForm.order_index} onChange={(e) => setLessonForm({...lessonForm, order_index: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Content (EN)</Label><Textarea value={lessonForm.content_en} onChange={(e) => setLessonForm({...lessonForm, content_en: e.target.value})} rows={5} /></div>
                      <div className="space-y-2"><Label>Content (AM)</Label><Textarea value={lessonForm.content_am} onChange={(e) => setLessonForm({...lessonForm, content_am: e.target.value})} rows={5} /></div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLessonDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveLesson}>{editingLesson ? 'Update' : 'Create'} Lesson</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Quiz Questions</CardTitle></div>
                <Button className="flex items-center gap-2" onClick={() => { setEditingQuiz(null); resetQuizForm(); setQuizForm(prev => ({ ...prev, lesson_id: lessons[0]?.id || '' })); setIsQuizDialogOpen(true); }}>
                  <Plus className="h-4 w-4" />Add Question
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Lesson</TableHead><TableHead>Options</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {quizzes.map((q) => {
                        const lesson = lessons.find(l => l.id === q.lesson_id);
                        const opts = Array.isArray(q.options) ? q.options : [];
                        return (
                          <TableRow key={q.id}>
                            <TableCell className="font-medium max-w-xs truncate">{q.question_en}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{lesson?.title_en || '—'}</TableCell>
                            <TableCell><Badge variant="secondary">{opts.length} options</Badge></TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openEditQuiz(q)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(q.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingQuiz ? 'Edit Quiz Question' : 'Create Quiz Question'}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Lesson</Label>
                    <Select value={quizForm.lesson_id} onValueChange={(v) => setQuizForm({...quizForm, lesson_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Select lesson" /></SelectTrigger>
                      <SelectContent>{lessons.map(l => <SelectItem key={l.id} value={l.id}>{l.title_en}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Question (EN)</Label><Textarea value={quizForm.question_en} onChange={(e) => setQuizForm({...quizForm, question_en: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Question (AM)</Label><Textarea value={quizForm.question_am} onChange={(e) => setQuizForm({...quizForm, question_am: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Option A</Label><Input value={quizForm.option_0} onChange={(e) => setQuizForm({...quizForm, option_0: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Option B</Label><Input value={quizForm.option_1} onChange={(e) => setQuizForm({...quizForm, option_1: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Option C</Label><Input value={quizForm.option_2} onChange={(e) => setQuizForm({...quizForm, option_2: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Option D</Label><Input value={quizForm.option_3} onChange={(e) => setQuizForm({...quizForm, option_3: e.target.value})} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select value={quizForm.correct_answer} onValueChange={(v) => setQuizForm({...quizForm, correct_answer: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">A</SelectItem><SelectItem value="1">B</SelectItem>
                        <SelectItem value="2">C</SelectItem><SelectItem value="3">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Explanation (EN)</Label><Textarea value={quizForm.explanation_en} onChange={(e) => setQuizForm({...quizForm, explanation_en: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Explanation (AM)</Label><Textarea value={quizForm.explanation_am} onChange={(e) => setQuizForm({...quizForm, explanation_am: e.target.value})} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveQuiz}>{editingQuiz ? 'Update' : 'Create'} Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Send Notifications</CardTitle>
                <CardDescription>Send announcements to all users or specific individuals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Target Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Send To</Label>
                  <div className="flex gap-3">
                    <Button variant={notifTarget === 'all' ? 'default' : 'outline'} onClick={() => setNotifTarget('all')} className="flex items-center gap-2">
                      <Users className="h-4 w-4" />All Users ({users.length})
                    </Button>
                    <Button variant={notifTarget === 'specific' ? 'default' : 'outline'} onClick={() => setNotifTarget('specific')} className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />Specific Users
                    </Button>
                  </div>
                </div>

                {/* User selection for specific */}
                {notifTarget === 'specific' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Users ({notifSelectedUsers.length} selected)</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-1">
                      {users.map(u => (
                        <label key={u.user_id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifSelectedUsers.includes(u.user_id)}
                            onChange={() => toggleUserSelection(u.user_id)}
                            className="rounded"
                          />
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {u.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{u.full_name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notification Form */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Title (English) *</Label><Input value={notifForm.title_en} onChange={(e) => setNotifForm({...notifForm, title_en: e.target.value})} placeholder="New course available!" /></div>
                    <div className="space-y-2"><Label>Title (Amharic) *</Label><Input value={notifForm.title_am} onChange={(e) => setNotifForm({...notifForm, title_am: e.target.value})} placeholder="አዲስ ኮርስ ተገኝቷል!" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Message (English) *</Label><Textarea value={notifForm.message_en} onChange={(e) => setNotifForm({...notifForm, message_en: e.target.value})} placeholder="We have exciting new content..." rows={3} /></div>
                    <div className="space-y-2"><Label>Message (Amharic) *</Label><Textarea value={notifForm.message_am} onChange={(e) => setNotifForm({...notifForm, message_am: e.target.value})} placeholder="አዲስ ይዘት አለን..." rows={3} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Type</Label>
                      <Select value={notifForm.type} onValueChange={(v) => setNotifForm({...notifForm, type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">ℹ️ Info</SelectItem>
                          <SelectItem value="success">✅ Success</SelectItem>
                          <SelectItem value="warning">⚠️ Warning</SelectItem>
                          <SelectItem value="announcement">📢 Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Link (optional)</Label><Input value={notifForm.link} onChange={(e) => setNotifForm({...notifForm, link: e.target.value})} placeholder="/learn or /dashboard" /></div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSendNotification} disabled={sendingNotif} size="lg" className="flex items-center gap-2">
                    {sendingNotif ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Notification</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrity / Flagged Attempts Tab */}
          <TabsContent value="integrity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Flagged Quiz Attempts
                </CardTitle>
                <CardDescription>
                  Review quiz attempts with suspicious activity or low integrity scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flaggedAttempts.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No flagged attempts</p>
                    <p className="text-sm text-muted-foreground">All quiz attempts appear legitimate</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Quiz Score</TableHead>
                          <TableHead>Integrity</TableHead>
                          <TableHead>Tab Switches</TableHead>
                          <TableHead>Copy/Paste</TableHead>
                          <TableHead>Focus Lost</TableHead>
                          <TableHead>Fast Answers</TableHead>
                          <TableHead>Warnings</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flaggedAttempts.map((attempt) => {
                          const course = courses.find(c => c.id === attempt.course_id);
                          const lesson = lessons.find(l => l.id === attempt.lesson_id);
                          const studentProfile = users.find(u => u.user_id === attempt.user_id);
                          return (
                            <TableRow key={attempt.id} className={attempt.integrity_score < 60 ? 'bg-destructive/5' : ''}>
                              <TableCell className="font-medium">
                                {studentProfile?.full_name || attempt.student_name || 'Unknown'}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="text-sm">{course?.title_en || '—'}</p>
                                  <p className="text-xs text-muted-foreground">{lesson?.title_en || ''}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={attempt.quiz_score >= 80 ? 'bg-primary/20 text-primary' : attempt.quiz_score >= 60 ? 'bg-accent/20 text-accent-foreground' : 'bg-destructive/20 text-destructive'}>
                                  {attempt.quiz_score}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={attempt.integrity_score >= 80 ? 'bg-primary/20 text-primary' : attempt.integrity_score >= 60 ? 'bg-accent/20 text-accent-foreground' : 'bg-destructive/20 text-destructive'}>
                                  {attempt.integrity_score}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={attempt.tab_switch_count >= 3 ? 'text-destructive font-bold' : ''}>{attempt.tab_switch_count}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={attempt.copy_paste_count >= 2 ? 'text-destructive font-bold' : ''}>{attempt.copy_paste_count}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={attempt.focus_lost_count >= 4 ? 'text-destructive font-bold' : ''}>{attempt.focus_lost_count}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={attempt.rapid_answer_count > 2 ? 'text-destructive font-bold' : ''}>{attempt.rapid_answer_count}</span>
                              </TableCell>
                              <TableCell>
                                {attempt.warnings && attempt.warnings.length > 0 ? (
                                  <div className="space-y-1">
                                    {attempt.warnings.map((w, i) => (
                                      <p key={i} className="text-xs text-muted-foreground">{w}</p>
                                    ))}
                                  </div>
                                ) : '—'}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(attempt.completed_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />User Growth</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Users</span><span className="text-2xl font-bold">{totalUsers}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Premium Subscribers</span><span className="text-xl font-semibold text-ethiopian-gold">{premiumUsers}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Institutions</span><span className="text-xl font-semibold text-science">{institutionUsers}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Conversion Rate</span><span className="text-xl font-semibold">{totalUsers > 0 ? Math.round(((premiumUsers + institutionUsers) / totalUsers) * 100) : 0}%</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Platform Health</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Average Safety Score</span><span className="text-2xl font-bold text-primary">{avgSafetyScore}%</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Recipes</span><span className="text-xl font-semibold">{recipes.length}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Courses</span><span className="text-xl font-semibold">{courses.length}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Lessons</span><span className="text-xl font-semibold">{lessons.length}</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />Revenue Overview</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground mb-1">Monthly Estimate</p><p className="text-3xl font-bold text-ethiopian-gold">{(premiumUsers * 199 + institutionUsers * 999).toLocaleString()} ETB</p></div>
                    <div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground mb-1">Premium Revenue</p><p className="text-3xl font-bold">{(premiumUsers * 199).toLocaleString()} ETB</p></div>
                    <div className="p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground mb-1">Institution Revenue</p><p className="text-3xl font-bold">{(institutionUsers * 999).toLocaleString()} ETB</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Certificate Settings</CardTitle>
                <CardDescription>Manage director signature for certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Director Signature</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload the director's signature image. This will appear on all certificates when students download them.
                    </p>
                    
                    {signatureUrl ? (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-6 bg-muted/30 flex flex-col items-center gap-4">
                          <p className="text-sm text-muted-foreground">Current Signature:</p>
                          <img src={signatureUrl + '?t=' + Date.now()} alt="Director Signature" className="max-h-24 max-w-xs object-contain" />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => document.getElementById('sig-upload')?.click()}>
                            <Upload className="h-4 w-4 mr-2" />Replace Signature
                          </Button>
                          <Button variant="destructive" size="sm" onClick={handleRemoveSignature}>
                            <Trash2 className="h-4 w-4 mr-2" />Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Image className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground mb-3">No signature uploaded yet</p>
                        <Button onClick={() => document.getElementById('sig-upload')?.click()} disabled={uploadingSignature}>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingSignature ? 'Uploading...' : 'Upload Signature'}
                        </Button>
                      </div>
                    )}
                    
                    <input
                      id="sig-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSignatureUpload}
                    />
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      Recommended: PNG with transparent background, approximately 300×100 pixels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
