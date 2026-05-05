import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Database, Shield, Droplet, Wind, Eye, Beaker, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CHEMICALS, ChemicalEntry } from '@/data/chemicalsDatabase';
import { useAiSafety } from '@/hooks/useAiSafety';
import AiResultCard from '@/components/safety/AiResultCard';

const riskColor = (level: number) =>
  level >= 5 ? 'bg-destructive text-destructive-foreground' :
  level >= 4 ? 'bg-orange-500 text-white' :
  level >= 3 ? 'bg-amber-500 text-black' :
  level >= 2 ? 'bg-yellow-500 text-black' :
  'bg-emerald-500 text-white';

const ChemicalDatabasePage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ChemicalEntry | null>(null);
  const { loading, reply, ask } = useAiSafety();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHEMICALS;
    return CHEMICALS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.formula.toLowerCase().includes(q) ||
        c.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [query]);

  const askForAlternative = () => {
    if (!selected) return;
    ask('alternative', { chemical: selected.name, purpose: 'general lab use / cleaning' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የኬሚካል ደህንነት ዳታቤዝ' : 'Chemical Safety Database'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'አደጋ፣ የመጀመሪያ እርዳታ፣ የማከማቻ መመሪያ' : 'Hazards, first aid, storage rules'}
            </p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAm ? 'በስም፣ ቀመር ወይም ሌላ ስም ፈልግ…' : 'Search by name, formula, or alias…'}
            className="pl-10"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {results.length === 0 && (
              <Card className="p-6 text-center text-sm text-muted-foreground">No matching chemicals.</Card>
            )}
            {results.map((c) => (
              <Card
                key={c.id}
                onClick={() => setSelected(c)}
                className={`p-4 cursor-pointer transition hover:border-primary/50 ${selected?.id === c.id ? 'border-primary' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{c.formula}</p>
                  </div>
                  <Badge className={riskColor(c.riskLevel)}>{c.hazardClass}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div>
            {!selected ? (
              <Card className="p-8 text-center text-sm text-muted-foreground border-dashed">
                {isAm ? 'ዝርዝር ለማየት ኬሚካል ይምረጡ' : 'Select a chemical to view full safety details'}
              </Card>
            ) : (
              <Card className="p-6 space-y-4 sticky top-20">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selected.name}</h2>
                    <p className="text-sm font-mono text-muted-foreground">{selected.formula}</p>
                    {selected.aliases.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">aka: {selected.aliases.join(', ')}</p>
                    )}
                  </div>
                  <Badge className={riskColor(selected.riskLevel)}>Risk {selected.riskLevel}/5</Badge>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5 mb-2"><AlertTriangle className="h-3.5 w-3.5" />Hazards</h3>
                  <ul className="text-sm space-y-1">
                    {selected.hazards.map((h, i) => <li key={i} className="flex gap-2"><span className="text-destructive">•</span>{h}</li>)}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5 mb-2"><Shield className="h-3.5 w-3.5" />First Aid</h3>
                  <div className="text-sm space-y-2">
                    <p className="flex gap-2"><Droplet className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span><strong className="text-xs">Skin:</strong> {selected.firstAid.skin}</span></p>
                    <p className="flex gap-2"><Eye className="h-3.5 w-3.5 text-cyan-500 mt-0.5 flex-shrink-0" /><span><strong className="text-xs">Eyes:</strong> {selected.firstAid.eyes}</span></p>
                    <p className="flex gap-2"><Wind className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" /><span><strong className="text-xs">Inhalation:</strong> {selected.firstAid.inhalation}</span></p>
                    <p className="flex gap-2"><Beaker className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" /><span><strong className="text-xs">Ingestion:</strong> {selected.firstAid.ingestion}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-bold mb-2">Storage</h3>
                  <p className="text-sm">{selected.storage}</p>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-bold mb-2">Required PPE</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.ppe.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-destructive font-bold mb-2">Never mix with</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.incompatibleWith.map((p) => <Badge key={p} variant="destructive" className="text-xs">{p}</Badge>)}
                  </div>
                </div>

                {selected.safeAlternatives && selected.safeAlternatives.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-emerald-600 font-bold mb-2">Safer Alternatives</h3>
                    <ul className="text-sm space-y-1">
                      {selected.safeAlternatives.map((a, i) => <li key={i}>✓ {a}</li>)}
                    </ul>
                  </div>
                )}

                <Button onClick={askForAlternative} variant="outline" size="sm" className="w-full" disabled={loading}>
                  {loading ? 'Asking AI…' : 'Suggest a safer alternative (AI)'}
                </Button>

                {reply && <AiResultCard loading={false} reply={reply} />}
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChemicalDatabasePage;
