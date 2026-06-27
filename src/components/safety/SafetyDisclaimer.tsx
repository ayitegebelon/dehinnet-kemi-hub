import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Phone, HeartPulse, Siren } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  context?: 'mixing' | 'exposure' | 'general';
}

const SafetyDisclaimer: React.FC<Props> = ({ context = 'general' }) => {
  const { language } = useLanguage();
  const isAm = language === 'am';

  const titleMap = {
    mixing: isAm ? 'ከመቀላቀልዎ በፊት ያንብቡ' : 'Read before mixing',
    exposure: isAm ? 'ለተጋላጭነት ፈጣን እርምጃ' : 'Quick actions for exposure',
    general: isAm ? 'የደህንነት ማስታወቂያ' : 'Safety Notice',
  };

  const firstAid = isAm
    ? [
        'ቆዳ: በብዙ ውሃ ቢያንስ 15 ደቂቃ ይታጠቡ።',
        'አይን: ዓይኖችን በውሃ ቢያንስ 15 ደቂቃ ያጠቡ።',
        'መተንፈስ: ወዲያውኑ ወደ ንፁህ አየር ይውጡ።',
        'መዋጥ: አያስታፉ — ወዲያውኑ 907 ይደውሉ።',
      ]
    : [
        'Skin: rinse with running water for at least 15 minutes.',
        'Eyes: flush eyes with water for at least 15 minutes — no rubbing.',
        'Inhaled: move to fresh air immediately.',
        'Swallowed: do not induce vomiting — call 907 right away.',
      ];

  return (
    <Card className="p-4 border-amber-500/40 bg-amber-500/5 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-sm text-amber-700 dark:text-amber-400">{titleMap[context]}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAm
              ? 'ይህ የ AI ግምገማ ለትምህርታዊ ምክር ብቻ ነው። በአስቸኳይ ጊዜ ሁልጊዜ ባለሙያን ያነጋግሩ።'
              : 'This AI guidance is for educational support only. In an emergency, always contact a qualified professional.'}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-background/60 p-3 border border-border/40">
          <p className="flex items-center gap-2 text-xs font-semibold mb-2">
            <HeartPulse className="h-3.5 w-3.5 text-rose-500" />
            {isAm ? 'የመጀመሪያ እርዳታ' : 'First-aid'}
          </p>
          <ul className="space-y-1 text-[11px] text-muted-foreground leading-relaxed">
            {firstAid.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-background/60 p-3 border border-border/40">
          <p className="flex items-center gap-2 text-xs font-semibold mb-2">
            <Siren className="h-3.5 w-3.5 text-red-500" />
            {isAm ? 'የአደጋ ጊዜ ስልኮች (ኢትዮጵያ)' : 'Emergency numbers (Ethiopia)'}
          </p>
          <ul className="space-y-1 text-[11px]">
            <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> {isAm ? 'ፖሊስ' : 'Police'} — <a href="tel:991" className="font-semibold underline">991</a></li>
            <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> {isAm ? 'አምቡላንስ' : 'Ambulance'} — <a href="tel:907" className="font-semibold underline">907</a></li>
            <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> {isAm ? 'እሳት አደጋ' : 'Fire'} — <a href="tel:939" className="font-semibold underline">939</a></li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default SafetyDisclaimer;
