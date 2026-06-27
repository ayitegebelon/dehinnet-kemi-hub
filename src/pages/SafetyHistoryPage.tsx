import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Row {
  id: string;
  analysis_type: string;
  inputs: Record<string, unknown> | null;
  summary: string | null;
  danger_level: string | null;
  created_at: string;
}

const dangerColor = (d?: string | null) => {
  switch ((d || '').toUpperCase()) {
    case 'EXTREME': return 'bg-red-700 text-white';
    case 'HIGH': return 'bg-red-500 text-white';
    case 'MODERATE': return 'bg-orange-500 text-white';
    case 'LOW': return 'bg-yellow-400 text-black';
    case 'SAFE': return 'bg-emerald-500 text-white';
    default: return 'bg-muted text-foreground';
  }
};

const typeLabel: Record<string, string> = {
  what_if: 'Mixing prediction',
  human_impact: 'Body impact',
  risk_engine: 'Risk assessment',
};

const SafetyHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('safety_analyses')
      .select('id,analysis_type,inputs,summary,danger_level,created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows((data || []) as unknown as Row[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from('safety_analyses').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const highCount = rows.filter((r) => ['HIGH', 'EXTREME'].includes((r.danger_level || '').toUpperCase())).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የእኔ የደህንነት ምርመራዎች' : 'My Safety Analyses'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'ያለፉት ሁሉም ምርመራዎች' : 'Every mixing, body-impact and risk analysis you have run'}
            </p>
          </div>
        </div>

        {highCount > 0 && (
          <Card className="p-4 mb-4 border-destructive bg-destructive/10 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm">
              {isAm
                ? `${highCount} ጊዜ የከፍተኛ አደጋ ምርመራ አሳይተዋል። እባክዎ ስራዎችዎን ይከልሱ።`
                : `You have ${highCount} high-risk analyses on record. Review your repeated risks.`}
            </p>
          </Card>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">{isAm ? 'በመጫን ላይ…' : 'Loading…'}</p>
        ) : rows.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground text-sm">
            {isAm ? 'ገና ምንም ምርመራ የለም።' : 'No analyses yet. Run a What-If, Human Impact, or Risk assessment.'}
          </Card>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">{typeLabel[r.analysis_type] || r.analysis_type}</Badge>
                      {r.danger_level && (
                        <Badge className={dangerColor(r.danger_level)}>{r.danger_level}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {r.inputs?.chemical
                        ? String(r.inputs.chemical)
                        : Array.isArray(r.inputs?.chemicals)
                        ? (r.inputs!.chemicals as string[]).join(' + ')
                        : ''}
                    </p>
                    {r.summary && <p className="text-sm leading-relaxed">{r.summary}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SafetyHistoryPage;
