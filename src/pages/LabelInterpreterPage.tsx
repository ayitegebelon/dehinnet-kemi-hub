import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScanLine } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import AiResultCard from '@/components/safety/AiResultCard';

const LabelInterpreterPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [labelText, setLabelText] = useState('');
  const { loading, reply, ask } = useAiSafety();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የመለያ ማብራሪያ' : 'Chemical Label Interpreter'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'በመለያ ላይ ያለ ጽሑፍ፣ ምልክት ወይም ኮድ ይፍቱ' : 'Decode warning text, GHS symbols, hazard codes'}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6 space-y-4">
          <div>
            <Label>{isAm ? 'በመለያው ላይ ያለውን ይፃፉ' : 'Type what is on the label'}</Label>
            <Textarea
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              placeholder='e.g., "HCl 37% — H314, GHS05, Causes severe skin burns and eye damage."'
              rows={5}
              maxLength={1000}
            />
          </div>
          <Button onClick={() => ask('label', { labelText: labelText.trim() })} disabled={loading || !labelText.trim()} className="w-full">
            {loading ? (isAm ? 'በመተርጎም ላይ…' : 'Interpreting…') : (isAm ? 'መለያውን ተርጉም' : 'Interpret label')}
          </Button>
        </Card>

        <AiResultCard loading={loading} reply={reply} />
      </div>
    </Layout>
  );
};

export default LabelInterpreterPage;
