import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Timer,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Bell,
  Clock,
  Beaker,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface LabTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isComplete: boolean;
  notes: string;
  color: string;
}

const COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-violet-500',
];

const PRESETS = [
  { label: 'Quick Heat', labelAm: 'ፈጣን ማሞቂያ', seconds: 120 },
  { label: 'Reaction Wait', labelAm: 'የምላሽ ጊዜ', seconds: 300 },
  { label: 'Cooling Period', labelAm: 'ማቀዝቀዣ ጊዜ', seconds: 600 },
  { label: 'Distillation', labelAm: 'ማፍላት', seconds: 1800 },
  { label: 'Crystallization', labelAm: 'ክሪስታላይዜሽን', seconds: 3600 },
  { label: 'Drying', labelAm: 'ማድረቂያ', seconds: 7200 },
];

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const LabTimerPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const getText = (en: string, am: string) => isAm ? am : en;

  const [timers, setTimers] = useState<LabTimer[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newMinutes, setNewMinutes] = useState('5');
  const [newSeconds, setNewSeconds] = useState('0');
  const [completedLog, setCompletedLog] = useState<{ label: string; time: string; notes: string }[]>([]);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Tick running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(t => {
        if (!t.isRunning || t.isComplete) return t;
        const next = t.remainingSeconds - 1;
        if (next <= 0) {
          toast.success(`${t.label} ${getText('timer complete!', 'ሰዓት ቆጣሪ ተጠናቀቀ!')}`, { duration: 10000 });
          // Try to play audio alert
          try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHjmJw+LfpmE3FUB20NvKdDokM3jG4ti/cjMWNn/N5ODAbjIWMnfE3tiyYzYlQYXO4teqVywjQ4TP4+K2WiYXN3K+2c5xKxgsc8Pn5cV5JA==').play(); } catch {}
          return { ...t, remainingSeconds: 0, isRunning: false, isComplete: true };
        }
        return { ...t, remainingSeconds: next };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTimer = (label: string, totalSeconds: number) => {
    const timer: LabTimer = {
      id: crypto.randomUUID(),
      label: label || getText('Timer', 'ሰዓት ቆጣሪ'),
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: false,
      isComplete: false,
      notes: '',
      color: COLORS[timers.length % COLORS.length],
    };
    setTimers(prev => [...prev, timer]);
  };

  const addCustomTimer = () => {
    const mins = parseInt(newMinutes) || 0;
    const secs = parseInt(newSeconds) || 0;
    const total = mins * 60 + secs;
    if (total <= 0) { toast.error(getText('Set a time greater than 0', 'ከ0 በላይ ጊዜ ያስገቡ')); return; }
    addTimer(newLabel, total);
    setNewLabel('');
    setNewMinutes('5');
    setNewSeconds('0');
  };

  const toggleTimer = (id: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, isRunning: !t.isRunning } : t));
  };

  const resetTimer = (id: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false, isComplete: false } : t));
  };

  const removeTimer = (id: string) => {
    const t = timers.find(t => t.id === id);
    if (t?.isComplete) {
      setCompletedLog(prev => [...prev, { label: t.label, time: new Date().toLocaleTimeString(), notes: t.notes }]);
    }
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const updateNotes = (id: string, notes: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, notes } : t));
  };

  const runningCount = timers.filter(t => t.isRunning).length;
  const completedCount = timers.filter(t => t.isComplete).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 via-primary to-accent flex items-center justify-center animate-float">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {getText('Lab Timer & Tracker', 'ላብ ሰዓት ቆጣሪ')}
            </h1>
            <p className="text-muted-foreground">
              {getText('Track multiple experiment timers with notes', 'ብዙ የሙከራ ሰዓቶችን ከማስታወሻ ጋር ይከታተሉ')}
            </p>
          </div>
          {runningCount > 0 && (
            <Badge className="ml-auto animate-pulse gap-1">
              <Clock className="w-3 h-3" /> {runningCount} {getText('running', 'በሂደት ላይ')}
            </Badge>
          )}
        </div>

        {/* Quick Presets */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-primary" />
            {getText('Quick Presets', 'ፈጣን ቅድመ-ዝግጅቶች')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => addTimer(isAm ? p.labelAm : p.label, p.seconds)} className="gap-1">
                <Plus className="w-3 h-3" />
                {isAm ? p.labelAm : p.label} ({formatTime(p.seconds)})
              </Button>
            ))}
          </div>
        </Card>

        {/* Custom Timer Creator */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-sm mb-3">{getText('Custom Timer', 'ብጁ ሰዓት ቆጣሪ')}</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-muted-foreground">{getText('Label', 'ስያሜ')}</label>
              <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={getText('e.g. Heating step', 'ለምሳሌ ማሞቂያ')} />
            </div>
            <div className="w-20">
              <label className="text-xs text-muted-foreground">{getText('Minutes', 'ደቂቃ')}</label>
              <Input type="number" min="0" value={newMinutes} onChange={e => setNewMinutes(e.target.value)} />
            </div>
            <div className="w-20">
              <label className="text-xs text-muted-foreground">{getText('Seconds', 'ሰከንድ')}</label>
              <Input type="number" min="0" max="59" value={newSeconds} onChange={e => setNewSeconds(e.target.value)} />
            </div>
            <Button onClick={addCustomTimer} className="gap-1">
              <Plus className="w-4 h-4" /> {getText('Add', 'ጨምር')}
            </Button>
          </div>
        </Card>

        {/* Active Timers */}
        {timers.length === 0 ? (
          <Card className="p-12 text-center">
            <Timer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{getText('No timers yet', 'ገና ሰዓት ቆጣሪ የለም')}</h3>
            <p className="text-muted-foreground text-sm">{getText('Add a preset or custom timer to get started', 'ለመጀመር ቅድመ-ዝግጅት ወይም ብጁ ሰዓት ቆጣሪ ያስገቡ')}</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {timers.map(timer => {
              const pct = timer.totalSeconds > 0 ? ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100 : 0;
              return (
                <Card key={timer.id} className={`p-4 transition-all ${timer.isComplete ? 'ring-2 ring-green-500 bg-green-500/5' : timer.isRunning ? 'ring-2 ring-primary/50' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${timer.color} ${timer.isRunning ? 'animate-pulse' : ''}`} />
                      <h4 className="font-semibold">{timer.label}</h4>
                    </div>
                    <div className="flex gap-1">
                      {!timer.isComplete && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleTimer(timer.id)}>
                            {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => resetTimer(timer.id)}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeTimer(timer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <span className={`text-4xl font-mono font-bold ${timer.isComplete ? 'text-green-500' : timer.remainingSeconds <= 10 && timer.isRunning ? 'text-red-500 animate-pulse' : ''}`}>
                      {formatTime(timer.remainingSeconds)}
                    </span>
                    {timer.isComplete && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-green-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">{getText('Complete!', 'ተጠናቀቀ!')}</span>
                      </div>
                    )}
                  </div>

                  <Progress value={pct} className="h-2 mb-3" />

                  <Textarea
                    placeholder={getText('Add notes for this step...', 'ለዚህ ደረጃ ማስታወሻ ያስገቡ...')}
                    value={timer.notes}
                    onChange={e => updateNotes(timer.id, e.target.value)}
                    className="text-sm min-h-[60px] resize-none"
                  />
                </Card>
              );
            })}
          </div>
        )}

        {/* Completed Log */}
        {completedLog.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {getText('Completed Log', 'የተጠናቀቀ ዝርዝር')}
            </h3>
            <div className="space-y-2">
              {completedLog.map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-2 bg-muted/50 rounded-lg">
                  <Badge variant="outline">{log.time}</Badge>
                  <span className="font-medium">{log.label}</span>
                  {log.notes && <span className="text-muted-foreground truncate">— {log.notes}</span>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default LabTimerPage;
