import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

interface Props {
  loading: boolean;
  reply: string | null;
  emptyText?: string;
}

const AiResultCard: React.FC<Props> = ({ loading, reply, emptyText }) => {
  if (loading) {
    return (
      <Card className="p-6 flex items-center gap-3 border-primary/30 bg-primary/5">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Analysing safely…</span>
      </Card>
    );
  }
  if (!reply) {
    return (
      <Card className="p-6 border-dashed text-center text-sm text-muted-foreground">
        {emptyText || 'Submit details above to get a safety analysis.'}
      </Card>
    );
  }

  // Highlight section headings (lines ending with colon, ALL-CAPS-ish)
  const lines = reply.split('\n');
  return (
    <Card className="p-6 border-primary/30 bg-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Safety Analysis</h3>
      </div>
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-2" />;
          const isHeading = /^[A-Z][A-Z 0-9()/-]+:$/.test(trimmed);
          const isDanger = /EXTREME|HIGH|DANGEROUS|DO NOT|CRITICAL|EMERGENCY/i.test(trimmed);
          const isSafe = /SAFE|EXCELLENT|GOOD/i.test(trimmed);
          if (isHeading) {
            return (
              <p
                key={i}
                className={`font-bold uppercase text-xs tracking-wider mt-3 ${
                  isDanger ? 'text-destructive' : isSafe ? 'text-emerald-500' : 'text-primary'
                }`}
              >
                {trimmed}
              </p>
            );
          }
          if (isDanger && trimmed.length < 60) {
            return (
              <p key={i} className="text-destructive font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                {trimmed}
              </p>
            );
          }
          return (
            <p key={i} className="text-foreground/90 whitespace-pre-wrap">
              {trimmed}
            </p>
          );
        })}
      </div>
    </Card>
  );
};

export default AiResultCard;
