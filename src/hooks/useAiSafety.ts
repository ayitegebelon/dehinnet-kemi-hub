import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export type AiMode =
  | 'what_if'
  | 'human_impact'
  | 'simplify'
  | 'environment'
  | 'label'
  | 'risk_engine'
  | 'emergency'
  | 'lab_score'
  | 'alternative';

export function useAiSafety() {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const { language } = useLanguage();

  const ask = useCallback(
    async (mode: AiMode, payload: Record<string, unknown>) => {
      setLoading(true);
      setReply(null);
      try {
        const { data, error } = await supabase.functions.invoke('chemistry-safety-ai', {
          body: { mode, payload, language },
        });
        if (error) throw error;
        if (!data?.reply) throw new Error('No response');
        setReply(data.reply as string);
        return data.reply as string;
      } catch (err: any) {
        const msg = err?.message || 'Failed to analyse. Please try again.';
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  const reset = () => setReply(null);

  return { loading, reply, ask, reset };
}
