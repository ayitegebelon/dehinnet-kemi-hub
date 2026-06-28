import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  User, Mail, Phone, Shield, Award, Crown, Settings, Edit, Save, X,
  FlaskConical, Star, Trophy, Target, Calendar, Camera, Upload, MapPin,
  GraduationCap, Clock, Zap, Lock, Eye, EyeOff, KeyRound
} from 'lucide-react';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [realStats, setRealStats] = useState({ experiments: 0, certificates: 0, achievements: 0, completedLessons: 0 });
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [changingPwd, setChangingPwd] = useState(false);
  const [formData, setFormData] = useState<{
    full_name: string;
    father_name: string;
    phone: string;
    age: string;
    skill_level: 'beginner' | 'intermediate' | 'advanced';
    preferred_language: string;
  }>({
    full_name: profile?.full_name || '',
    father_name: (profile as any)?.father_name || '',
    phone: profile?.phone || '',
    age: profile?.age?.toString() || '',
    skill_level: profile?.skill_level || 'beginner',
    preferred_language: profile?.preferred_language || 'am',
  });

  const isAmharic = language === 'am';

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const fetchRealStats = async () => {
      const [expRes, certRes, achRes, lessonsRes] = await Promise.all([
        supabase.from('experiments').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('certificates').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('achievements').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_progress').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true),
      ]);
      setRealStats({
        experiments: expRes.count || 0,
        certificates: certRes.count || 0,
        achievements: achRes.count || 0,
        completedLessons: lessonsRes.count || 0,
      });
    };
    fetchRealStats();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error(isAmharic ? 'እባክዎ ምስል ይምረጡ' : 'Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isAmharic ? 'ፋይሉ ከ5MB መብለጥ የለበትም' : 'File must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Remove old avatar if exists
      await supabase.storage.from('avatars').remove([filePath]);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithCacheBust })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(urlWithCacheBust);
      toast.success(isAmharic ? 'ፎቶ ተቀይሯል' : 'Profile photo updated');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(isAmharic ? 'ፎቶ መስቀል አልተሳካም' : 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          father_name: formData.father_name,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null,
          skill_level: formData.skill_level as 'beginner' | 'intermediate' | 'advanced',
          preferred_language: formData.preferred_language,
        } as any)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success(isAmharic ? 'መገለጫ ተሻሽሏል' : 'Profile updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(isAmharic ? 'መገለጫ ማሻሻል አልተሳካም' : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    if (pwd.next.length < 8) {
      toast.error(isAmharic ? 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት' : 'Password must be at least 8 characters');
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast.error(isAmharic ? 'የይለፍ ቃሎች አይዛመዱም' : 'Passwords do not match');
      return;
    }
    if (pwd.next === pwd.current) {
      toast.error(isAmharic ? 'አዲሱ የይለፍ ቃል ከአሮጌው የተለየ መሆን አለበት' : 'New password must differ from the current one');
      return;
    }
    setChangingPwd(true);
    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: pwd.current,
      });
      if (reauthError) {
        toast.error(isAmharic ? 'የአሁኑ የይለፍ ቃል ትክክል አይደለም' : 'Current password is incorrect');
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: pwd.next });
      if (error) throw error;
      toast.success(isAmharic ? 'የይለፍ ቃል ተቀይሯል' : 'Password updated successfully');
      setPwd({ current: '', next: '', confirm: '' });
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(isAmharic ? 'የይለፍ ቃል መቀየር አልተሳካም' : 'Failed to update password');
    } finally {
      setChangingPwd(false);
    }
  };

  const stats = [
    { icon: Shield, label: isAmharic ? 'የደህንነት ነጥብ' : 'Safety Score', value: `${profile?.safety_score || 100}%`, color: 'text-success' },
    { icon: FlaskConical, label: isAmharic ? 'ሙከራዎች' : 'Experiments', value: String(realStats.experiments), color: 'text-science' },
    { icon: Award, label: isAmharic ? 'ምስክር ወረቀቶች' : 'Certificates', value: String(realStats.certificates), color: 'text-ethiopian-gold' },
    { icon: Trophy, label: isAmharic ? 'ስኬቶች' : 'Achievements', value: String(realStats.achievements), color: 'text-primary' },
  ];

  const getSubscriptionBadge = () => {
    switch (profile?.subscription_tier) {
      case 'premium':
        return <Badge className="bg-ethiopian-gold text-black"><Crown className="w-3 h-3 mr-1" /> Premium</Badge>;
      case 'institution':
        return <Badge className="bg-science text-white">🏛️ Institution</Badge>;
      default:
        return <Badge variant="secondary">🆓 Free</Badge>;
    }
  };

  const getSkillIcon = () => {
    switch (profile?.skill_level) {
      case 'advanced': return '🔬';
      case 'intermediate': return '⚗️';
      default: return '🧪';
    }
  };

  const memberSince = (profile as any)?.created_at
    ? new Date((profile as any).created_at).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { year: 'numeric', month: 'long' })
    : '';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-8 overflow-hidden border-0 shadow-xl">
            <div className="h-32 md:h-40 bg-gradient-to-r from-primary via-science to-accent relative">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
            </div>
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-20">
                {/* Avatar with upload */}
                <div className="relative group">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-gradient-to-br from-primary to-accent">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl font-bold text-white">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <Upload className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {/* Name & Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold">{profile?.full_name || 'User'}</h1>
                    {getSubscriptionBadge()}
                  </div>
                  {(profile as any)?.father_name && (
                    <p className="text-muted-foreground text-sm">
                      {isAmharic ? 'የአባት ስም' : "Father's Name"}: {(profile as any).father_name}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {user?.email}
                    </span>
                    {profile?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {profile.phone}
                      </span>
                    )}
                    {memberSince && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {isAmharic ? 'ከ' : 'Since'} {memberSince}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="outline" className="text-xs">
                      {getSkillIcon()} {profile?.skill_level || 'beginner'}
                    </Badge>
                    {profile?.age && (
                      <Badge variant="outline" className="text-xs">
                        {profile.age} {isAmharic ? 'ዓመት' : 'yrs'}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Edit button */}
                <Button
                  variant={isEditing ? 'outline' : 'default'}
                  onClick={() => setIsEditing(!isEditing)}
                  className="self-start md:self-auto"
                >
                  {isEditing ? (
                    <><X className="w-4 h-4 mr-2" />{isAmharic ? 'ሰርዝ' : 'Cancel'}</>
                  ) : (
                    <><Edit className="w-4 h-4 mr-2" />{isAmharic ? 'አርትዕ' : 'Edit'}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-muted ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {isAmharic ? 'መረጃ' : 'Info'}
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {isAmharic ? 'እድገት' : 'Progress'}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {isAmharic ? 'ቅንብሮች' : 'Settings'}
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    {isAmharic ? 'የግል መረጃ' : 'Personal Information'}
                  </CardTitle>
                  <CardDescription>
                    {isAmharic ? 'የመገለጫዎን ዝርዝሮች ያስተዳድሩ' : 'Manage your profile details'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('auth.fullname')}</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{profile?.full_name || '-'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">{isAmharic ? 'የአባት ስም' : "Father's Name"}</Label>
                      {isEditing ? (
                        <Input
                          id="fatherName"
                          value={formData.father_name}
                          onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                          placeholder={isAmharic ? 'የአባት ስም' : "Father's name"}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{(profile as any)?.father_name || '-'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('auth.email')}</Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{user?.email || '-'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{isAmharic ? 'ስልክ' : 'Phone'}</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="09XXXXXXXX"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{profile?.phone || '-'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">{isAmharic ? 'ዕድሜ' : 'Age'}</Label>
                      {isEditing ? (
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{profile?.age || '-'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skillLevel">{isAmharic ? 'የክህሎት ደረጃ' : 'Skill Level'}</Label>
                      {isEditing ? (
                        <Select
                          value={formData.skill_level}
                          onValueChange={(v) => setFormData({...formData, skill_level: v as 'beginner' | 'intermediate' | 'advanced'})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">{t('recipe.beginner')}</SelectItem>
                            <SelectItem value="intermediate">{t('recipe.intermediate')}</SelectItem>
                            <SelectItem value="advanced">{t('recipe.advanced')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <Star className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize font-medium">{profile?.skill_level || 'beginner'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{isAmharic ? 'ምዝገባ' : 'Subscription'}</Label>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                        <Crown className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize font-medium">{profile?.subscription_tier || 'free'}</span>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleSave} disabled={loading} size="lg">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? (isAmharic ? 'በማስቀመጥ ላይ...' : 'Saving...') : t('common.save')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    {isAmharic ? 'የእድገት ክትትል' : 'Progress Tracking'}
                  </CardTitle>
                  <CardDescription>
                    {isAmharic ? 'የኬሚስትሪ ጉዞዎን ይመልከቱ' : 'View your chemistry journey'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-success" />
                        {isAmharic ? 'የደህንነት ስልጠና' : 'Safety Training'}
                      </span>
                      <span>{profile?.safety_score || 100}%</span>
                    </div>
                    <Progress value={profile?.safety_score || 100} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium flex items-center gap-2">
                        <Star className="w-4 h-4 text-ethiopian-gold" />
                        {isAmharic ? 'የክህሎት ደረጃ' : 'Skill Level'}
                      </span>
                      <span className="capitalize">{profile?.skill_level ?? 'beginner'}</span>
                    </div>
                    <Progress 
                      value={profile?.skill_level === 'advanced' ? 100 : profile?.skill_level === 'intermediate' ? 66 : 33} 
                      className="h-3" 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-science" />
                        {isAmharic ? 'ሙከራዎች ተጠናቀዋል' : 'Experiments Completed'}
                      </span>
                      <span>{realStats.experiments}</span>
                    </div>
                    <Progress value={Math.min(realStats.experiments * 10, 100)} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        {isAmharic ? 'የተጠናቀቁ ትምህርቶች' : 'Lessons Completed'}
                      </span>
                      <span>{realStats.completedLessons}</span>
                    </div>
                    <Progress value={Math.min(realStats.completedLessons * 5, 100)} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-xl text-center border border-border/50">
                      <Award className="w-8 h-8 mx-auto mb-2 text-ethiopian-gold" />
                      <p className="text-2xl font-bold">{realStats.certificates}</p>
                      <p className="text-xs text-muted-foreground">{isAmharic ? 'ምስክር ወረቀቶች' : 'Certificates'}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl text-center border border-border/50">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{realStats.achievements}</p>
                      <p className="text-xs text-muted-foreground">{isAmharic ? 'ስኬቶች' : 'Achievements'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    {isAmharic ? 'ቅንብሮች' : 'Settings'}
                  </CardTitle>
                  <CardDescription>
                    {isAmharic ? 'የመተግበሪያ ቅንብሮችዎን ያስተዳድሩ' : 'Manage your app settings'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{isAmharic ? 'ተመራጭ ቋንቋ' : 'Preferred Language'}</Label>
                    {isEditing ? (
                      <Select
                        value={formData.preferred_language}
                        onValueChange={(v) => setFormData({...formData, preferred_language: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="am">አማርኛ</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="or">Oromiffa</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg border border-border/50 font-medium">
                        {profile?.preferred_language === 'am' ? 'አማርኛ' : 
                         profile?.preferred_language === 'or' ? 'Oromiffa' : 'English'}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="p-4 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-destructive mb-2">
                      {isAmharic ? 'አደገኛ ዞን' : 'Danger Zone'}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isAmharic ? 'መለያዎን ለመሰረዝ ድጋፍ ያግኙ' : 'Contact support to delete your account'}
                    </p>
                    <Button variant="destructive" size="sm" disabled>
                      {isAmharic ? 'መለያ ሰርዝ' : 'Delete Account'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
