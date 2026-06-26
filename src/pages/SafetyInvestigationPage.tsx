import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles, FlaskConical, ShieldAlert, Wind, ShieldCheck, Brain, FileText,
  Loader2, History, Search, Download, Beaker, Zap, AlertTriangle, CheckCircle2, Play,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

type AgentKey = 'research' | 'risk' | 'environment' | 'safety' | 'memory' | 'report';
type AgentStatus = 'idle' | 'running' | 'done';

interface AgentState { key: AgentKey; label: string; icon: any; status: AgentStatus; note?: string; }

interface ReportShape {
  research: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  environmental_impact: string;
  safety_guidelines: string[];
  memory_insights: string;
  final_verdict: string;
  emergency_actions: string[];
  summary: string;
}

interface MemoryRow {
  id: string; chemical_name: string; risk_level: string | null;
  ai_summary: string | null; created_at: string;
}

const DEMO_CHEMICALS = ['Sulfuric Acid', 'Ammonia', 'Sodium Hypochlorite'];

const initialAgents = (): AgentState[] => [
  { key: 'research', label: 'Research Agent', icon: FlaskConical, status: 'idle' },
  { key: 'risk', label: 'Risk Agent', icon: ShieldAlert, status: 'idle' },
  { key: 'environment', label: 'Environment Agent', icon: Wind, status: 'idle' },
  { key: 'safety', label: 'Safety Agent', icon: ShieldCheck, status: 'idle' },
  { key: 'memory', label: 'Memory Agent', icon: Brain, status: 'idle' },
  { key: 'report', label: 'Report Agent', icon: FileText, status: 'idle' },
];

const riskColor = (lvl?: string) => {
  switch ((lvl || '').toUpperCase()) {
    case 'CRITICAL': return 'bg-red-600 text-white border-red-700';
    case 'HIGH': return 'bg-orange-500 text-white border-orange-600';
    case 'MEDIUM': return 'bg-yellow-500 text-black border-yellow-600';
    case 'LOW': return 'bg-emerald-500 text-white border-emerald-600';
    default: return 'bg-muted text-muted-foreground';
  }
};

const verdictColor = (v?: string) => {
  const x = (v || '').toUpperCase();
  if (x.includes('CRITICAL') || x.includes('DANGEROUS')) return 'from-red-600 to-rose-700';
  if (x.includes('WARNING')) return 'from-orange-500 to-amber-600';
  if (x.includes('CLEAR')) return 'from-emerald-500 to-green-600';
  return 'from-slate-600 to-slate-700';
};

