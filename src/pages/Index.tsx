import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Shield, FlaskConical, Atom, Calculator, ArrowRight, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import logo from '@/assets/logo.png';

const Index: React.FC = () => {
  const { t, language } = useLanguage();

  const features = [
    { icon: Shield, title: language === 'am' ? 'የደህንነት ስልጠና' : 'Safety Training', desc: language === 'am' ? 'ከመጀመሪያው የደህንነት ፈተና' : 'Safety-first approach' },
    { icon: FlaskConical, title: language === 'am' ? 'ሪሰፕቶች' : 'Recipes', desc: language === 'am' ? 'ሳሙና፣ መዶሻ እና ሌሎች' : 'Soap, detergent & more' },
    { icon: Atom, title: language === 'am' ? 'ንጥረ ነገሮች' : 'Elements', desc: language === 'am' ? 'የንጥረ ነገሮች ሰንጠረዥ' : 'Interactive periodic table' },
    { icon: Calculator, title: language === 'am' ? 'ካልኩሌተር' : 'Calculator', desc: language === 'am' ? 'ትክክለኛ መለኪያዎች' : 'Precise measurements' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="hero-pattern absolute inset-0" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in mb-8">
              <img src={logo} alt="ደህንነት ኬሚ" className="h-24 w-24 mx-auto rounded-2xl shadow-2xl mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-amharic">{t('hero.title')}</h1>
              <p className="text-2xl md:text-3xl font-light opacity-90 font-amharic">{t('hero.slogan')}</p>
            </div>
            <p className="text-lg md:text-xl opacity-80 mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/signup">{t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 border-white/30 text-white hover:bg-white/10">
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'am' ? 'ዋና ባህሪያት' : 'Key Features'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center hover:shadow-card-hover transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-amharic">
            {language === 'am' ? 'ዛሬ ጀምር!' : 'Start Today!'}
          </h2>
          <p className="mb-8 opacity-90">
            {language === 'am' ? 'በነጻ ተመዝገብ እና የኬሚስትሪ ጉዞህን ጀምር' : 'Sign up for free and begin your chemistry journey'}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">{t('nav.signup')} <CheckCircle className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
