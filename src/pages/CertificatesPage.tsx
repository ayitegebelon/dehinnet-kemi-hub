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
  const [fatherName, setFatherName] = useState<string>('');

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    const [certsRes, coursesRes, lessonsRes, progressRes, profileRes] = await Promise.all([
      supabase.from('certificates').select('*').eq('user_id', user!.id),
      supabase.from('courses').select('*'),
      supabase.from('lessons').select('id, course_id'),
      supabase.from('user_progress').select('*').eq('user_id', user!.id).eq('completed', true),
      supabase.from('profiles').select('father_name' as any).eq('user_id', user!.id).maybeSingle(),
    ]);

    setCertificates(certsRes.data || []);
    if (profileRes.data) setFatherName((profileRes.data as any)?.father_name || '');

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

  const getFullName = () => {
    const first = profile?.full_name || '';
    return fatherName ? `${first} ${fatherName}` : first;
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
      const fullName = getFullName();

      const { error } = await supabase.from('certificates').insert({
        user_id: user.id,
        course_id: course.id,
        certificate_number: certNumber,
        student_name: fullName,
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
    if (!score) return { label: 'Completed', color: '#0891b2' };
    if (score >= 90) return { label: 'Distinction', color: '#d4af37' };
    if (score >= 75) return { label: 'Merit', color: '#10b981' };
    if (score >= 60) return { label: 'Pass', color: '#3b82f6' };
    return { label: 'Completed', color: '#0891b2' };
  };

  const downloadCertificate = (cert: any) => {
    const grade = getGradeLabel(cert.quiz_average);
    const verifyUrl = `${window.location.origin}/verify/${cert.certificate_number}`;
    
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Certificate - ${cert.student_name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size:landscape A4; margin:0; }
  body { width:297mm; height:210mm; font-family:'Inter',sans-serif; background:#fff; display:flex; align-items:center; justify-content:center; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  
  .cert-wrap { width:293mm; height:207mm; position:relative; overflow:hidden; }
  
  /* Teal diagonal corners */
  .corner-shape-left { position:absolute; top:0; left:0; width:0; height:0; border-left:85mm solid #0d7377; border-bottom:210mm solid transparent; z-index:1; }
  .corner-shape-right { position:absolute; top:0; right:0; width:0; height:0; border-right:85mm solid #0d7377; border-bottom:210mm solid transparent; z-index:1; }
  
  /* Inner teal overlay (darker) */
  .corner-inner-left { position:absolute; top:0; left:0; width:0; height:0; border-left:70mm solid #0a5c5f; border-bottom:195mm solid transparent; z-index:2; }
  .corner-inner-right { position:absolute; top:0; right:0; width:0; height:0; border-right:70mm solid #0a5c5f; border-bottom:195mm solid transparent; z-index:2; }
  
  /* White content area */
  .content-area { position:absolute; inset:0; z-index:3; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:18mm 80mm; text-align:center; }
  
  /* Gold decorative lines */
  .gold-line-top { position:absolute; top:15mm; left:75mm; right:75mm; height:2px; background:linear-gradient(90deg,transparent,#d4af37,transparent); z-index:4; }
  .gold-line-bottom { position:absolute; bottom:15mm; left:75mm; right:75mm; height:2px; background:linear-gradient(90deg,transparent,#d4af37,transparent); z-index:4; }
  
  /* Decorative border */
  .inner-border { position:absolute; top:12mm; left:72mm; right:72mm; bottom:12mm; border:1px solid rgba(212,175,55,0.25); z-index:4; }
  
  /* Gold seal/badge */
  .gold-seal { position:absolute; top:20mm; left:78mm; z-index:5; width:28mm; height:28mm; }
  .seal-circle { width:28mm; height:28mm; border-radius:50%; background:linear-gradient(135deg,#d4af37 0%,#f5d680 40%,#d4af37 60%,#b8942e 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px rgba(212,175,55,0.4); }
  .seal-inner { width:22mm; height:22mm; border-radius:50%; border:1.5px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .seal-text-top { font-family:'Cinzel',serif; font-size:7px; color:#fff; letter-spacing:2px; text-transform:uppercase; }
  .seal-text-main { font-family:'Cinzel',serif; font-size:11px; font-weight:700; color:#fff; }
  .seal-text-bottom { font-family:'Cinzel',serif; font-size:6px; color:rgba(255,255,255,0.8); letter-spacing:1px; }
  
  .cert-header { font-family:'Cinzel',serif; font-size:14px; letter-spacing:8px; text-transform:uppercase; color:#0d7377; margin-bottom:2mm; font-weight:400; }
  .cert-title { font-family:'Cinzel',serif; font-size:42px; font-weight:700; color:#0a5c5f; letter-spacing:3px; margin-bottom:1mm; }
  .cert-subtitle { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:16px; color:#0d7377; margin-bottom:8mm; letter-spacing:2px; font-weight:300; }
  
  .presented-to { font-family:'Cormorant Garamond',serif; font-size:13px; color:#666; text-transform:uppercase; letter-spacing:5px; margin-bottom:4mm; }
  
  .student-name { font-family:'Cormorant Garamond',serif; font-weight:700; font-size:34px; color:#1a1a1a; padding-bottom:3mm; position:relative; margin-bottom:4mm; }
  .student-name::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:100mm; height:2px; background:linear-gradient(90deg,transparent,#d4af37,transparent); }
  
  .for-text { font-family:'Cormorant Garamond',serif; font-size:13px; color:#666; text-transform:uppercase; letter-spacing:4px; margin-bottom:3mm; }
  .course-name { font-family:'Cormorant Garamond',serif; font-weight:600; font-size:22px; color:#0d7377; letter-spacing:1px; margin-bottom:5mm; }
  
  .grade-pill { display:inline-block; padding:2mm 10mm; background:linear-gradient(135deg,${grade.color}22,${grade.color}11); border:1px solid ${grade.color}; border-radius:25px; font-family:'Cinzel',serif; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${grade.color}; margin-bottom:3mm; }
  
  .score-text { font-family:'Inter',sans-serif; font-size:10px; color:#999; margin-bottom:5mm; }
  .date-text { font-family:'Cormorant Garamond',serif; font-size:13px; color:#888; font-style:italic; margin-bottom:4mm; }
  
  .signatures { position:absolute; bottom:22mm; left:80mm; right:80mm; display:flex; justify-content:space-between; z-index:5; }
  .sig-block { text-align:center; width:45mm; }
  .sig-line { width:100%; height:1px; background:#ccc; margin-bottom:2mm; }
  .sig-label { font-family:'Inter',sans-serif; font-size:8px; color:#999; text-transform:uppercase; letter-spacing:1px; }
  
  .cert-number { position:absolute; bottom:10mm; left:80mm; font-family:'Inter',sans-serif; font-size:7px; color:#bbb; letter-spacing:1px; z-index:5; }
  .verify-text { position:absolute; bottom:10mm; right:80mm; font-family:'Inter',sans-serif; font-size:7px; color:#bbb; z-index:5; text-align:right; }
  
  .qr-area { position:absolute; bottom:18mm; right:78mm; z-index:5; text-align:center; }
  .qr-img { width:16mm; height:16mm; border:1px solid #e5e5e5; border-radius:2px; }
  .qr-label { font-family:'Inter',sans-serif; font-size:5px; color:#ccc; letter-spacing:1px; text-transform:uppercase; margin-top:1mm; }
  
  .org-logo { position:absolute; top:22mm; right:78mm; z-index:5; text-align:center; }
  .org-icon { font-size:22px; }
  .org-name { font-family:'Cinzel',serif; font-size:7px; color:#0d7377; letter-spacing:1px; margin-top:1mm; }
</style></head><body>
<div class="cert-wrap">
  <div class="corner-shape-left"></div>
  <div class="corner-shape-right"></div>
  <div class="corner-inner-left"></div>
  <div class="corner-inner-right"></div>
  <div class="gold-line-top"></div>
  <div class="gold-line-bottom"></div>
  <div class="inner-border"></div>
  
  <!-- Gold Seal -->
  <div class="gold-seal">
    <div class="seal-circle">
      <div class="seal-inner">
        <div class="seal-text-top">Best</div>
        <div class="seal-text-main">AWARD</div>
        <div class="seal-text-bottom">★ ★ ★</div>
      </div>
    </div>
  </div>
  
  <!-- Organization Logo -->
  <div class="org-logo">
    <div class="org-icon">🧪</div>
    <div class="org-name">Safety First Chemistry</div>
  </div>
  
  <div class="content-area">
    <div class="cert-header">Certificate</div>
    <div class="cert-title">Certificate</div>
    <div class="cert-subtitle">of Achievement</div>
    
    <div class="presented-to">This certificate is presented to</div>
    <div class="student-name">${cert.student_name}</div>
    
    <div class="for-text">For successfully completing the course</div>
    <div class="course-name">${cert.course_title}</div>
    
    <div class="grade-pill">${grade.label}</div>
    ${cert.quiz_average ? `<div class="score-text">Assessment Score: ${cert.quiz_average}%</div>` : ''}
    <div class="date-text">${new Date(cert.completion_date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
  </div>
  
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Date</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Signature</div>
    </div>
  </div>
  
  <div class="qr-area">
    <img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&format=svg" alt="QR" />
    <div class="qr-label">Scan to verify</div>
  </div>
  
  <div class="cert-number">Certificate #${cert.certificate_number}</div>
  <div class="verify-text">Verify: ${verifyUrl}</div>
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
                      <div className="w-2 bg-gradient-to-b from-teal-600 to-teal-800 flex-shrink-0" />
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
                              <Badge variant="secondary" className="text-xs font-mono">#{cert.certificate_number}</Badge>
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
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
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
