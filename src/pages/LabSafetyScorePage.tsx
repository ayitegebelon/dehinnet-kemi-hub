import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Gauge, X, Plus } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import AiResultCard from '@/components/safety/AiResultCard';

const PPE_OPTIONS = ['Gloves', 'Goggles', 'Lab coat', 'Face shield', 'Apron', 'Respirator', 'Closed shoes', 'Fume hood'];

const LabSafetyScorePage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [inv, setInv] = useState<string[]>(['']);
  const [vent, setVent] = useState('poor');
  const [ppe, setPpe] = useState<string[]>([]);
  const [storage, setStorage] = useState('');
  const { loading, reply, ask } = useAiSafety();

  const togglePpe = (item: string) => {
    setPpe((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የላብ ደህንነት ነጥብ' : 'Lab Safety Score'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'የእርስዎ ላብ ምን ያህል ደህንነቱ የተጠበቀ ነው?' : 'How safe is your lab? Get an honest score and improvements.'}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6 space-y-5">
          <div>
            <Label className="mb-2 block">{isAm ? 'በእጅ ያሉ ኬሚካሎች' : 'Chemicals on hand'}</Label>
            {inv.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input value={c} onChange={(e) => { const n = [...inv]; n[i] = e.target.value; setInv(n); }} placeholder="e.g., HCl" maxLength={80} />
                {inv.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setInv(inv.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {inv.length < 15 && (
              <Button variant="outline" size="sm" onClick={() => setInv([...inv, ''])}>
                <Plus className="h-4 w-4 mr-1" /> {isAm ? 'ጨምር' : 'Add chemical'}
              </Button>
            )}
          </div>

          <div>
            <Label>{isAm ? 'አየር ማስወጫ' : 'Ventilation'}</Label>
            <Select value={vent} onValueChange={setVent}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="excellent">Excellent (fume hood)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">{isAm ? 'የሚገኝ የግል መከላከያ መሣሪያ' : 'Available PPE'}</Label>
            <div className="grid grid-cols-2 gap-2">
              {PPE_OPTIONS.map((item) => (
                <label key={item} className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50">
                  <Checkbox checked={ppe.includes(item)} onCheckedChange={() => togglePpe(item)} />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>{isAm ? 'የማከማቻ ሁኔታ' : 'Storage description'}</Label>
            <Textarea value={storage} onChange={(e) => setStorage(e.target.value)} rows={3} maxLength={500} placeholder="e.g., Acids and bases on same shelf, no separate cabinet" />
          </div>

          <Button
            onClick={() => ask('lab_score', { inventory: inv.filter((x) => x.trim()), ventilation: vent, ppe, storage: storage.trim() })}
            disabled={loading}
            className="w-full"
          >
            {loading ? (isAm ? 'በመገምገም ላይ…' : 'Scoring…') : (isAm ? 'ላቤን ግምግም' : 'Score my lab')}
          </Button>
        </Card>

        <AiResultCard loading={loading} reply={reply} />
      </div>
    </Layout>
  );
};

export default LabSafetyScorePage;
