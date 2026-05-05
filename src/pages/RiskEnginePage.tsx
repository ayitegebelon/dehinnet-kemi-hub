import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, X, Plus } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import { findChemical, checkCompatibility } from '@/data/chemicalsDatabase';
import AiResultCard from '@/components/safety/AiResultCard';

const RiskEnginePage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [chems, setChems] = useState<string[]>(['']);
  const { loading, reply, ask } = useAiSafety();
  const [instantPairs, setInstantPairs] = useState<string[]>([]);

  const update = (i: number, v: string) => {
    const next = [...chems];
    next[i] = v;
    setChems(next);
  };

  const handle = async () => {
    const list = chems.map((c) => c.trim()).filter(Boolean);
    if (!list.length) return;
    // Pre-check pairs from our DB
    const warnings: string[] = [];
    const entries = list.map(findChemical).filter(Boolean) as ReturnType<typeof findChemical>[];
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const r = checkCompatibility(entries[i]!, entries[j]!);
        if (r.dangerous) warnings.push(r.reason!);
      }
    }
    setInstantPairs(warnings);
    await ask('risk_engine', { chemicals: list });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የኬሚካል አደጋ ስርዓት' : 'Chemical Risk Engine'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'ለሚሰሩበት ኬሚካሎች የአደጋ ግምገማ' : 'Risk assessment for your chemicals'}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <Label className="mb-2 block">{isAm ? 'ኬሚካሎች' : 'Chemicals you are working with'}</Label>
          <div className="space-y-2">
            {chems.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input value={c} onChange={(e) => update(i, e.target.value)} placeholder="e.g., NaOH" maxLength={80} />
                {chems.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setChems(chems.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {chems.length < 8 && (
              <Button variant="outline" size="sm" onClick={() => setChems([...chems, ''])}>
                <Plus className="h-4 w-4 mr-1" /> {isAm ? 'ጨምር' : 'Add'}
              </Button>
            )}
            <Button onClick={handle} disabled={loading || !chems.some((c) => c.trim())} className="ml-auto">
              {loading ? (isAm ? 'በመገምገም ላይ…' : 'Assessing…') : (isAm ? 'አደጋ ገምግም' : 'Assess risk')}
            </Button>
          </div>
        </Card>

        {instantPairs.map((w, i) => (
          <Card key={i} className="p-4 mb-3 border-destructive bg-destructive/10">
            <p className="text-sm font-semibold text-destructive">⚠ {w}</p>
          </Card>
        ))}

        <AiResultCard loading={loading} reply={reply} />
      </div>
    </Layout>
  );
};

export default RiskEnginePage;
