import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, FlaskConical, Award, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();

  const stats = [
    { icon: Shield, label: t('safety.score'), value: `${profile?.safety_score || 100}%`, color: 'text-primary' },
    { icon: FlaskConical, label: t('dash.experiments'), value: '0', color: 'text-science' },
    { icon: Award, label: t('dash.certifications'), value: '0', color: 'text-ethiopian-gold' },
    { icon: TrendingUp, label: language === 'am' ? 'ደረጃ' : 'Level', value: profile?.skill_level || 'beginner', color: 'text-accent' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('dash.welcome')}, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground">
            {language === 'am' ? 'የኬሚስትሪ ጉዞዎን ይቀጥሉ' : 'Continue your chemistry journey'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Safety Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('safety.title')}
            </CardTitle>
            <CardDescription>
              {language === 'am' ? 'የደህንነት ስልጠናዎን ያጠናቅቁ' : 'Complete your safety training'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={profile?.safety_score || 100} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground">
              {profile?.safety_score || 100}% {language === 'am' ? 'ተጠናቋል' : 'Complete'}
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>{language === 'am' ? 'የመጀመሪያ ሪሰፒ' : 'Start First Recipe'}</CardTitle>
              <CardDescription>{language === 'am' ? 'ቀላል ሳሙና መስራት' : 'Make simple soap'}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>{language === 'am' ? 'ንጥረ ነገሮችን ያስሱ' : 'Explore Elements'}</CardTitle>
              <CardDescription>{language === 'am' ? 'የንጥረ ነገሮች ሰንጠረዥ' : 'Interactive periodic table'}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
