import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'am' | 'en';

interface Translations {
  [key: string]: {
    am: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': { am: 'መነሻ', en: 'Home' },
  'nav.dashboard': { am: 'ዳሽቦርድ', en: 'Dashboard' },
  'nav.recipes': { am: 'ሪሰፕቶች', en: 'Recipes' },
  'nav.periodic': { am: 'ንጥረ ነገሮች', en: 'Elements' },
  'nav.safety': { am: 'ደህንነት', en: 'Safety' },
  'nav.calculator': { am: 'ካልኩሌተር', en: 'Calculator' },
  'nav.profile': { am: 'መገለጫ', en: 'Profile' },
  'nav.logout': { am: 'ውጣ', en: 'Logout' },
  'nav.login': { am: 'ግባ', en: 'Login' },
  'nav.signup': { am: 'ተመዝገብ', en: 'Sign Up' },
  
  // Hero Section
  'hero.title': { am: 'ደህንነት ኬሚ', en: 'Dehinnet Kemi' },
  'hero.slogan': { am: 'ሁሉም ነገር በደህንነት', en: 'Everything in Safety' },
  'hero.subtitle': { am: 'በኢትዮጵያ የመጀመሪያው የኬሚስትሪ ደህንነት መድረክ', en: 'Ethiopia\'s First Chemistry Safety Platform' },
  'hero.cta': { am: 'ጀምር', en: 'Get Started' },
  'hero.learn': { am: 'ተማር', en: 'Learn More' },
  
  // Safety
  'safety.title': { am: 'የደህንነት ቁጥጥር', en: 'Safety Check' },
  'safety.checklist': { am: 'የደህንነት ዝርዝር', en: 'Safety Checklist' },
  'safety.ppe': { am: 'የግል መከላከያ መሳሪያ', en: 'Personal Protective Equipment' },
  'safety.gloves': { am: 'ጓንት', en: 'Gloves' },
  'safety.goggles': { am: 'መነጽር', en: 'Safety Goggles' },
  'safety.labcoat': { am: 'የላብ ካፖርት', en: 'Lab Coat' },
  'safety.ventilation': { am: 'አየር ማስወጫ', en: 'Ventilation' },
  'safety.firstaid': { am: 'የመጀመሪያ እርዳታ', en: 'First Aid Kit' },
  'safety.water': { am: 'ንጹህ ውሃ', en: 'Clean Water' },
  'safety.emergency': { am: 'አደጋ', en: 'Emergency' },
  'safety.score': { am: 'የደህንነት ነጥብ', en: 'Safety Score' },
  'safety.certified': { am: 'ተረጋግጧል', en: 'Certified' },
  'safety.complete': { am: 'ደህንነት ተረጋግጧል - መቀጠል', en: 'Safety Verified - Continue' },
  
  // Recipes
  'recipe.soap': { am: 'ሳሙና', en: 'Soap' },
  'recipe.detergent': { am: 'መዶሻ', en: 'Detergent' },
  'recipe.cleaner': { am: 'ማጽጃ', en: 'Cleaner' },
  'recipe.ingredients': { am: 'ቁሳቁሶች', en: 'Ingredients' },
  'recipe.steps': { am: 'እርምጃዎች', en: 'Steps' },
  'recipe.time': { am: 'ጊዜ', en: 'Time' },
  'recipe.difficulty': { am: 'ደረጃ', en: 'Difficulty' },
  'recipe.beginner': { am: 'ጀማሪ', en: 'Beginner' },
  'recipe.intermediate': { am: 'መካከለኛ', en: 'Intermediate' },
  'recipe.advanced': { am: 'ከፍተኛ', en: 'Advanced' },
  
  // Calculator
  'calc.title': { am: 'የሪሰፒ ካልኩሌተር', en: 'Recipe Calculator' },
  'calc.quantity': { am: 'ብዛት', en: 'Quantity' },
  'calc.calculate': { am: 'አስላ', en: 'Calculate' },
  'calc.result': { am: 'ውጤት', en: 'Result' },
  'calc.oil': { am: 'ዘይት', en: 'Oil' },
  'calc.lye': { am: 'ሶዳ', en: 'Lye (NaOH)' },
  'calc.water': { am: 'ውሃ', en: 'Water' },
  
  // Auth
  'auth.email': { am: 'ኢሜይል', en: 'Email' },
  'auth.password': { am: 'የይለፍ ቃል', en: 'Password' },
  'auth.fullname': { am: 'ሙሉ ስም', en: 'Full Name' },
  'auth.login': { am: 'ግባ', en: 'Sign In' },
  'auth.signup': { am: 'ተመዝገብ', en: 'Sign Up' },
  'auth.forgot': { am: 'የይለፍ ቃል ረሳህ?', en: 'Forgot Password?' },
  'auth.noaccount': { am: 'መለያ የለህም?', en: 'Don\'t have an account?' },
  'auth.hasaccount': { am: 'መለያ አለህ?', en: 'Already have an account?' },
  
  // Dashboard
  'dash.welcome': { am: 'እንኳን ደህና መጣህ', en: 'Welcome' },
  'dash.experiments': { am: 'ሙከራዎች', en: 'Experiments' },
  'dash.achievements': { am: 'ስኬቶች', en: 'Achievements' },
  'dash.certifications': { am: 'ምስክር ወረቀቶች', en: 'Certifications' },
  
  // Periodic Table
  'periodic.title': { am: 'የንጥረ ነገሮች ሰንጠረዥ', en: 'Periodic Table' },
  'periodic.search': { am: 'ፈልግ...', en: 'Search...' },
  'periodic.atomicNumber': { am: 'አቶሚክ ቁጥር', en: 'Atomic Number' },
  'periodic.atomicMass': { am: 'አቶሚክ ክብደት', en: 'Atomic Mass' },
  'periodic.group': { am: 'ቡድን', en: 'Group' },
  'periodic.period': { am: 'ዘመን', en: 'Period' },
  
  // Emergency
  'emergency.title': { am: 'የአደጋ ጊዜ እርዳታ', en: 'Emergency Help' },
  'emergency.call': { am: 'ደውል', en: 'Call' },
  'emergency.police': { am: 'ፖሊስ', en: 'Police' },
  'emergency.ambulance': { am: 'አምቡላንስ', en: 'Ambulance' },
  'emergency.fire': { am: 'እሳት', en: 'Fire' },
  
  // Common
  'common.loading': { am: 'በመጫን ላይ...', en: 'Loading...' },
  'common.error': { am: 'ስህተት', en: 'Error' },
  'common.success': { am: 'ተሳክቷል', en: 'Success' },
  'common.save': { am: 'አስቀምጥ', en: 'Save' },
  'common.cancel': { am: 'ሰርዝ', en: 'Cancel' },
  'common.continue': { am: 'ቀጥል', en: 'Continue' },
  'common.back': { am: 'ተመለስ', en: 'Back' },
  'common.next': { am: 'ቀጣይ', en: 'Next' },
  'common.minutes': { am: 'ደቂቃ', en: 'minutes' },
  'common.hours': { am: 'ሰዓት', en: 'hours' },
  'common.days': { am: 'ቀናት', en: 'days' },
  'common.weeks': { am: 'ሳምንት', en: 'weeks' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dehinnet-language');
    return (saved as Language) || 'am';
  });

  useEffect(() => {
    localStorage.setItem('dehinnet-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
