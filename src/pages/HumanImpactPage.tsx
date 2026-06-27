import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, HeartPulse } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import { findChemical } from '@/data/chemicalsDatabase';
import AiResultCard from '@/components/safety/AiResultCard';
import HumanBodyDiagram from '@/components/safety/HumanBodyDiagram';

const HumanImpactPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [chemical, setChemical] = useState('');
  const [route, setRoute] = useState('skin');
  const { loading, reply, ask } = useAiSafety();
  const [instant, setInstant] = useState<string | null>(null);

  const severity = useMemo<'low' | 'moderate' | 'high' | 'extreme'>(() => {
    const text = (reply || '').toUpperCase();
    if (text.includes('EXTREME')) return 'extreme';
    if (text.includes('HIGH')) return 'high';
    if (text.includes('MODERATE')) return 'moderate';
    if (text.includes('LOW') || text.includes('SAFE')) return 'low';
    // Fall back to chemical hazard data
    const entry = findChemical(chemical);
    if (entry) {
      if (['corrosive', 'toxic', 'reactive'].includes(entry.hazardClass)) return 'extreme';
      if (['flammable', 'oxidizer'].includes(entry.hazardClass)) return 'high';
      if (entry.hazardClass === 'irritant') return 'moderate';
      if (entry.hazardClass === 'safe') return 'low';
    }
    return 'high';
  }, [reply, chemical]);

  const handleAnalyse = async () => {
    if (!chemical.trim()) return;
    const entry = findChemical(chemical);
    if (entry) {
      const map: Record<string, string> = {
        skin: entry.firstAid.skin,
        eyes: entry.firstAid.eyes,
        inhalation: entry.firstAid.inhalation,
        ingestion: entry.firstAid.ingestion,
      };
      setInstant(map[route] || null);
    } else {
      setInstant(null);
    }
    await ask('human_impact', { chemical: chemical.trim(), route });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የሰው አካል ላይ ተጽዕኖ' : 'Human Impact Mode'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'ኬሚካል በሰው አካል ላይ ምን እንደሚያደርስ ይወቁ' : 'Real anatomical view of chemical impact on the human body'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="p-6 space-y-4">
              <div>
                <Label>{isAm ? 'ኬሚካል' : 'Chemical'}</Label>
                <Input value={chemical} onChange={(e) => setChemical(e.target.value)} placeholder="e.g., NaOH" maxLength={80} />
              </div>
              <div>
                <Label>{isAm ? 'የተጋላጭነት መንገድ' : 'Exposure route'}</Label>
                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skin">{isAm ? 'ቆዳ ላይ' : 'Skin contact'}</SelectItem>
                    <SelectItem value="eyes">{isAm ? 'አይን ላይ' : 'Eye exposure'}</SelectItem>
                    <SelectItem value="inhalation">{isAm ? 'መተንፈስ' : 'Inhalation'}</SelectItem>
                    <SelectItem value="ingestion">{isAm ? 'መዋጥ' : 'Ingestion'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAnalyse} disabled={loading || !chemical.trim()} className="w-full">
                <User className="h-4 w-4 mr-2" />
                {loading ? (isAm ? 'በመተንተን ላይ…' : 'Analysing…') : (isAm ? 'ተጽዕኖ ይታይ' : 'Show body impact')}
              </Button>
            </Card>

            {instant && (
              <Card className="p-4 border-emerald-500/30 bg-emerald-500/5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  {isAm ? 'ፈጣን የመጀመሪያ እርዳታ' : 'Instant First Aid (verified database)'}
                </p>
                <p className="text-sm">{instant}</p>
              </Card>
            )}
          </div>

          <Card className="p-6 bg-gradient-to-br from-background to-muted/30">
            <div className="text-center mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isAm ? 'የሰው አካል ምስል' : 'Anatomical Impact View'}
              </p>
              <p className="text-sm font-semibold capitalize mt-1">
                {route === 'skin' && (isAm ? 'የቆዳ ተጋላጭነት' : 'Skin Exposure')}
                {route === 'eyes' && (isAm ? 'የዓይን ተጋላጭነት' : 'Eye Exposure')}
                {route === 'inhalation' && (isAm ? 'የመተንፈሻ ተጋላጭነት' : 'Respiratory Exposure')}
                {route === 'ingestion' && (isAm ? 'የመዋጥ ተጋላጭነት' : 'Digestive Exposure')}
              </p>
            </div>
            <HumanBodyDiagram route={route as any} severity={severity} />
            <div className="flex items-center justify-center gap-3 mt-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> High</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-700" /> Extreme</span>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <AiResultCard loading={loading} reply={reply} />
        </div>
      </div>
    </Layout>
  );
};

export default HumanImpactPage;
