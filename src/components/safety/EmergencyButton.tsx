import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Phone, Ambulance, Flame, Shield, X } from 'lucide-react';

const EmergencyButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t, language } = useLanguage();

  const emergencyNumbers = [
    { 
      name: language === 'am' ? 'ፖሊስ' : 'Police', 
      number: '991', 
      icon: Shield,
      color: 'bg-blue-500 hover:bg-blue-600' 
    },
    { 
      name: language === 'am' ? 'አምቡላንስ' : 'Ambulance', 
      number: '907', 
      icon: Ambulance,
      color: 'bg-red-500 hover:bg-red-600' 
    },
    { 
      name: language === 'am' ? 'እሳት ማጥፊያ' : 'Fire Department', 
      number: '939', 
      icon: Flame,
      color: 'bg-orange-500 hover:bg-orange-600' 
    },
    { 
      name: language === 'am' ? 'መርዝ መከላከያ' : 'Poison Control', 
      number: '+251115517171', 
      icon: AlertTriangle,
      color: 'bg-purple-500 hover:bg-purple-600' 
    },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="emergency-button text-white"
        aria-label="Emergency"
      >
        <AlertTriangle className="h-8 w-8" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              {t('emergency.title')}
            </DialogTitle>
            <DialogDescription>
              {language === 'am' 
                ? 'አስቸኳይ እርዳታ ያስፈልግዎታል? ከዚህ በታች ያሉትን ቁጥሮች ይጠቀሙ።'
                : 'Need immediate help? Use the numbers below.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {emergencyNumbers.map((emergency) => (
              <a
                key={emergency.number}
                href={`tel:${emergency.number}`}
                className={`flex items-center justify-between p-4 rounded-lg text-white ${emergency.color} transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-center gap-3">
                  <emergency.icon className="h-6 w-6" />
                  <span className="font-semibold">{emergency.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-mono font-bold">{emergency.number}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">
              {language === 'am' ? 'የመጀመሪያ እርዳታ ምክር' : 'First Aid Tips'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {language === 'am' ? 'ተረጋጉ እና ደህንነትዎን ያረጋግጡ' : 'Stay calm and ensure your safety'}</li>
              <li>• {language === 'am' ? 'ለኬሚካል ግንኙነት - ለ15 ደቂቃ በውሃ ያጠቡ' : 'For chemical contact - flush with water for 15 min'}</li>
              <li>• {language === 'am' ? 'ያልተበረዘ ቦታ ይሂዱ' : 'Move to an uncontaminated area'}</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
