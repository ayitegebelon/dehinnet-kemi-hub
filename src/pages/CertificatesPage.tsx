import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const CertificatesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [eligibleCourses, setEligibleCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    const [certsRes, coursesRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from('certificates').select('*').eq('user_id', user!.id),
      supabase.from('courses').select('*'),
      supabase.from('lessons').select('id, course_id'),
      supabase.from('user_progress').select('*').eq('user_id', user!.id).eq('completed', true),
    ]);

    setCertificates(certsRes.data || []);

    // Calculate eligible courses (all lessons completed)
    const courses = coursesRes.data || [];
    const lessons = lessonsRes.data || [];
    const completedIds = new Set((progressRes.data || []).map((p: any) => p.lesson_id));
    const existingCertCourseIds = new Set((certsRes.data || []).map((c: any) => c.course_id));

    const eligible = courses.filter(course => {
      if (existingCertCourseIds.has(course.id)) return false;
      const courseLessons = lessons.filter((l: any) => l.course_id === course.id);
      return courseLessons.length > 0 && courseLessons.every((l: any) => completedIds.has(l.id));
    });

    setEligibleCourses(eligible);
    setLoading(false);
  };

  const generateCertificate = async (course: any) => {
    if (!user || !profile) return;
    setGenerating(course.id);

    try {
      // Get quiz scores for average
      const { data: lessons } = await supabase.from('lessons').select('id').eq('course_id', course.id);
      const lessonIds = lessons?.map((l: any) => l.id) || [];
      const { data: progress } = await supabase.from('user_progress')
        .select('quiz_score').eq('user_id', user.id).in('lesson_id', lessonIds);
      const scores = (progress || []).filter((p: any) => p.quiz_score != null).map((p: any) => p.quiz_score);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;

      const certNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const { error } = await supabase.from('certificates').insert({
        user_id: user.id,
        course_id: course.id,
        certificate_number: certNumber,
        student_name: profile.full_name,
        course_title: language === 'am' ? course.title_am : course.title_en,
        quiz_average: avgScore,
      });

      if (error) throw error;

      // Also create a notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'certificate',
        title_en: 'Certificate Earned! 🎓',
        title_am: 'የምስክር ወረቀት ተገኘ! 🎓',
        message_en: `You earned a certificate for completing \"${course.title_en}\"`,
        message_am: `\"${course.title_am}\" በማጠናቀቅ የምስክር ወረቀት አገኙ`,
        link: '/certificates',
      });

      toast.success(language === 'am' ? 'የምስክር ወረቀት ተፈጠረ!' : 'Certificate generated!');
      fetchData();
    } catch (err) {
      toast.error(language === 'am' ? 'ስህተት ተከስቷል' : 'Failed to generate certificate');
    } finally {
      setGenerating(null);
    }
  };

  const downloadCertificate = (cert: any) => {
    // Generate a beautiful HTML certificate and trigger download as PDF via print
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Certificate</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:297mm; height:210mm; display:flex; align-items:center; justify-content:center; background:#fff; }
  .cert { width:280mm; height:195mm; border:3px solid #1a365d; padding:20mm; position:relative; text-align:center; background:linear-gradient(135deg,#fefefe 0%,#f8fafc 100%); }
  .cert::before { content:''; position:absolute; inset:8mm; border:1px solid #cbd5e1; }
  .cert::after { content:''; position:absolute; top:12mm; left:12mm; right:12mm; bottom:12mm; border:1px dashed #e2e8f0; }
  .logo { font-size:24px; color:#1a365d; margin-bottom:5mm; font-family:'Playfair Display',serif; }
  .title { font-size:36px; color:#1a365d; font-family:'Playfair Display',serif; margin:8mm 0 3mm; letter-spacing:3px; }
  .subtitle { font-size:14px; color:#64748b; font-family:'Inter',sans-serif; margin-bottom:10mm; }
  .name { font-size:28px; color:#0f172a; font-family:'Playfair Display',serif; border-bottom:2px solid #1a365d; display:inline-block; padding:2mm 10mm; margin:5mm 0; }
  .course { font-size:18px; color:#334155; font-family:'Inter',sans-serif; margin:5mm 0; }
  .details { font-size:12px; color:#64748b; font-family:'Inter',sans-serif; margin-top:8mm; }
  .footer { position:absolute; bottom:18mm; left:25mm; right:25mm; display:flex; justify-content:space-between; font-family:'Inter',sans-serif; font-size:11px; color:#64748b; }
  .seal { width:60px; height:60px; border-radius:50%; border:2px solid #1a365d; display:flex; align-items:center; justify-content:center; font-size:10px; color:#1a365d; position:absolute; bottom:25mm; left:50%; transform:translateX(-50%); }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } @page { size:landscape A4; margin:0; } }
</style></head><body>
<div class="cert">
  <div class="logo">🧪 ደህንነት ኬሚ — Safety First Chemistry</div>
  <div class="title">CERTIFICATE OF COMPLETION</div>
  <div class="subtitle">This is to certify that</div>
  <div class="name">${cert.student_name}</div>
  <div class="course">has successfully completed the course</div>
  <div class="name" style="font-size:22px">${cert.course_title}</div>
  ${cert.quiz_average ? `<div class="details">Average Quiz Score: ${cert.quiz_average}%</div>` : ''}
  <div class="details">Date of Completion: ${new Date(cert.completion_date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
  <div class="seal">✓ VERIFIED</div>
  <div class="footer">
    <span>Certificate #${cert.certificate_number}</span>
    <span>Issued: ${new Date(cert.issued_at).toLocaleDateString()}</span>
  </div>
</div>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <GraduationCap className="h-6 w-6 text-primary" />
          {language === 'am' ? 'የምስክር ወረቀቶች' : 'My Certificates'}
        </h1>

        {/* Eligible courses */}
        {eligibleCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              {language === 'am' ? 'ለምስክር ወረቀት ብቁ' : 'Ready to Claim'}
            </h2>
            <div className="grid gap-3">
              {eligibleCourses.map(course => (
                <Card key={course.id} className="border-amber-500/30 bg-amber-500/5">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{language === 'am' ? course.title_am : course.title_en}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'am' ? 'ኮርሱን አጠናቁ! ምስክር ወረቀትዎን ያውርዱ' : 'Course completed! Claim your certificate'}
                      </p>
                    </div>
                    <Button
                      onClick={() => generateCertificate(course)}
                      disabled={generating === course.id}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90"
                    >
                      {generating === course.id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        <>
                          <Award className="h-4 w-4 mr-1" />
                          {language === 'am' ? 'ያውርዱ' : 'Claim'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Existing certificates */}
        {certificates.length === 0 && eligibleCourses.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                {language === 'am' ? 'ገና ምስክር ወረቀት የለም' : 'No certificates yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'am' ? 'ኮርስ ያጠናቅቁ ምስክር ወረቀት ለማግኘት' : 'Complete a course to earn your certificate'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {certificates.map(cert => (
              <Card key={cert.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="w-2 bg-gradient-to-b from-primary to-accent flex-shrink-0" />
                    <div className="flex-1 flex items-center justify-between p-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <p className="font-semibold">{cert.course_title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'am' ? 'ለ' : 'Awarded to'} {cert.student_name}
                        </p>
                        <div className="flex gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">#{cert.certificate_number}</Badge>
                          {cert.quiz_average && <Badge variant="outline" className="text-xs">Score: {cert.quiz_average}%</Badge>}
                          <span className="text-xs text-muted-foreground">
                            {new Date(cert.completion_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => downloadCertificate(cert)}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CertificatesPage;
