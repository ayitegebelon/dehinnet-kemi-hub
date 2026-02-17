import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, GraduationCap, Share2, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const CertificatesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [eligibleCourses, setEligibleCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    const [certsRes, coursesRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from('certificates').select('*').eq('user_id', user!.id),
      supabase.from('courses').select('*'),
      supabase.from('lessons').select('id, course_id'),
      supabase.from('user_progress').select('*').eq('user_id', user!.id).eq('completed', true),
    ]);

    setCertificates(certsRes.data || []);

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

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'certificate',
        title_en: 'Certificate Earned! 🎓',
        title_am: 'የምስክር ወረቀት ተገኘ! 🎓',
        message_en: `You earned a certificate for completing "${course.title_en}"`,
        message_am: `"${course.title_am}" በማጠናቀቅ የምስክር ወረቀት አገኙ`,
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

  const getGradeLabel = (score: number | null) => {
    if (!score) return { label: 'Completed', color: '#6366f1' };
    if (score >= 90) return { label: 'Distinction', color: '#f59e0b' };
    if (score >= 75) return { label: 'Merit', color: '#10b981' };
    if (score >= 60) return { label: 'Pass', color: '#3b82f6' };
    return { label: 'Completed', color: '#6366f1' };
  };

  const downloadCertificate = (cert: any) => {
    const grade = getGradeLabel(cert.quiz_average);
    const verifyUrl = `${window.location.origin}/verify/${cert.certificate_number}`;
    
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Certificate - ${cert.student_name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size:landscape A4; margin:0; }
  body { width:297mm; height:210mm; font-family:'Inter',sans-serif; background:#0f172a; display:flex; align-items:center; justify-content:center; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  
  .cert-outer { width:290mm; height:204mm; background:linear-gradient(135deg,#1e293b 0%,#0f172a 50%,#1e293b 100%); border-radius:8px; padding:4mm; position:relative; overflow:hidden; }
  
  /* Decorative corner flourishes */
  .corner { position:absolute; width:60mm; height:60mm; }
  .corner svg { width:100%; height:100%; }
  .corner-tl { top:6mm; left:6mm; }
  .corner-tr { top:6mm; right:6mm; transform:scaleX(-1); }
  .corner-bl { bottom:6mm; left:6mm; transform:scaleY(-1); }
  .corner-br { bottom:6mm; right:6mm; transform:scale(-1,-1); }
  
  .cert-inner { width:100%; height:100%; border:1px solid rgba(212,175,55,0.3); border-radius:4px; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:15mm 25mm; background:radial-gradient(ellipse at center,rgba(212,175,55,0.03) 0%,transparent 70%); }
  
  /* Gold line accents */
  .cert-inner::before { content:''; position:absolute; inset:4mm; border:1px solid rgba(212,175,55,0.15); border-radius:2px; }
  .cert-inner::after { content:''; position:absolute; top:50%; left:15mm; right:15mm; height:1px; background:linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent); }
  
  .org-name { font-family:'Cinzel',serif; font-size:11px; letter-spacing:8px; text-transform:uppercase; color:rgba(212,175,55,0.7); margin-bottom:2mm; }
  .emoji-logo { font-size:28px; margin-bottom:3mm; filter:drop-shadow(0 0 12px rgba(212,175,55,0.4)); }
  
  .title { font-family:'Cinzel',serif; font-weight:700; font-size:38px; background:linear-gradient(135deg,#d4af37 0%,#f5d680 30%,#d4af37 60%,#b8942e 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:6px; text-transform:uppercase; margin-bottom:2mm; }
  .subtitle { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:16px; color:rgba(255,255,255,0.5); margin-bottom:8mm; letter-spacing:2px; }
  
  .presented { font-family:'Cormorant Garamond',serif; font-size:13px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:4px; margin-bottom:3mm; }
  
  .student-name { font-family:'Cinzel',serif; font-weight:600; font-size:32px; color:#f8fafc; margin-bottom:2mm; position:relative; padding-bottom:4mm; }
  .student-name::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:80mm; height:1px; background:linear-gradient(90deg,transparent,#d4af37,transparent); }
  
  .course-label { font-family:'Cormorant Garamond',serif; font-size:13px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:4px; margin-top:6mm; margin-bottom:2mm; }
  .course-name { font-family:'Cormorant Garamond',serif; font-weight:600; font-size:22px; color:#e2e8f0; letter-spacing:1px; margin-bottom:5mm; }
  
  .grade-badge { display:inline-block; padding:2mm 8mm; border:1px solid ${grade.color}; border-radius:20px; font-family:'Cinzel',serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:${grade.color}; margin-bottom:4mm; }
  
  ${cert.quiz_average ? `.score { font-family:'Inter',sans-serif; font-size:11px; color:rgba(255,255,255,0.35); margin-bottom:4mm; }` : ''}
  
  .date { font-family:'Cormorant Garamond',serif; font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:6mm; }
  
  .footer { position:absolute; bottom:8mm; left:15mm; right:15mm; display:flex; justify-content:space-between; align-items:flex-end; }
  .footer-left, .footer-right { text-align:center; }
  .footer-line { width:50mm; height:1px; background:rgba(212,175,55,0.3); margin-bottom:2mm; }
  .footer-text { font-family:'Inter',sans-serif; font-size:8px; color:rgba(255,255,255,0.3); letter-spacing:1px; text-transform:uppercase; }
  
  .seal { position:absolute; bottom:12mm; left:50%; transform:translateX(-50%); width:22mm; height:22mm; border:2px solid rgba(212,175,55,0.5); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-direction:column; background:radial-gradient(circle,rgba(212,175,55,0.08),transparent); }
  .seal-text { font-family:'Cinzel',serif; font-size:7px; color:rgba(212,175,55,0.7); letter-spacing:2px; text-transform:uppercase; }
  .seal-check { font-size:16px; color:#d4af37; margin-bottom:1mm; }
  
  .verify { position:absolute; bottom:3mm; left:50%; transform:translateX(-50%); font-family:'Inter',sans-serif; font-size:7px; color:rgba(255,255,255,0.2); letter-spacing:1px; }
  
  .qr-section { position:absolute; bottom:10mm; right:18mm; text-align:center; }
  .qr-code { width:18mm; height:18mm; border:1px solid rgba(212,175,55,0.2); border-radius:2px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.05); margin-bottom:1mm; }
  .qr-code img { width:16mm; height:16mm; }
  .qr-label { font-family:'Inter',sans-serif; font-size:6px; color:rgba(255,255,255,0.25); letter-spacing:1px; text-transform:uppercase; }
  
  /* Animated shimmer for screen */
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
</style></head><body>
<div class="cert-outer">
  <!-- Corner Flourishes -->
  <div class="corner corner-tl"><svg viewBox="0 0 200 200" fill="none"><path d="M10 190 Q10 10 190 10" stroke="rgba(212,175,55,0.3)" stroke-width="1" fill="none"/><path d="M20 180 Q20 20 180 20" stroke="rgba(212,175,55,0.15)" stroke-width="0.5" fill="none"/><circle cx="15" cy="15" r="3" fill="rgba(212,175,55,0.3)"/><path d="M10 60 Q30 30 60 10" stroke="rgba(212,175,55,0.2)" stroke-width="0.5" fill="none"/><path d="M10 100 Q50 50 100 10" stroke="rgba(212,175,55,0.1)" stroke-width="0.5" fill="none"/></svg></div>
  <div class="corner corner-tr"><svg viewBox="0 0 200 200" fill="none"><path d="M10 190 Q10 10 190 10" stroke="rgba(212,175,55,0.3)" stroke-width="1" fill="none"/><path d="M20 180 Q20 20 180 20" stroke="rgba(212,175,55,0.15)" stroke-width="0.5" fill="none"/><circle cx="15" cy="15" r="3" fill="rgba(212,175,55,0.3)"/><path d="M10 60 Q30 30 60 10" stroke="rgba(212,175,55,0.2)" stroke-width="0.5" fill="none"/><path d="M10 100 Q50 50 100 10" stroke="rgba(212,175,55,0.1)" stroke-width="0.5" fill="none"/></svg></div>
  <div class="corner corner-bl"><svg viewBox="0 0 200 200" fill="none"><path d="M10 190 Q10 10 190 10" stroke="rgba(212,175,55,0.3)" stroke-width="1" fill="none"/><path d="M20 180 Q20 20 180 20" stroke="rgba(212,175,55,0.15)" stroke-width="0.5" fill="none"/><circle cx="15" cy="15" r="3" fill="rgba(212,175,55,0.3)"/></svg></div>
  <div class="corner corner-br"><svg viewBox="0 0 200 200" fill="none"><path d="M10 190 Q10 10 190 10" stroke="rgba(212,175,55,0.3)" stroke-width="1" fill="none"/><path d="M20 180 Q20 20 180 20" stroke="rgba(212,175,55,0.15)" stroke-width="0.5" fill="none"/><circle cx="15" cy="15" r="3" fill="rgba(212,175,55,0.3)"/></svg></div>
  
  <div class="cert-inner">
    <div class="emoji-logo">🧪</div>
    <div class="org-name">Safety First Chemistry</div>
    <div class="title">Certificate</div>
    <div class="subtitle">of Achievement</div>
    
    <div class="presented">This is proudly presented to</div>
    <div class="student-name">${cert.student_name}</div>
    
    <div class="course-label">For successfully completing</div>
    <div class="course-name">${cert.course_title}</div>
    
    <div class="grade-badge">${grade.label}</div>
    ${cert.quiz_average ? `<div class="score">Average Assessment Score: ${cert.quiz_average}%</div>` : ''}
    
    <div class="date">${new Date(cert.completion_date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
    
    <div class="seal">
      <div class="seal-check">✦</div>
      <div class="seal-text">Verified</div>
    </div>
    
    <div class="footer">
      <div class="footer-left">
        <div class="footer-line"></div>
        <div class="footer-text">Certificate No: ${cert.certificate_number}</div>
      </div>
      <div class="footer-right">
        <div class="footer-line"></div>
        <div class="footer-text">Date Issued: ${new Date(cert.issued_at).toLocaleDateString()}</div>
      </div>
    </div>
    
    <div class="qr-section">
      <div class="qr-code">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&bgcolor=1e293b&color=d4af37&format=svg" alt="QR" />
      </div>
      <div class="qr-label">Scan to verify</div>
    </div>
    
    <div class="verify">Verify at: ${verifyUrl}</div>
  </div>
</div>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 800);
    }
  };

  const copyVerifyLink = (certNumber: string) => {
    const url = `${window.location.origin}/verify/${certNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certNumber);
    toast.success(language === 'am' ? 'ሊንኩ ተቀድቷል!' : 'Verification link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareCertificate = (cert: any) => {
    const url = `${window.location.origin}/verify/${cert.certificate_number}`;
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${cert.course_title}`,
        text: `${cert.student_name} earned a certificate for completing ${cert.course_title}!`,
        url,
      });
    } else {
      copyVerifyLink(cert.certificate_number);
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
            {certificates.map(cert => {
              const grade = getGradeLabel(cert.quiz_average);
              return (
                <Card key={cert.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      <div className="w-2 bg-gradient-to-b from-amber-500 to-amber-700 flex-shrink-0" />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <GraduationCap className="h-5 w-5 text-primary" />
                              <p className="font-semibold">{cert.course_title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'am' ? 'ለ' : 'Awarded to'} {cert.student_name}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">#{cert.certificate_number}</Badge>
                              <Badge style={{ borderColor: grade.color, color: grade.color }} variant="outline" className="text-xs">{grade.label}</Badge>
                              {cert.quiz_average && <Badge variant="outline" className="text-xs">Score: {cert.quiz_average}%</Badge>}
                              <span className="text-xs text-muted-foreground">
                                {new Date(cert.completion_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => downloadCertificate(cert)}>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => shareCertificate(cert)}>
                            <Share2 className="h-4 w-4 mr-1" />
                            {language === 'am' ? 'ሼር' : 'Share'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => copyVerifyLink(cert.certificate_number)}>
                            {copiedId === cert.certificate_number ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CertificatesPage;
