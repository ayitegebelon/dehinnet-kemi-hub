import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlaskConical, Plus, X, Sparkles, AlertTriangle } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import { findChemical, checkCompatibility } from '@/data/chemicalsDatabase';
import AiResultCard from '@/components/safety/AiResultCard';

const WhatIfPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [chemicals, setChemicals] = useState<string[]>(['', '']);
  const { loading, reply, ask } = useAiSafety();
  const [instantWarning, setInstantWarning] = useState<string | null>(null);

  const updateChem = (i: number, val: string) => {
    const next = [...chemicals];
    next[i] = val;
    setChemicals(next);
  };

  const addChem = () => chemicals.length < 5 && setChemicals([...chemicals, '']);
  const removeChem = (i: number) => chemicals.length > 2 && setChemicals(chemicals.filter((_, idx) => idx !== i));

  const handleAnalyse = async () => {
    const list = chemicals.map((c) => c.trim()).filter(Boolean);
    if (list.length < 2) return;
    setInstantWarning(null);
    // Instant database check
    const entries = list.map(findChemical).filter(Boolean) as ReturnType<typeof findChemical>[];
    if (entries.length >= 2) {
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          const result = checkCompatibility(entries[i]!, entries[j]!);
          if (result.dangerous) {
            setInstantWarning(result.reason!);
            break;
          }
        }
      }
    }
    await ask('what_if', { chemicals: list });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{isAm ? '"ምን ቢሆንስ?" ምላሽ ማስመሰያ' : 'What If? Reaction Predictor'}</h1>
              <p className="text-sm text-muted-foreground">
                {isAm ? 'ሁለት ወይም ከዚያ በላይ ኬሚካሎች ቢቀላቀሉ ምን እንደሚሆን ይተንብዩ' : 'Predict what happens when chemicals are mixed'}
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <Label className="text-sm font-semibold mb-3 block">
            {isAm ? 'የሚቀላቀሉ ኬሚካሎች' : 'Chemicals to mix'}
          </Label>
          <div className="space-y-2">
            {chemicals.map((c, i) => (
              <div key={i} className="flex gap-2">
                <div className="relative flex-1">
                  <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={c}
                    onChange={(e) => updateChem(i, e.target.value)}
                    placeholder={i === 0 ? 'e.g., Bleach' : 'e.g., Ammonia'}
                    className="pl-9"
                    maxLength={80}
                  />
                </div>
                {chemicals.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => removeChem(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {chemicals.length < 5 && (
              <Button variant="outline" size="sm" onClick={addChem}>
                <Plus className="h-4 w-4 mr-1" /> {isAm ? 'ኬሚካል ጨምር' : 'Add chemical'}
              </Button>
            )}
            <Button
              onClick={handleAnalyse}
              disabled={loading || chemicals.filter((c) => c.trim()).length < 2}
              className="ml-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? (isAm ? 'በመተንተን ላይ…' : 'Analysing…') : (isAm ? 'ተንብይ' : 'Predict reaction')}
            </Button>
          </div>
        </Card>

        {instantWarning && (
          <Card className="p-4 mb-4 border-destructive bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-destructive text-sm mb-1">
                  {isAm ? 'ፈጣን ማስጠንቀቂያ' : 'Instant Warning (from database)'}
                </p>
                <p className="text-sm">{instantWarning}</p>
              </div>
            </div>
          </Card>
        )}

        <AiResultCard loading={loading} reply={reply} emptyText={isAm ? 'ምላሽ ለማየት ኬሚካሎችን ያስገቡ' : 'Add chemicals to see prediction.'} />
      </div>
    </Layout>
  );
};

export default WhatIfPage;
