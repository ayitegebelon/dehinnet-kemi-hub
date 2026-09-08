import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Siren } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import AiResultCard from '@/components/safety/AiResultCard';

const QUICK_INCIDENTS = [
  'Acid spilled on skin',
  'Chemical splashed in eyes',
  'Inhaled toxic gas',
  'Swallowed unknown chemical',
  'Small chemical fire',
  'Cut from broken glassware',
];

const EmergencyResponsePage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [incident, setIncident] = useState('');
  const { loading, reply, ask } = useAiSafety();

  const trigger = (text: string) => {
    setIncident(text);
    ask('emergency', { incident: text });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center animate-pulse">
            <Siren className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-destructive">{isAm ? 'የአደጋ ምላሽ' : 'Emergency Response'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'ፈጣን የመጀመሪያ እርዳታ መመሪያ' : 'Instant first-aid guidance'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <a href="tel:907" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition">
            <Phone className="h-5 w-5" />
            <span className="text-xs font-bold">907</span>
            <span className="text-[10px]">{isAm ? 'አምቡላንስ' : 'Ambulance'}</span>
          </a>
          <a href="tel:939" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-orange-500 text-white hover:opacity-90 transition">
            <Phone className="h-5 w-5" />
            <span className="text-xs font-bold">939</span>
            <span className="text-[10px]">{isAm ? 'እሳት' : 'Fire'}</span>
          </a>
          <a href="tel:991" className="flex flex-col items-center gap-1 p-3 rounded-lg bg-blue-600 text-white hover:opacity-90 transition">
            <Phone className="h-5 w-5" />
            <span className="text-xs font-bold">991</span>
            <span className="text-[10px]">{isAm ? 'ፖሊስ' : 'Police'}</span>
          </a>
        </div>

        <Card className="p-6 mb-6">
          <Label className="mb-2 block">{isAm ? 'ፈጣን ሁኔታዎች' : 'Quick incidents'}</Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_INCIDENTS.map((q) => (
              <Button key={q} variant="outline" size="sm" onClick={() => trigger(q)} disabled={loading}>
                {q}
              </Button>
            ))}
          </div>
          <Label className="mb-2 block">{isAm ? 'ወይም ሁኔታውን ይግለጹ' : 'Or describe the incident'}</Label>
          <Textarea value={incident} onChange={(e) => setIncident(e.target.value)} placeholder="What happened?" rows={3} maxLength={500} />
          <Button
            onClick={() => ask('emergency', { incident: incident.trim() })}
            disabled={loading || !incident.trim()}
            className="w-full mt-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {loading ? (isAm ? 'በማቅረብ ላይ…' : 'Getting help…') : (isAm ? 'እርዳታ አግኝ' : 'Get emergency help')}
          </Button>
        </Card>

        <AiResultCard loading={loading} reply={reply} />
      </div>
    </Layout>
  );
};

export default EmergencyResponsePage;
