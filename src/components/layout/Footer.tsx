import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Mail, Phone, MapPin, Facebook, Sparkles } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      {/* Ethiopian Heritage Stripe */}
      <div className="ethiopian-stripe" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ደህንነት ኬሚ" className="h-12 w-12 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold font-amharic">ደህንነት ኬሚ</h3>
                <p className="text-sm text-background/70">
                  {language === 'am' ? 'ሁሉም ነገር በደህንነት' : 'Everything in Safety'}
                </p>
              </div>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              {language === 'am' 
                ? 'በኢትዮጵያ የመጀመሪያው የኬሚስትሪ ደህንነት መድረክ። ደህንነትን በማስቀደም የኬሚስትሪ እውቀትን ለሁሉም።'
                : 'Ethiopia\'s first chemistry safety platform. Making chemistry knowledge accessible to everyone with safety first.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {language === 'am' ? 'ፈጣን አገናኞች' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/recipes" className="text-background/70 hover:text-background transition-colors">
                  {t('nav.recipes')}
                </Link>
              </li>
              <li>
                <Link to="/periodic-table" className="text-background/70 hover:text-background transition-colors">
                  {t('nav.periodic')}
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-background/70 hover:text-background transition-colors">
                  {t('nav.calculator')}
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-background/70 hover:text-background transition-colors">
                  {t('nav.safety')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {language === 'am' ? 'የአደጋ ጊዜ' : 'Emergency'}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-background/70">
                <span className="text-ethiopian-red font-bold">911</span> - {t('emergency.police')}
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <span className="text-ethiopian-red font-bold">907</span> - {t('emergency.ambulance')}
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <span className="text-ethiopian-red font-bold">939</span> - {t('emergency.fire')}
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {language === 'am' ? 'አግኙን' : 'Contact Us'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Bae, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+251 73724692</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>ayitegebtlahun@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} ደህንነት ኬሚ. {language === 'am' ? 'ሁሉም መብቶች የተጠበቁ ናቸው' : 'All rights reserved'}.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/abittitle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
            >
              Telegram
            </a>
            <a 
              href="https://www.ayitegebtilahun.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
            >
              Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
