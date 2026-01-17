import React, { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Shield,
  Award,
  Crown,
  Settings,
  Edit,
  Save,
  X,
  FlaskConical,
  Star,
  Trophy,
  Target,
  Calendar
} from 'lucide-react';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    full_name: string;
    phone: string;
    age: string;
    skill_level: 'beginner' | 'intermediate' | 'advanced';
    preferred_language: string;
  }>({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    age: profile?.age?.toString() || '',
    skill_level: profile?.skill_level || 'beginner',
    preferred_language: profile?.preferred_language || 'am',
  });

  const isAmharic = language === 'am';

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null,
          skill_level: formData.skill_level as 'beginner' | 'intermediate' | 'advanced',
          preferred_language: formData.preferred_language,
        })
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

  const stats = [
    { icon: Shield, label: isAmharic ? 'የደህንነት ነጥብ' : 'Safety Score', value: `${profile?.safety_score || 100}%`, color: 'text-success' },
    { icon: FlaskConical, label: isAmharic ? 'ሙከራዎች' : 'Experiments', value: '0', color: 'text-science' },
    { icon: Award, label: isAmharic ? 'ምስክር ወረቀቶች' : 'Certifications', value: '0', color: 'text-ethiopian-gold' },
    { icon: Trophy, label: isAmharic ? 'ስኬቶች' : 'Achievements', value: '0', color: 'text-primary' },
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary via-science to-accent" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white border-4 border-background shadow-lg">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold">{profile?.full_name || 'User'}</h1>
                    {getSubscriptionBadge()}
                  </div>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Button
                  variant={isEditing ? 'outline' : 'default'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      {isAmharic ? 'ሰርዝ' : 'Cancel'}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      {isAmharic ? 'አርትዕ' : 'Edit'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                  <CardTitle>{isAmharic ? 'የግል መረጃ' : 'Personal Information'}</CardTitle>
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
                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{profile?.full_name || '-'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('auth.email')}</Label>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user?.email || '-'}</span>
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
                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{profile?.phone || '-'}</span>
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
                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{profile?.age || '-'}</span>
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
                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Star className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{profile?.skill_level || 'beginner'}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{isAmharic ? 'ምዝገባ' : 'Subscription'}</Label>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Crown className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{profile?.subscription_tier || 'free'}</span>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button onClick={handleSave} disabled={loading}>
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
                  <CardTitle>{isAmharic ? 'የእድገት ክትትል' : 'Progress Tracking'}</CardTitle>
                  <CardDescription>
                    {isAmharic ? 'የኬሚስትሪ ጉዞዎን ይመልከቱ' : 'View your chemistry journey'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Safety Progress */}
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

                  {/* Skill Progress */}
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

                  {/* Experiments Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-science" />
                        {isAmharic ? 'ሙከራዎች ተጠናቀዋል' : 'Experiments Completed'}
                      </span>
                      <span>0/10</span>
                    </div>
                    <Progress value={0} className="h-3" />
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-2 text-ethiopian-gold" />
                    <h4 className="font-medium mb-1">
                      {isAmharic ? 'ቀጣዩ ስኬት' : 'Next Achievement'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? 'የመጀመሪያ ሙከራዎን ያጠናቅቁ' : 'Complete your first experiment'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>{isAmharic ? 'ቅንብሮች' : 'Settings'}</CardTitle>
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
                      <div className="p-2 bg-muted rounded">
                        {profile?.preferred_language === 'am' ? 'አማርኛ' : 
                         profile?.preferred_language === 'or' ? 'Oromiffa' : 'English'}
                      </div>
                    )}
                  </div>

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
