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

export interface AiSafetyResult {
  reply: string;
  structured: Record<string, unknown> | null;
}

const HISTORY_MODES: AiMode[] = ['what_if', 'human_impact', 'risk_engine'];

export function useAiSafety() {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [structured, setStructured] = useState<Record<string, unknown> | null>(null);
  const { language } = useLanguage();

  const ask = useCallback(
    async (mode: AiMode, payload: Record<string, unknown>): Promise<AiSafetyResult | null> => {
      setLoading(true);
      setReply(null);
      setStructured(null);
      try {
        const { data, error } = await supabase.functions.invoke('chemistry-safety-ai', {
          body: { mode, payload, language },
        });
        if (error) throw error;
        if (!data?.reply) throw new Error('No response');

        const result: AiSafetyResult = {
          reply: data.reply as string,
          structured: (data.structured as Record<string, unknown> | null) ?? null,
        };
        setReply(result.reply);
        setStructured(result.structured);

        if (HISTORY_MODES.includes(mode)) {
          const { data: auth } = await supabase.auth.getUser();
          const uid = auth?.user?.id;
          if (uid) {
            const danger =
              (result.structured?.dangerLevel as string | undefined) ||
              (result.reply.match(/\b(EXTREME|HIGH|MODERATE|LOW|SAFE)\b/)?.[1] ?? null);
            const summary =
              (result.structured?.summary as string | undefined) ||
              (result.structured?.bodyEffect as string | undefined) ||
              result.reply.slice(0, 240);
            await supabase.from('safety_analyses').insert([{
              user_id: uid,
              analysis_type: mode,
              inputs: payload as never,
              summary,
              danger_level: danger,
              structured: (result.structured ?? null) as never,
              raw_reply: result.reply,
            }]);
          }
        }

        return result;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to analyse. Please try again.';
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  const reset = () => {
    setReply(null);
    setStructured(null);
  };

  return { loading, reply, structured, ask, reset };
}