const SafetyInvestigationPage: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [agents, setAgents] = useState<AgentState[]>(initialAgents());
  const [report, setReport] = useState<ReportShape | null>(null);
  const [running, setRunning] = useState(false);
  const [memory, setMemory] = useState<MemoryRow[]>([]);
  const [memSearch, setMemSearch] = useState('');
  const [memoryStatus, setMemoryStatus] = useState<'NEW' | 'HISTORY'>('NEW');

  const loadMemory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('chemical_memory')
      .select('id, chemical_name, risk_level, ai_summary, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setMemory((data as MemoryRow[]) || []);
  };

  useEffect(() => { loadMemory(); }, [user?.id]);

  const filteredMemory = useMemo(() => {
    const q = memSearch.trim().toLowerCase();
    if (!q) return memory;
    return memory.filter((m) => m.chemical_name.toLowerCase().includes(q));
  }, [memory, memSearch]);

  const patternInsight = useMemo(() => {
    if (!memory.length) return 'No analyses yet. Start your first investigation.';
    const highs = memory.filter((m) => ['HIGH', 'CRITICAL'].includes((m.risk_level || '').toUpperCase())).length;
    const counts = memory.reduce<Record<string, number>>((acc, m) => {
      const k = m.chemical_name.toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const repeats = Object.values(counts).filter((n) => n > 1).length;
    if (highs >= 3) return `Recurring exposure to ${highs} high-risk substances. Recommend ventilation & PPE focus.`;
    if (repeats >= 1) return `${repeats} chemical(s) analyzed multiple times. Pattern memory active.`;
    return `${memory.length} chemical(s) on record.`;
  }, [memory]);

  const updateAgent = (key: AgentKey, status: AgentStatus, note?: string) =>
    setAgents((prev) => prev.map((a) => (a.key === key ? { ...a, status, note } : a)));

  const animateAgent = async (key: AgentKey, note?: string, ms = 500) => {
    updateAgent(key, 'running');
    await new Promise((r) => setTimeout(r, ms));
    updateAgent(key, 'done', note);
  };

  const runInvestigation = async (chemicalArg?: string) => {
    const chemical = (chemicalArg ?? input).trim();
    if (!chemical) { toast.error('Enter a chemical first'); return; }
    if (!user) { toast.error('Please sign in'); return; }

    setRunning(true);
    setReport(null);
    setAgents(initialAgents());

    // Memory lookup first
    updateAgent('memory', 'running');
    const { data: prev } = await supabase
      .from('chemical_memory')
      .select('chemical_name, risk_level, ai_summary, created_at')
      .eq('user_id', user.id)
      .ilike('chemical_name', chemical)
      .order('created_at', { ascending: false })
      .limit(5);
    const past = prev || [];
    setMemoryStatus(past.length ? 'HISTORY' : 'NEW');
    updateAgent('memory', 'done', past.length ? `Found ${past.length} past record(s)` : 'No prior records');

    // Visual cascade
    await animateAgent('research', 'Properties identified', 600);
    await animateAgent('risk', 'Hazards classified', 500);
    await animateAgent('environment', 'Env impact analyzed', 500);
    await animateAgent('safety', 'PPE & protocols ready', 500);
    updateAgent('report', 'running', 'Synthesizing final report…');

    try {
      const { data, error } = await supabase.functions.invoke('qwen-investigation', {
        body: { chemical, memory: past },
      });
      if (error) throw error;
      const rep = (data as any)?.report as ReportShape;
      if (!rep) throw new Error('Empty report from AI');
      setReport(rep);
      updateAgent('report', 'done', 'Report complete');

      // Persist to memory
      await supabase.from('chemical_memory').insert({
        user_id: user.id,
        chemical_name: chemical,
        analysis_result: JSON.stringify(rep),
        risk_level: rep.risk_level,
        safety_notes: (rep.safety_guidelines || []).join(' | '),
        ai_summary: rep.summary,
      });
      await loadMemory();
      toast.success('Investigation complete');
    } catch (e: any) {
      toast.error(e?.message || 'AI call failed');
      updateAgent('report', 'idle');
    } finally {
      setRunning(false);
    }
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const M = 14; let y = 18;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text('Dehinnet Kemi AI — Safety Report', M, y); y += 8;
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text(`Chemical: ${input}`, M, y); y += 6;
    doc.text(`Risk Level: ${report.risk_level}`, M, y); y += 6;
    doc.text(`Verdict: ${report.final_verdict}`, M, y); y += 8;
    const section = (title: string, body: string | string[]) => {
      doc.setFont('helvetica', 'bold'); doc.text(title, M, y); y += 6;
      doc.setFont('helvetica', 'normal');
      const text = Array.isArray(body) ? body.map((b) => `• ${b}`).join('\n') : body;
      const lines = doc.splitTextToSize(text || '-', 180);
      lines.forEach((l: string) => { if (y > 280) { doc.addPage(); y = 18; } doc.text(l, M, y); y += 5; });
      y += 4;
    };
    section('Summary', report.summary);
    section('Research', report.research);
    section('Environmental Impact', report.environmental_impact);
    section('Safety Guidelines', report.safety_guidelines);
    section('Emergency Actions', report.emergency_actions);
    section('Memory Insights', report.memory_insights);
    doc.save(`safety-report-${input.replace(/\s+/g, '-')}.pdf`);
  };

  const runDemo = async () => {
    for (const c of DEMO_CHEMICALS) {
      setInput(c);
      await runInvestigation(c);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" /> Chemical Safety Intelligence
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Autonomous multi-agent chemical safety system with persistent memory · powered by Qwen Cloud
            </p>
          </div>
          <Button variant="outline" onClick={runDemo} disabled={running}>
            <Play className="h-4 w-4 mr-2" /> Judge Demo Mode
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* CENTER — main work area */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-4 bg-gradient-to-br from-card to-card/60 border-primary/20">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. Sulfuric acid + water"
                  className="flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter' && !running) runInvestigation(); }}
                />
                <Button onClick={() => runInvestigation()} disabled={running} variant="secondary">
                  <Beaker className="h-4 w-4 mr-2" /> Analyze
                </Button>
                <Button onClick={() => runInvestigation()} disabled={running} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                  Run Full Safety Investigation
                </Button>
              </div>

              {/* Quick insight cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <InsightCard label="Risk Level" value={report?.risk_level ?? '—'} accent={riskColor(report?.risk_level)} />
                <InsightCard label="Environment" value={report ? 'Analyzed' : '—'} />
                <InsightCard label="Safety Score" value={report ? safetyScore(report.risk_level) : '—'} />
                <InsightCard label="Memory" value={memoryStatus === 'HISTORY' ? 'HISTORY' : 'NEW'} />
              </div>
            </Card>

            {/* Live agent feed */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2"><Brain className="h-4 w-4" /> Agent Execution</h2>
                {running && <Badge variant="secondary" className="animate-pulse">Live</Badge>}
              </div>
              <div className="space-y-2">
                {agents.map((a) => (
                  <div key={a.key} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                    a.status === 'running' ? 'border-primary/40 bg-primary/5 shadow-[0_0_15px_rgba(99,102,241,0.15)]' :
                    a.status === 'done' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-card/40'
                  }`}>
                    <a.icon className={`h-4 w-4 ${a.status === 'running' ? 'text-primary animate-pulse' : a.status === 'done' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium flex-1">{a.label}</span>
                    {a.note && <span className="text-xs text-muted-foreground hidden md:inline">{a.note}</span>}
                    {a.status === 'running' ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> :
                      a.status === 'done' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> :
                      <div className="h-2 w-2 rounded-full bg-muted" />}
                  </div>
                ))}
              </div>
            </Card>

            {/* Empty state */}
            {!report && !running && (
              <Card className="p-6 text-center border-dashed">
                <Sparkles className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Start a chemical safety investigation</p>
                <p className="text-xs text-muted-foreground mb-3">Using AI agents + persistent memory</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {DEMO_CHEMICALS.map((c) => (
                    <Button key={c} size="sm" variant="outline" onClick={() => { setInput(c); runInvestigation(c); }}>
                      Try {c}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Report */}
            
              {report && (
                <div>
                  <Card className="p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h2 className="text-lg font-bold flex items-center gap-2"><FileText className="h-5 w-5" /> Chemical Safety Report</h2>
                      <div className="flex items-center gap-2">
                        <Badge className={`${riskColor(report.risk_level)} text-sm px-3 py-1`}>Risk: {report.risk_level}</Badge>
                        <Button size="sm" variant="outline" onClick={exportPDF}>
                          <Download className="h-3.5 w-3.5 mr-1.5" /> Export PDF
                        </Button>
                      </div>
                    </div>

                    <ReportSection title="🔬 Research Summary" body={report.research} />
                    <ReportSection title="🌍 Environmental Impact" body={report.environmental_impact} />
                    <ReportSection title="🛡️ Safety Guidelines" list={report.safety_guidelines} />
                    <ReportSection title="🚨 Emergency Actions" list={report.emergency_actions} accent />
                    <ReportSection title="🧠 Memory Insights" body={report.memory_insights} />

                    <div className={`rounded-xl p-5 bg-gradient-to-r ${verdictColor(report.final_verdict)} text-white shadow-lg`}>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6" />
                        <div>
                          <p className="text-xs uppercase tracking-widest opacity-80">Final Verdict</p>
                          <p className="text-xl font-bold">{report.final_verdict}</p>
                        </div>
                      </div>
                      <Separator className="my-3 bg-white/20" />
                      <p className="text-sm opacity-95">{report.summary}</p>
                    </div>
                  </Card>
                </div>
              )}
            
          </div>

          {/* RIGHT — memory panel */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><History className="h-4 w-4" /> Memory Insights</h3>
              <div className="rounded-lg border bg-muted/30 p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-1">Pattern</p>
                <p className="text-sm">{patternInsight}</p>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={memSearch} onChange={(e) => setMemSearch(e.target.value)} placeholder="Search past chemicals…" className="pl-8 h-8 text-xs" />
              </div>
              <ScrollArea className="h-[360px] pr-2">
                <div className="space-y-1.5">
                  {filteredMemory.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">No memory yet</p>
                  )}
                  {filteredMemory.map((m) => (
                    <button key={m.id} onClick={() => { setInput(m.chemical_name); runInvestigation(m.chemical_name); }}
                      className="w-full text-left p-2.5 rounded-lg border bg-card/40 hover:bg-card transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{m.chemical_name}</span>
                        <Badge className={`${riskColor(m.risk_level || '')} text-[10px] px-1.5 py-0`}>{m.risk_level || '—'}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{m.ai_summary || 'No summary'}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InsightCard: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent }) => (
  <div className={`rounded-lg border p-3 ${accent || 'bg-muted/30'}`}>
    <p className="text-[10px] uppercase tracking-widest opacity-80">{label}</p>
    <p className="text-sm font-bold mt-0.5 truncate">{value}</p>
  </div>
);

const ReportSection: React.FC<{ title: string; body?: string; list?: string[]; accent?: boolean }> = ({ title, body, list, accent }) => (
  <div className={`rounded-lg p-3 border ${accent ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-muted/20'}`}>
    <p className="text-xs font-semibold mb-1.5">{title}</p>
    {body && <p className="text-sm whitespace-pre-wrap">{body}</p>}
    {list && (
      <ul className="text-sm space-y-1 list-disc pl-5">
        {list.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    )}
  </div>
);

const safetyScore = (risk: string) => {
  switch (risk) { case 'LOW': return '90/100'; case 'MEDIUM': return '65/100'; case 'HIGH': return '35/100'; case 'CRITICAL': return '10/100'; default: return '—'; }
};

export default SafetyInvestigationPage;
