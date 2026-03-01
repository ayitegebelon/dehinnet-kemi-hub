import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  BookOpen, Plus, Calendar, FlaskConical, Trash2, Edit, Clock,
  CheckCircle, AlertTriangle, Search
} from 'lucide-react';

interface LabEntry {
  id: string;
  user_id: string;
  title: string;
  experiment_date: string;
  hypothesis: string;
  materials: string;
  procedure: string;
  observations: string;
  conclusion: string;
  safety_notes: string;
  status: string;
  created_at: string;
}

const LabNotebookPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isAm = language === 'am';
  const [entries, setEntries] = useState<LabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LabEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    title: '', experiment_date: new Date().toISOString().split('T')[0],
    hypothesis: '', materials: '', procedure: '', observations: '',
    conclusion: '', safety_notes: '', status: 'planned',
  });

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('lab_notebook' as any)
      .select('*')
      .eq('user_id', user!.id)
      .order('experiment_date', { ascending: false });
    setEntries((data as unknown as LabEntry[]) || []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      title: '', experiment_date: new Date().toISOString().split('T')[0],
      hypothesis: '', materials: '', procedure: '', observations: '',
      conclusion: '', safety_notes: '', status: 'planned',
    });
    setEditingEntry(null);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error(isAm ? 'ርዕስ ያስፈልጋል' : 'Title is required'); return; }
    try {
      const payload = { ...form, user_id: user!.id };
      if (editingEntry) {
        const { error } = await (supabase.from('lab_notebook' as any) as any).update(payload).eq('id', editingEntry.id);
        if (error) throw error;
        toast.success(isAm ? 'ተዘምኗል!' : 'Entry updated!');
      } else {
        const { error } = await (supabase.from('lab_notebook' as any) as any).insert(payload);
        if (error) throw error;
        toast.success(isAm ? 'ተጨምሯል!' : 'Entry created!');
      }
      setDialogOpen(false);
      resetForm();
      fetchEntries();
    } catch (err) {
      toast.error(isAm ? 'ስህተት ተከስቷል' : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAm ? 'እርግጠኛ ነዎት?' : 'Are you sure?')) return;
    await (supabase.from('lab_notebook' as any) as any).delete().eq('id', id);
    toast.success(isAm ? 'ተሰርዟል' : 'Deleted');
    fetchEntries();
  };

  const openEdit = (entry: LabEntry) => {
    setEditingEntry(entry);
    setForm({
      title: entry.title, experiment_date: entry.experiment_date,
      hypothesis: entry.hypothesis || '', materials: entry.materials || '',
      procedure: entry.procedure || '', observations: entry.observations || '',
      conclusion: entry.conclusion || '', safety_notes: entry.safety_notes || '',
      status: entry.status,
    });
    setDialogOpen(true);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = isAm
      ? { planned: 'የታቀደ', in_progress: 'በሂደት ላይ', completed: 'ተጠናቋል' }
      : { planned: 'Planned', in_progress: 'In Progress', completed: 'Completed' };
    return labels[status] || status;
  };

  const filtered = entries.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.hypothesis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{isAm ? 'የላብ ማስታወሻ ደብተር' : 'Lab Notebook'}</h1>
              <p className="text-muted-foreground text-sm">{isAm ? 'ሙከራዎችዎን ይመዝግቡ' : 'Document your experiments'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isAm ? 'ፈልግ...' : 'Search...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-48" />
            </div>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />{isAm ? 'አዲስ' : 'New Entry'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <FlaskConical className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">{isAm ? 'ገና ምንም ማስታወሻ የለም' : 'No entries yet'}</p>
            <p className="text-sm text-muted-foreground">{isAm ? 'የመጀመሪያ ሙከራዎን ይመዝግቡ' : 'Start documenting your experiments'}</p>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />{isAm ? 'ጀምር' : 'Get Started'}
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(entry => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {statusIcon(entry.status)}
                      <Badge variant="outline" className="text-xs">{statusLabel(entry.status)}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(entry)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(entry.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{entry.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.experiment_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {entry.hypothesis && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{isAm ? 'ግምት' : 'Hypothesis'}</p>
                      <p className="text-sm line-clamp-2">{entry.hypothesis}</p>
                    </div>
                  )}
                  {entry.safety_notes && (
                    <div className="flex items-start gap-1.5 p-2 rounded bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive line-clamp-2">{entry.safety_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? (isAm ? 'ማስታወሻ አርትዕ' : 'Edit Entry') : (isAm ? 'አዲስ ማስታወሻ' : 'New Lab Entry')}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isAm ? 'ርዕስ' : 'Title'} *</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{isAm ? 'ቀን' : 'Date'}</Label>
                  <Input type="date" value={form.experiment_date} onChange={e => setForm({ ...form, experiment_date: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{isAm ? 'ሁኔታ' : 'Status'}</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">{isAm ? 'የታቀደ' : 'Planned'}</SelectItem>
                    <SelectItem value="in_progress">{isAm ? 'በሂደት ላይ' : 'In Progress'}</SelectItem>
                    <SelectItem value="completed">{isAm ? 'ተጠናቋል' : 'Completed'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>{isAm ? 'ግምት' : 'Hypothesis'}</Label><Textarea value={form.hypothesis} onChange={e => setForm({ ...form, hypothesis: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>{isAm ? 'ቁሳቁሶች' : 'Materials'}</Label><Textarea value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>{isAm ? 'ሂደት' : 'Procedure'}</Label><Textarea value={form.procedure} onChange={e => setForm({ ...form, procedure: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>{isAm ? 'ምልከታዎች' : 'Observations'}</Label><Textarea value={form.observations} onChange={e => setForm({ ...form, observations: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>{isAm ? 'ድምዳሜ' : 'Conclusion'}</Label><Textarea value={form.conclusion} onChange={e => setForm({ ...form, conclusion: e.target.value })} rows={2} /></div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-destructive" />{isAm ? 'የደህንነት ማስታወሻ' : 'Safety Notes'}</Label>
                <Textarea value={form.safety_notes} onChange={e => setForm({ ...form, safety_notes: e.target.value })} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{isAm ? 'ሰርዝ' : 'Cancel'}</Button>
              <Button onClick={handleSave}>{editingEntry ? (isAm ? 'ዘምን' : 'Update') : (isAm ? 'ፍጠር' : 'Create')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default LabNotebookPage;
