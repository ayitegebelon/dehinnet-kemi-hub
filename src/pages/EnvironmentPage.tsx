import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wind, Thermometer, Home } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import AiResultCard from '@/components/safety/AiResultCard';

const EnvironmentPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [chemical, setChemical] = useState('');
  const [room, setRoom] = useState('medium');
  const [ventilation, setVentilation] = useState('poor');
  const [temp, setTemp] = useState([22]);
  const { loading, reply, ask } = useAiSafety();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Wind className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የአካባቢ ደህንነት' : 'Environment-Aware Safety'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'በክፍል ሁኔታ መሠረት የአደጋ ደረጃ ያስሉ' : 'Risk adjusted for your room conditions'}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6 space-y-5">
          <div>
            <Label>{isAm ? 'ኬሚካል' : 'Chemical'}</Label>
            <Input value={chemical} onChange={(e) => setChemical(e.target.value)} placeholder="e.g., Bleach" maxLength={80} />
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" />{isAm ? 'የክፍል መጠን' : 'Room size'}</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{isAm ? 'ትንሽ (<10m²)' : 'Small (<10m²)'}</SelectItem>
                <SelectItem value="medium">{isAm ? 'መካከለኛ (10-30m²)' : 'Medium (10-30m²)'}</SelectItem>
                <SelectItem value="large">{isAm ? 'ትልቅ (>30m²)' : 'Large (>30m²)'}</SelectItem>
                <SelectItem value="outdoor">{isAm ? 'ከቤት ውጭ' : 'Outdoor'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Wind className="h-3.5 w-3.5" />{isAm ? 'አየር ማስወጫ' : 'Ventilation'}</Label>
            <Select value={ventilation} onValueChange={setVentilation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{isAm ? 'የለም (የተዘጋ)' : 'None (sealed)'}</SelectItem>
                <SelectItem value="poor">{isAm ? 'ደካማ (አንድ መስኮት)' : 'Poor (one window)'}</SelectItem>
                <SelectItem value="good">{isAm ? 'ጥሩ (በርካታ መስኮቶች)' : 'Good (multiple windows / fan)'}</SelectItem>
                <SelectItem value="excellent">{isAm ? 'በጣም ጥሩ (ፉም ሁድ)' : 'Excellent (fume hood)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5" />{isAm ? 'ሙቀት' : 'Temperature'}: {temp[0]}°C</Label>
            <Slider value={temp} onValueChange={setTemp} min={0} max={45} step={1} className="mt-3" />
          </div>
          <Button
            onClick={() => ask('environment', { chemical: chemical.trim(), roomSize: room, ventilation, temperature: temp[0] })}
            disabled={loading || !chemical.trim()}
            className="w-full"
          >
            {loading ? (isAm ? 'በመተንተን ላይ…' : 'Analysing…') : (isAm ? 'ደህንነት አስላ' : 'Assess safety')}
          </Button>
        </Card>

        <AiResultCard loading={loading} reply={reply} />
      </div>
    </Layout>
  );
};

export default EnvironmentPage;
