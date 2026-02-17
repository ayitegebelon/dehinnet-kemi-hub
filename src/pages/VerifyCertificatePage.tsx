import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Search, GraduationCap, ArrowLeft, Shield, Calendar, Award, Hash } from 'lucide-react';

const VerifyCertificatePage: React.FC = () => {
  const { certNumber } = useParams<{ certNumber?: string }>();
  const [searchInput, setSearchInput] = useState(certNumber || '');
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (certNumber) verifyCertificate(certNumber);
  }, [certNumber]);

  const verifyCertificate = async (number: string) => {
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_number', number.trim())
      .maybeSingle();
    setCertificate(data);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) verifyCertificate(searchInput.trim());
  };

  const getGradeLabel = (score: number | null) => {
    if (!score) return { label: 'Completed', color: 'text-indigo-400' };
    if (score >= 90) return { label: 'Distinction', color: 'text-amber-400' };
    if (score >= 75) return { label: 'Merit', color: 'text-emerald-400' };
    if (score >= 60) return { label: 'Pass', color: 'text-blue-400' };
    return { label: 'Completed', color: 'text-indigo-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-lg font-bold">🧪 Safety First Chemistry</span>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Certificate Verification</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Search */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Certificate</h1>
          <p className="text-muted-foreground">Enter a certificate number to verify its authenticity</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-10">
          <Input
            placeholder="e.g. CERT-XXXXXXXX-XXXX"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="text-center font-mono"
          />
          <Button type="submit" disabled={loading || !searchInput.trim()}>
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Results */}
        {searched && !loading && (
          certificate ? (
            <Card className="overflow-hidden border-green-500/30 shadow-lg shadow-green-500/5">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/20 p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-green-500">Certificate Verified ✓</h2>
                <p className="text-sm text-muted-foreground mt-1">This certificate is authentic and valid</p>
              </div>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Student Name</p>
                      <p className="font-semibold">{certificate.student_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Award className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Course</p>
                      <p className="font-semibold">{certificate.course_title}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                        <p className="font-medium text-sm">{new Date(certificate.completion_date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Grade</p>
                        <p className={`font-semibold text-sm ${getGradeLabel(certificate.quiz_average).color}`}>
                          {getGradeLabel(certificate.quiz_average).label}
                          {certificate.quiz_average ? ` (${certificate.quiz_average}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <Badge variant="secondary" className="font-mono text-xs">{certificate.certificate_number}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Issued on {new Date(certificate.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden border-red-500/30 shadow-lg shadow-red-500/5">
              <CardContent className="p-10 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-red-500 mb-2">Certificate Not Found</h2>
                <p className="text-muted-foreground text-sm">
                  No certificate matches this number. Please double-check and try again.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </main>
    </div>
  );
};

export default VerifyCertificatePage;
