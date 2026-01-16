import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'am' | 'en' | 'or';

interface Translations {
  [key: string]: {
    am: string;
    en: string;
    or: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': { am: 'መነሻ', en: 'Home', or: 'Mana' },
  'nav.dashboard': { am: 'ዳሽቦርድ', en: 'Dashboard', or: 'Daashboordii' },
  'nav.recipes': { am: 'ሪሰፕቶች', en: 'Recipes', or: 'Resippiiwwan' },
  'nav.periodic': { am: 'ንጥረ ነገሮች', en: 'Elements', or: 'Elementoota' },
  'nav.safety': { am: 'ደህንነት', en: 'Safety', or: 'Nageenya' },
  'nav.calculator': { am: 'ካልኩሌተር', en: 'Calculator', or: 'Herrega' },
  'nav.profile': { am: 'መገለጫ', en: 'Profile', or: 'Profaayilii' },
  'nav.logout': { am: 'ውጣ', en: 'Logout', or: 'Ba\'i' },
  'nav.login': { am: 'ግባ', en: 'Login', or: 'Seeni' },
  'nav.signup': { am: 'ተመዝገብ', en: 'Sign Up', or: 'Galmaa\'i' },
  'nav.admin': { am: 'አስተዳዳሪ', en: 'Admin', or: 'Bulchaa' },
  'nav.subscription': { am: 'ምዝገባ', en: 'Subscription', or: 'Maamilummaa' },
  
  // Hero Section
  'hero.title': { am: 'ደህንነት ኬሚ', en: 'Dehinnet Kemi', or: 'Nageenya Keemii' },
  'hero.slogan': { am: 'ሁሉም ነገር በደህንነት', en: 'Everything in Safety', or: 'Wanti Hundi Nageenya Keessatti' },
  'hero.subtitle': { am: 'በኢትዮጵያ የመጀመሪያው የኬሚስትሪ ደህንነት መድረክ', en: 'Ethiopia\'s First Chemistry Safety Platform', or: 'Ardii Nageenya Keemistirii Itoophiyaa Isa Jalqabaa' },
  'hero.cta': { am: 'ጀምር', en: 'Get Started', or: 'Jalqabi' },
  'hero.learn': { am: 'ተማር', en: 'Learn More', or: 'Dabalataan Baradhu' },
  
  // Safety
  'safety.title': { am: 'የደህንነት ቁጥጥር', en: 'Safety Check', or: 'Sakatta\'a Nageenya' },
  'safety.checklist': { am: 'የደህንነት ዝርዝር', en: 'Safety Checklist', or: 'Tarree Nageenya' },
  'safety.ppe': { am: 'የግል መከላከያ መሳሪያ', en: 'Personal Protective Equipment', or: 'Meeshaa Eegumsa Dhuunfaa' },
  'safety.gloves': { am: 'ጓንት', en: 'Gloves', or: 'Gaaloota' },
  'safety.goggles': { am: 'መነጽር', en: 'Safety Goggles', or: 'Fuulduubee Nageenya' },
  'safety.labcoat': { am: 'የላብ ካፖርት', en: 'Lab Coat', or: 'Koota Lab' },
  'safety.ventilation': { am: 'አየር ማስወጫ', en: 'Ventilation', or: 'Qilleensa' },
  'safety.firstaid': { am: 'የመጀመሪያ እርዳታ', en: 'First Aid Kit', or: 'Saanduqa Gargaarsa Jalqabaa' },
  'safety.water': { am: 'ንጹህ ውሃ', en: 'Clean Water', or: 'Bishaan Qulqulluu' },
  'safety.emergency': { am: 'አደጋ', en: 'Emergency', or: 'Balaa Tasaa' },
  'safety.score': { am: 'የደህንነት ነጥብ', en: 'Safety Score', or: 'Qabxii Nageenya' },
  'safety.certified': { am: 'ተረጋግጧል', en: 'Certified', or: 'Mirkanaa\'e' },
  'safety.complete': { am: 'ደህንነት ተረጋግጧል - መቀጠል', en: 'Safety Verified - Continue', or: 'Nageenya Mirkanaa\'e - Itti fufi' },
  
  // Recipes
  'recipe.soap': { am: 'ሳሙና', en: 'Soap', or: 'Saamunaa' },
  'recipe.detergent': { am: 'መዶሻ', en: 'Detergent', or: 'Dhiqannaa' },
  'recipe.cleaner': { am: 'ማጽጃ', en: 'Cleaner', or: 'Qulqulleessituu' },
  'recipe.ingredients': { am: 'ቁሳቁሶች', en: 'Ingredients', or: 'Wantoota' },
  'recipe.steps': { am: 'እርምጃዎች', en: 'Steps', or: 'Tarkaanfiiwwan' },
  'recipe.time': { am: 'ጊዜ', en: 'Time', or: 'Yeroo' },
  'recipe.difficulty': { am: 'ደረጃ', en: 'Difficulty', or: 'Cimina' },
  'recipe.beginner': { am: 'ጀማሪ', en: 'Beginner', or: 'Jalqabaa' },
  'recipe.intermediate': { am: 'መካከለኛ', en: 'Intermediate', or: 'Giddu Galeessa' },
  'recipe.advanced': { am: 'ከፍተኛ', en: 'Advanced', or: 'Olaanaa' },
  
  // Calculator
  'calc.title': { am: 'የሪሰፒ ካልኩሌተር', en: 'Recipe Calculator', or: 'Herrega Resippii' },
  'calc.quantity': { am: 'ብዛት', en: 'Quantity', or: 'Hamma' },
  'calc.calculate': { am: 'አስላ', en: 'Calculate', or: 'Herrega' },
  'calc.result': { am: 'ውጤት', en: 'Result', or: 'Bu\'aa' },
  'calc.oil': { am: 'ዘይት', en: 'Oil', or: 'Zayita' },
  'calc.lye': { am: 'ሶዳ', en: 'Lye (NaOH)', or: 'Lye (NaOH)' },
  'calc.water': { am: 'ውሃ', en: 'Water', or: 'Bishaan' },
  
  // Auth
  'auth.email': { am: 'ኢሜይል', en: 'Email', or: 'Imeelii' },
  'auth.password': { am: 'የይለፍ ቃል', en: 'Password', or: 'Jecha Icciitii' },
  'auth.fullname': { am: 'ሙሉ ስም', en: 'Full Name', or: 'Maqaa Guutuu' },
  'auth.login': { am: 'ግባ', en: 'Sign In', or: 'Seeni' },
  'auth.signup': { am: 'ተመዝገብ', en: 'Sign Up', or: 'Galmaa\'i' },
  'auth.forgot': { am: 'የይለፍ ቃል ረሳህ?', en: 'Forgot Password?', or: 'Jecha Icciitii Dagatte?' },
  'auth.noaccount': { am: 'መለያ የለህም?', en: 'Don\'t have an account?', or: 'Akkaawuntii hin qabduu?' },
  'auth.hasaccount': { am: 'መለያ አለህ?', en: 'Already have an account?', or: 'Duraan akkaawuntii qabdaa?' },
  
  // Dashboard
  'dash.welcome': { am: 'እንኳን ደህና መጣህ', en: 'Welcome', or: 'Baga Nagaan Dhufte' },
  'dash.experiments': { am: 'ሙከራዎች', en: 'Experiments', or: 'Yaalii' },
  'dash.achievements': { am: 'ስኬቶች', en: 'Achievements', or: 'Galma' },
  'dash.certifications': { am: 'ምስክር ወረቀቶች', en: 'Certifications', or: 'Ragaa' },
  'dash.quickActions': { am: 'ፈጣን እርምጃዎች', en: 'Quick Actions', or: 'Tarkaanfii Ariifataa' },
  'dash.recentActivity': { am: 'የቅርብ ጊዜ እንቅስቃሴዎች', en: 'Recent Activity', or: 'Sochii Dhihoo' },
  'dash.startExperiment': { am: 'ሙከራ ጀምር', en: 'Start Experiment', or: 'Yaalii Jalqabi' },
  
  // Periodic Table
  'periodic.title': { am: 'የንጥረ ነገሮች ሰንጠረዥ', en: 'Periodic Table', or: 'Gabatee Elementootaa' },
  'periodic.search': { am: 'ፈልግ...', en: 'Search...', or: 'Barbaadi...' },
  'periodic.atomicNumber': { am: 'አቶሚክ ቁጥር', en: 'Atomic Number', or: 'Lakkoofsa Atoomii' },
  'periodic.atomicMass': { am: 'አቶሚክ ክብደት', en: 'Atomic Mass', or: 'Hamma Atoomii' },
  'periodic.group': { am: 'ቡድን', en: 'Group', or: 'Garee' },
  'periodic.period': { am: 'ዘመን', en: 'Period', or: 'Yeroo' },
  
  // Emergency
  'emergency.title': { am: 'የአደጋ ጊዜ እርዳታ', en: 'Emergency Help', or: 'Gargaarsa Balaa Tasaa' },
  'emergency.call': { am: 'ደውል', en: 'Call', or: 'Bilbili' },
  'emergency.police': { am: 'ፖሊስ', en: 'Police', or: 'Poolisii' },
  'emergency.ambulance': { am: 'አምቡላንስ', en: 'Ambulance', or: 'Ambulaansii' },
  'emergency.fire': { am: 'እሳት', en: 'Fire', or: 'Ibidda' },
  
  // Admin
  'admin.title': { am: 'አስተዳዳሪ ፓነል', en: 'Admin Panel', or: 'Paanelii Bulchaa' },
  'admin.users': { am: 'ተጠቃሚዎች', en: 'Users', or: 'Fayyadamtoota' },
  'admin.recipes': { am: 'ሪሰፕቶች', en: 'Recipes', or: 'Resippiiwwan' },
  'admin.analytics': { am: 'ትንታኔ', en: 'Analytics', or: 'Xiinxala' },
  'admin.settings': { am: 'ቅንብሮች', en: 'Settings', or: 'Qindaa\'ina' },
  
  // Subscription
  'sub.free': { am: 'ነፃ', en: 'Free', or: 'Bilisaa' },
  'sub.premium': { am: 'ፕሪሚየም', en: 'Premium', or: 'Piriimiiyeemii' },
  'sub.institution': { am: 'ተቋም', en: 'Institution', or: 'Dhaabbata' },
  'sub.upgrade': { am: 'አሳድግ', en: 'Upgrade', or: 'Fooyyessi' },
  'sub.monthly': { am: 'ወርሃዊ', en: 'Monthly', or: 'Ji\'aan' },
  'sub.yearly': { am: 'ዓመታዊ', en: 'Yearly', or: 'Waggaan' },
  
  // Common
  'common.loading': { am: 'በመጫን ላይ...', en: 'Loading...', or: 'Fe\'aa jira...' },
  'common.error': { am: 'ስህተት', en: 'Error', or: 'Dogoggora' },
  'common.success': { am: 'ተሳክቷል', en: 'Success', or: 'Milkaa\'e' },
  'common.save': { am: 'አስቀምጥ', en: 'Save', or: 'Olkaa\'i' },
  'common.cancel': { am: 'ሰርዝ', en: 'Cancel', or: 'Haqi' },
  'common.continue': { am: 'ቀጥል', en: 'Continue', or: 'Itti fufi' },
  'common.back': { am: 'ተመለስ', en: 'Back', or: 'Duuba' },
  'common.next': { am: 'ቀጣይ', en: 'Next', or: 'Itti aanu' },
  'common.minutes': { am: 'ደቂቃ', en: 'minutes', or: 'daqiiqaa' },
  'common.hours': { am: 'ሰዓት', en: 'hours', or: 'sa\'aatii' },
  'common.days': { am: 'ቀናት', en: 'days', or: 'guyyaa' },
  'common.weeks': { am: 'ሳምንት', en: 'weeks', or: 'torban' },
  'common.view': { am: 'ይመልከቱ', en: 'View', or: 'Ilaali' },
  'common.edit': { am: 'አርትዕ', en: 'Edit', or: 'Gulaali' },
  'common.delete': { am: 'ሰርዝ', en: 'Delete', or: 'Haqi' },
  'common.search': { am: 'ፈልግ', en: 'Search', or: 'Barbaadi' },
  'common.filter': { am: 'አጣራ', en: 'Filter', or: 'Calalsi' },
  'common.all': { am: 'ሁሉም', en: 'All', or: 'Hunda' },
  'common.active': { am: 'ንቁ', en: 'Active', or: 'Hojii irra' },
  'common.inactive': { am: 'ቦዘን', en: 'Inactive', or: 'Hojii ala' },
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
