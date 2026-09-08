import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Wand2 } from 'lucide-react';
import { useAiSafety } from '@/hooks/useAiSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import AiResultCard from '@/components/safety/AiResultCard';

const SimplifyPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [text, setText] = useState('');
  const { loading, reply, ask } = useAiSafety();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'በቀላል ቋንቋ ግለጽ' : 'Explain Like I\'m Not a Chemist'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'ውስብስብ የኬሚስትሪ ቃላትን ቀላል ያድርጉ' : 'Turn complex chemistry into plain words'}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6 space-y-4">
          <div>
            <Label>{isAm ? 'ለመቅለል የሚፈልጉት ጽሑፍ' : 'Text to simplify'}</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='e.g., "Corrosive oxidizing agent — releases hypochlorous acid in aqueous solution."'
              rows={5}
              maxLength={1000}
            />
          </div>
          <Button onClick={() => ask('simplify', { text: text.trim() })} disabled={loading || !text.trim()} className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            {loading ? (isAm ? 'በመቀየር ላይ…' : 'Simplifying…') : (isAm ? 'አቅልል' : 'Simplify')}
          </Button>
        </Card>

        <AiResultCard loading={loading} reply={reply} />
      </div>
    </Layout>
  );
};

export default SimplifyPage;
