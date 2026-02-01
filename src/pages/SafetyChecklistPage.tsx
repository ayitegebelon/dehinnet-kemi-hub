import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import SafetyChecklist from '@/components/safety/SafetyChecklist';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProjectSafety } from '@/hooks/useProjectSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, ArrowLeft, Shield } from 'lucide-react';

interface ProjectContext {
  projectId: string;
  projectTitle: string;
}

const SafetyChecklistPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { getStartContext, clearStartContext, verifySafety } = useProjectSafety();
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null);

  const isAmharic = language === 'am';
  const isOromo = language === 'or';

  const getText = (en: string, am: string, or: string) => {
    if (isAmharic) return am;
    if (isOromo) return or;
    return en;
  };

  // Load project context on mount
  useEffect(() => {
    const context = getStartContext();
    if (context) {
      setProjectContext(context);
    }
  }, [getStartContext]);
  
  const handleComplete = () => {
    if (projectContext) {
      // Verify safety for this specific project
      verifySafety(projectContext.projectId);
      clearStartContext();
      
      toast.success(
        getText(
          'Safety verified! Project instructions are now unlocked.',
          'ደህንነት ተረጋግጧል! የፕሮጀክት መመሪያዎች አሁን ተከፍተዋል።',
          'Nageenya mirkanaa\'e! Qajeelfamni pirojektii amma banameera.'
        )
      );
      
      // Navigate back to projects page
      navigate('/projects');
    } else {
      toast.success(
        getText(
          'Safety checklist completed!',
          'የደህንነት ዝርዝር ተጠናቋል!',
          'Tarreen nageenya xumurame!'
        )
      );
      navigate('/dashboard');
    }
  };

  const handleCancel = () => {
    clearStartContext();
    navigate('/projects');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Project Context Header */}
        {projectContext && (
          <Card className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {getText('Starting project:', 'ፕሮጀክት መጀመር:', 'Pirojektii jalqabuu:')}
                  </p>
                  <h3 className="font-bold text-lg">{projectContext.projectTitle}</h3>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                {getText('Cancel', 'ይቅር', 'Haqi')}
              </Button>
            </div>
          </Card>
        )}

        {/* Info Alert */}
        {projectContext && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">
                  {getText('Why Safety First?', 'ለምን ደህንነት በቅድሚያ?', 'Maaliif Nageenya Dursa?')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getText(
                    'Chemistry experiments can be dangerous without proper precautions. Complete this checklist to ensure you have all necessary safety equipment and understand the risks.',
                    'የኬሚስትሪ ሙከራዎች ያለ ተገቢ ጥንቃቄ አደገኛ ሊሆኑ ይችላሉ። ሁሉም አስፈላጊ የደህንነት መሳሪያዎች እንዳሉዎት እና ስጋቶቹን እንደሚረዱ ለማረጋገጥ ይህንን ዝርዝር ያጠናቅቁ።',
                    'Muuxannoowwan keemistrii of-eeggannoo malee balaa qabaachuu danda\'u. Meeshaalee nageenya barbaachisoo hunda akka qabdu fi balaa akka hubattu mirkaneeffachuuf tarree kana xumurii.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <SafetyChecklist onComplete={handleComplete} />
      </div>
    </Layout>
  );
};

export default SafetyChecklistPage;
