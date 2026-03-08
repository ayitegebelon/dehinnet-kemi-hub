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

  const downloadCertificate = async (cert: any) => {
    // Fetch director signature with cache-busting
    const { data: sigData } = supabase.storage.from('signatures').getPublicUrl('director-signature.png');
    let signatureImgUrl = '';
    try {
      const cacheBuster = `?t=${Date.now()}`;
      const res = await fetch(sigData.publicUrl + cacheBuster, { method: 'HEAD' });
      if (res.ok) signatureImgUrl = sigData.publicUrl + cacheBuster;
    } catch {}

    const grade = getGradeLabel(cert.quiz_average);
    
    const nameParts = cert.student_name.split(' ');
    const firstName = nameParts[0] || '';
    const fatherNamePart = nameParts.slice(1).join(' ') || '';
    const issueDate = new Date(cert.completion_date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Certificate - ${cert.student_name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  @page{size:landscape A4;margin:0;}
  body{width:297mm;height:210mm;font-family:'Inter',sans-serif;background:#888;display:flex;align-items:center;justify-content:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  
  .cert-wrap{width:293mm;height:207mm;position:relative;overflow:hidden;background:#1a1a1a;}
  
  /* Dark geometric background */
  .bg-pattern{position:absolute;inset:0;background:
    linear-gradient(135deg,#1a1a1a 0%,#222 25%,#1a1a1a 50%,#222 75%,#1a1a1a 100%);
    z-index:0;}
  .bg-triangles{position:absolute;bottom:0;right:0;width:50%;height:50%;
    background:repeating-conic-gradient(#1e1e1e 0% 25%,#222 0% 50%) 0 0/20px 20px;
    opacity:0.4;z-index:1;}
  .bg-triangles-left{position:absolute;bottom:0;left:0;width:30%;height:40%;
    background:repeating-conic-gradient(#1e1e1e 0% 25%,#222 0% 50%) 0 0/20px 20px;
    opacity:0.3;z-index:1;}
  
  /* Gold diagonal accents - top left */
  .gold-accent-tl{position:absolute;top:0;left:0;width:0;height:0;
    border-top:90mm solid rgba(212,175,55,0.15);border-right:90mm solid transparent;z-index:2;}
  .gold-accent-tl2{position:absolute;top:0;left:0;width:0;height:0;
    border-top:80mm solid rgba(212,175,55,0.08);border-right:80mm solid transparent;z-index:2;}
  .gold-line-tl{position:absolute;top:0;left:0;width:120mm;height:2px;
    background:linear-gradient(90deg,#d4af37,transparent);transform-origin:top left;transform:rotate(45deg);z-index:3;}
  
  /* Gold diagonal accents - top right */
  .gold-accent-tr{position:absolute;top:0;right:0;width:0;height:0;
    border-top:70mm solid rgba(212,175,55,0.12);border-left:70mm solid transparent;z-index:2;}
  
  /* Gold diagonal accents - bottom left */
  .gold-accent-bl{position:absolute;bottom:0;left:0;width:0;height:0;
    border-bottom:60mm solid rgba(212,175,55,0.1);border-right:60mm solid transparent;z-index:2;}
  
  /* Gold diagonal accents - bottom right */
  .gold-accent-br{position:absolute;bottom:0;right:0;width:0;height:0;
    border-bottom:80mm solid rgba(212,175,55,0.12);border-left:80mm solid transparent;z-index:2;}
  .gold-line-br{position:absolute;bottom:0;right:0;width:100mm;height:2px;
    background:linear-gradient(90deg,transparent,#d4af37);transform-origin:bottom right;transform:rotate(45deg);z-index:3;}
  
  /* Gold bottom bar */
  .gold-bottom-bar{position:absolute;bottom:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,transparent 5%,#d4af37 30%,#f5d680 50%,#d4af37 70%,transparent 95%);z-index:4;}
  
  /* Content */
  .content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18mm 45mm;text-align:center;z-index:10;}
  
  /* Logo area */
  .logo-area{margin-bottom:4mm;display:flex;align-items:center;gap:3mm;}
  .logo-img{width:12mm;height:12mm;border-radius:3mm;object-fit:cover;}
  .logo-text{font-family:'Cinzel',serif;font-size:10px;color:#d4af37;letter-spacing:4px;text-transform:uppercase;}
  
  /* Title */
  .cert-title{font-family:'Great Vibes',cursive;font-size:52px;color:#fff;margin-bottom:1mm;line-height:1.1;}
  .cert-subtitle{font-family:'Cinzel',serif;font-size:13px;color:#d4af37;letter-spacing:8px;text-transform:uppercase;margin-bottom:6mm;}
  
  /* Divider */
  .gold-divider{width:100mm;height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:4mm 0;}
  
  /* Presented to */
  .presented-to{font-family:'Cinzel',serif;font-size:11px;color:#d4af37;letter-spacing:6px;text-transform:uppercase;margin-bottom:5mm;}
  
  /* Student name */
  .student-name{font-family:'Great Vibes',cursive;font-size:44px;color:#fff;line-height:1.2;margin-bottom:1mm;}
  .student-father{font-family:'Cormorant Garamond',serif;font-size:26px;color:#ccc;font-weight:300;margin-bottom:3mm;}
  .name-underline{width:90mm;height:1px;background:linear-gradient(90deg,transparent,#d4af37 30%,#d4af37 70%,transparent);margin:0 auto 5mm;}
  
  /* Description */
  .desc-text{font-family:'Cormorant Garamond',serif;font-size:12px;color:#999;line-height:1.8;max-width:180mm;margin-bottom:2mm;}
  .course-name{font-family:'Cinzel',serif;font-size:18px;color:#d4af37;letter-spacing:3px;text-transform:uppercase;margin:2mm 0;}
  .desc-sub{font-family:'Cormorant Garamond',serif;font-size:11px;color:#888;font-style:italic;line-height:1.6;margin-bottom:4mm;}
  
  /* Grade */
  .grade-row{display:flex;align-items:center;gap:4mm;margin-bottom:5mm;}
  .grade-pill{padding:2mm 7mm;border:1px solid ${grade.color};border-radius:20px;
    font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;text-transform:uppercase;color:${grade.color};
    background:${grade.color}15;}
  .score-pill{padding:2mm 6mm;border:1px solid rgba(212,175,55,0.3);border-radius:20px;
    font-family:'Inter',sans-serif;font-size:9px;color:#d4af37;}
  
   /* Seal */
   .seal{position:absolute;bottom:35mm;right:25mm;z-index:12;}
   .seal-outer{width:22mm;height:22mm;border-radius:50%;
    background:linear-gradient(135deg,#d4af37 0%,#f5d680 35%,#d4af37 65%,#b8942e 100%);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 25px rgba(212,175,55,0.4);}
  .seal-mid{width:18mm;height:18mm;border-radius:50%;border:1px solid rgba(255,255,255,0.3);
    display:flex;align-items:center;justify-content:center;}
  .seal-inner{width:14mm;height:14mm;border-radius:50%;border:1px solid rgba(255,255,255,0.2);
    display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .seal-icon{font-size:12px;margin-bottom:1mm;}
  .seal-label{font-family:'Cinzel',serif;font-size:5px;color:#fff;letter-spacing:2px;text-transform:uppercase;}
  .seal-big{font-family:'Cinzel',serif;font-size:7px;color:#fff;font-weight:700;letter-spacing:1px;}
  
  /* Ribbon tails */
   .ribbon{position:absolute;bottom:33mm;right:28mm;z-index:11;display:flex;gap:4mm;}
   .ribbon-tail{width:6mm;height:10mm;background:linear-gradient(180deg,#d4af37,#b8942e);clip-path:polygon(0 0,100% 0,100% 70%,50% 100%,0 70%);}
  
  /* Signatures */
  .signatures{position:absolute;bottom:18mm;left:50mm;right:50mm;display:flex;justify-content:space-between;z-index:12;}
  .sig-block{text-align:center;width:50mm;}
  .sig-line{width:100%;height:1px;background:linear-gradient(90deg,transparent,#555,transparent);margin-bottom:2mm;}
  .sig-name{font-family:'Cormorant Garamond',serif;font-size:10px;color:#ccc;font-style:italic;margin-bottom:1mm;}
  .sig-title{font-family:'Cinzel',serif;font-size:6px;color:#888;text-transform:uppercase;letter-spacing:2px;}
  
  /* Certificate ID & QR */
  .cert-id{position:absolute;bottom:8mm;left:20mm;z-index:12;text-align:left;}
  .cert-id-label{font-family:'Inter',sans-serif;font-size:6px;color:#555;letter-spacing:1px;text-transform:uppercase;}
  .cert-id-value{font-family:'JetBrains Mono',monospace;font-size:8px;color:#999;margin-top:1mm;}
  .cert-date{font-family:'Inter',sans-serif;font-size:7px;color:#777;margin-top:1mm;}
  
  .verify-area{position:absolute;bottom:8mm;right:20mm;z-index:12;text-align:right;}
  .verify-label{font-family:'Inter',sans-serif;font-size:6px;color:#555;letter-spacing:1px;text-transform:uppercase;}
  .verify-value{font-family:'JetBrains Mono',monospace;font-size:8px;color:#999;margin-top:1mm;}
  .verify-note{font-family:'Inter',sans-serif;font-size:5px;color:#555;margin-top:1mm;font-style:italic;}
</style></head><body>
<div class="cert-wrap">
  <div class="bg-pattern"></div>
  <div class="bg-triangles"></div>
  <div class="bg-triangles-left"></div>
  <div class="gold-accent-tl"></div>
  <div class="gold-accent-tl2"></div>
  <div class="gold-line-tl"></div>
  <div class="gold-accent-tr"></div>
  <div class="gold-accent-bl"></div>
  <div class="gold-accent-br"></div>
  <div class="gold-line-br"></div>
  <div class="gold-bottom-bar"></div>
  
  <div class="content">
    <div class="logo-area">
      <img class="logo-img" src="https://i.ibb.co/7tTFPvx5/Chat-GPT-Image-Jan-10-2026-03-23-18-PM.png" alt="Logo" />
      <div class="logo-text">Safety First Chemistry Academy</div>
    </div>
    
    <div class="cert-title">Certificate</div>
    <div class="cert-subtitle">of Achievement</div>
    
    <div class="gold-divider"></div>
    
    <div class="presented-to">Proudly Presented To</div>
    
     <div class="student-name">${cert.student_name}</div>
    <div class="name-underline"></div>
    
    <div class="desc-text">For successfully completing the course</div>
    <div class="course-name">${cert.course_title}</div>
    <div class="desc-sub">at Safety First Chemistry Academy<br/>and demonstrating outstanding commitment to academic excellence.</div>
    
    <div class="grade-row">
      <div class="grade-pill">${grade.label}</div>
      ${cert.quiz_average ? `<div class="score-pill">Score: ${cert.quiz_average}%</div>` : ''}
    </div>
  </div>
  
  <div class="seal">
    <div class="seal-outer">
      <div class="seal-mid">
        <div class="seal-inner">
          <div class="seal-icon">🏆</div>
          <div class="seal-label">Best</div>
          <div class="seal-big">AWARD</div>
        </div>
      </div>
    </div>
  </div>
  <div class="ribbon">
    <div class="ribbon-tail"></div>
    <div class="ribbon-tail"></div>
  </div>
  
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-name">${issueDate}</div>
      <div class="sig-line"></div>
      <div class="sig-title">Date</div>
    </div>
    <div class="sig-block">
      ${signatureImgUrl ? `<img src="${signatureImgUrl}" alt="Director Signature" style="max-height:12mm;max-width:45mm;object-fit:contain;margin:0 auto 2mm;" />` : '<div style="height:12mm;"></div>'}
      <div class="sig-line"></div>
      <div class="sig-title">Director Signature</div>
    </div>
  </div>
  
  <div class="cert-id">
    <div class="cert-id-label">Certificate ID</div>
    <div class="cert-id-value">${cert.certificate_number}</div>
    <div class="cert-date">Date of Issue: ${issueDate}</div>
  </div>
  
  <div class="verify-area">
    <div class="verify-label">Verify at</div>
    <div class="verify-note">Safety First Chemistry Academy</div>
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
              const nameParts = cert.student_name.split(' ');
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
                              {language === 'am' ? 'ለ' : 'Awarded to'} <span className="font-medium text-foreground">{nameParts[0]}</span>
                              {nameParts.length > 1 && <span className="text-foreground"> {nameParts.slice(1).join(' ')}</span>}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
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
