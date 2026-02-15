import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  MessageSquare, Plus, Send, Clock, User, ChevronDown,
  ChevronUp, Search, MessagesSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DiscussionPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [search, setSearch] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, any[]>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [profiles, setProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchCourses();
    fetchPosts();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id, title_en, title_am');
    if (data) setCourses(data);
  };

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase.from('discussion_posts').select('*').order('created_at', { ascending: false });
    if (selectedCourse !== 'all') query = query.eq('course_id', selectedCourse);
    const { data } = await query;
    setPosts(data || []);

    // Fetch profiles for post authors
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(p => p.user_id))];
      const { data: profs } = await supabase.from('profiles').select('user_id, full_name, avatar_url').in('user_id', userIds);
      const map: Record<string, any> = {};
      profs?.forEach(p => { map[p.user_id] = p; });
      setProfiles(map);
    }
    setLoading(false);
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error(language === 'am' ? 'ሁሉንም ሙሉ' : 'Please fill all fields');
      return;
    }
    const { error } = await supabase.from('discussion_posts').insert({
      user_id: user!.id,
      course_id: newCourseId || null,
      title: newTitle,
      content: newContent,
    });
    if (!error) {
      toast.success(language === 'am' ? 'ልጥፍ ተለጥፏል!' : 'Post created!');
      setIsNewPostOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewCourseId('');
      fetchPosts();
    }
  };

  const toggleReplies = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    setExpandedPost(postId);
    if (!replies[postId]) {
      const { data } = await supabase.from('discussion_replies').select('*').eq('post_id', postId).order('created_at');
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(r => r.user_id))];
        const { data: profs } = await supabase.from('profiles').select('user_id, full_name').in('user_id', userIds);
        profs?.forEach(p => { setProfiles(prev => ({ ...prev, [p.user_id]: p })); });
      }
      setReplies(prev => ({ ...prev, [postId]: data || [] }));
    }
  };

  const sendReply = async (postId: string) => {
    const text = replyText[postId]?.trim();
    if (!text) return;
    const { data, error } = await supabase.from('discussion_replies').insert({
      post_id: postId,
      user_id: user!.id,
      content: text,
    }).select();
    if (!error && data) {
      setReplies(prev => ({ ...prev, [postId]: [...(prev[postId] || []), ...data] }));
      setReplyText(prev => ({ ...prev, [postId]: '' }));
      // Update reply count
      await supabase.from('discussion_posts').update({ replies_count: (posts.find(p => p.id === postId)?.replies_count || 0) + 1 }).eq('id', postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies_count: (p.replies_count || 0) + 1 } : p));
    }
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  const getCourseTitle = (courseId: string) => {
    const c = courses.find(c => c.id === courseId);
    if (!c) return '';
    return language === 'am' ? c.title_am : c.title_en;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <MessagesSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === 'am' ? 'ውይይት' : 'Discussion Forum'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'am' ? 'ጥያቄዎችን ይጠይቁ እና ይወያዩ' : 'Ask questions and discuss chemistry topics'}
              </p>
            </div>
          </div>
          <Button onClick={() => setIsNewPostOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {language === 'am' ? 'አዲስ ልጥፍ' : 'New Post'}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'am' ? 'ይፈልጉ...' : 'Search discussions...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'am' ? 'ሁሉም' : 'All Topics'}</SelectItem>
              {courses.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {language === 'am' ? c.title_am : c.title_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {language === 'am' ? 'ምንም ልጥፍ አልተገኘም' : 'No discussions yet. Start the conversation!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(post => (
              <Card key={post.id} className="hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{post.title}</CardTitle>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {profiles[post.user_id]?.full_name || 'User'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                        {post.course_id && (
                          <Badge variant="outline" className="text-xs">
                            {getCourseTitle(post.course_id)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap mb-3">{post.content}</p>

                  <button
                    onClick={() => toggleReplies(post.id)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {post.replies_count || 0} {language === 'am' ? 'መልሶች' : 'replies'}
                    {expandedPost === post.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {/* Replies */}
                  {expandedPost === post.id && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      {(replies[post.id] || []).map(reply => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium">
                              {profiles[reply.user_id]?.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {profiles[reply.user_id]?.full_name || 'User'}
                              </span>
                              <span>{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm mt-0.5">{reply.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder={language === 'am' ? 'መልስ ይጻፉ...' : 'Write a reply...'}
                          value={replyText[post.id] || ''}
                          onChange={e => setReplyText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && sendReply(post.id)}
                        />
                        <Button size="icon" onClick={() => sendReply(post.id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* New Post Dialog */}
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'am' ? 'አዲስ ውይይት' : 'New Discussion'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder={language === 'am' ? 'ርዕስ' : 'Title'}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <Select value={newCourseId} onValueChange={setNewCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'am' ? 'ኮርስ ይምረጡ (አማራጭ)' : 'Select course (optional)'} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {language === 'am' ? c.title_am : c.title_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder={language === 'am' ? 'ይዘት' : 'Write your question or discussion...'}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                {language === 'am' ? 'ሰርዝ' : 'Cancel'}
              </Button>
              <Button onClick={createPost}>
                <Send className="h-4 w-4 mr-1" />
                {language === 'am' ? 'ለጥፍ' : 'Post'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default DiscussionPage;
