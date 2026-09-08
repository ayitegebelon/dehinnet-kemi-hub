import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.png';

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      const friendlyMsg = error.message === 'Invalid login credentials'
        ? (language === 'am' ? 'ኢሜል ወይም የይለፍ ቃል ስህተት ነው። እባክዎ እንደገና ይሞክሩ።' : 'Incorrect email or password. Please check your credentials and try again.')
        : error.message;
      toast({ title: t('common.error'), description: friendlyMsg, variant: 'destructive' });
    } else {
      toast({ title: t('common.success'), description: language === 'am' ? 'እንኳን ደህና መጡ!' : 'Welcome back!' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="ethiopian-stripe fixed top-0 left-0 right-0" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="ደህንነት ኬሚ" className="h-16 w-16 mx-auto rounded-xl" />
          </Link>
          <CardTitle className="text-2xl font-amharic">{t('auth.login')}</CardTitle>
          <CardDescription>{language === 'am' ? 'መለያዎን ያስገቡ' : 'Sign in to your account'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('auth.login')}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.noaccount')}{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">{t('auth.signup')}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
