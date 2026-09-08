import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChemistryProject, projectLevels, projectCategories } from '@/data/chemistryProjects';
import Lab3DEquipment from './Lab3DEquipment';
import { useProjectSafety } from '@/hooks/useProjectSafety';
import { 
  Clock, 
  Shield, 
  Star, 
  Beaker,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  TestTube,
  Play,
  Lock
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: ChemistryProject | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { isSafetyVerified, setStartContext } = useProjectSafety();
  const [currentStep, setCurrentStep] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  // Check if safety is verified for this project
  const safetyVerified = project ? isSafetyVerified(project.id) : false;

  // Reset state when project changes
  React.useEffect(() => {
    if (project) {
      setCurrentStep(0);
      setShowInstructions(safetyVerified);
    }
  }, [project?.id, safetyVerified]);

  if (!project) return null;

  const getText = (en: string, am: string, or: string) => {
    if (language === 'am') return am;
    if (language === 'or') return or;
    return en;
  };

  const getTitle = () => getText(project.titleEn, project.titleAm, project.titleOr);
  const getDescription = () => getText(project.descriptionEn, project.descriptionAm, project.descriptionOr);

  const getLevelName = () => {
    const levelData = projectLevels[project.level];
    return getText(levelData.en, levelData.am, levelData.or);
  };

  const getCategoryName = () => {
    const categoryData = projectCategories[project.category];
    return getText(categoryData.en, categoryData.am, categoryData.or);
  };

  const handleStartProject = () => {
    // Store project context and navigate to safety checklist
    setStartContext({
      projectId: project.id,
      projectTitle: getTitle(),
    });
    onClose();
    navigate('/safety');
  };

  const step = project.steps[currentStep];

  const safetyColors = {
    low: 'bg-safety-green/20 text-safety-green border-safety-green/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-danger/20 text-danger border-danger/30'
  };

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl shrink-0">
                  {project.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-2xl font-bold mb-2">
                    {getTitle()}
                  </DialogTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">
                      {projectCategories[project.category].icon} {getCategoryName()}
                    </Badge>
                    <Badge variant="outline">{getLevelName()}</Badge>
                    <Badge variant="outline" className={safetyColors[project.safetyLevel]}>
                      <Shield className="w-3 h-3 mr-1" />
                      {project.safetyLevel === 'low' ? getText('Low Risk', 'ዝቅተኛ አደጋ', 'Balaa gadi') :
                       project.safetyLevel === 'medium' ? getText('Medium Risk', 'መካከለኛ አደጋ', 'Balaa giddugaleessa') :
                       getText('High Risk', 'ከፍተኛ አደጋ', 'Balaa ol\'aanaa')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < project.difficulty ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <p className="text-muted-foreground mt-4">{getDescription()}</p>

            {/* Start Project / Safety Status Section */}
            {!showInstructions ? (
              <Card className="mt-6 p-6 border-2 border-dashed border-warning/50 bg-warning/5">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      {getText('Safety Verification Required', 'የደህንነት ማረጋገጫ ያስፈልጋል', 'Mirkaneessa Nageenya Barbaachisa')}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      {getText(
                        'Complete the safety checklist before accessing step-by-step instructions for this experiment.',
                        'የዚህን ሙከራ ደረጃ በደረጃ መመሪያዎች ከማግኘትዎ በፊት የደህንነት ዝርዝሩን ያጠናቅቁ።',
                        'Qajeelfama tarkaanfii fi tarkaanfii muuxannoo kanaatti argachuun dura tarree nageenya xumurii.'
                      )}
                    </p>
                  </div>
                  <Button size="lg" onClick={handleStartProject} className="gap-2">
                    <Play className="w-5 h-5" />
                    {getText('Start Project', 'ፕሮጀክቱን ጀምር', 'Pirojektii Jalqabi')}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="mt-6 p-6 border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center relative">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-primary">
                      {getText('Safety Verified! Experiment Ready', 'ደህንነት ተረጋግጧል! ሙከራ ዝግጁ ነው', 'Nageenya Mirkanaa\'e! Muuxannoon Qophaa\'e')}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      {getText(
                        'Follow the 3D step-by-step instructions below. Use the Steps tab to navigate through each stage of the experiment.',
                        'ከዚህ በታች ያሉትን የ3D ደረጃ በደረጃ መመሪያዎች ይከተሉ።',
                        'Qajeelfama 3D tarkaanfii tarkaanfiin gadii hordofi.'
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Play className="w-4 h-4" />
                    {getText('Scroll down to the Steps tab to begin', 'ለመጀመር ወደ ደረጃዎች ይሂዱ', 'Jalqabuuf gara Tarkaanfiiwwan bu\'i')}
                  </div>
                </div>
              </Card>
            )}

            <Tabs defaultValue="steps" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="steps" className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {getText('Steps', 'ደረጃዎች', 'Tarkaanfiiwwan')}
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center gap-1">
                  <FlaskConical className="w-4 h-4" />
                  {getText('Materials', 'ቁሳቁሶች', 'Meeshaalee')}
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {getText('Safety', 'ደህንነት', 'Nageenya')}
                </TabsTrigger>
                <TabsTrigger value="science" className="flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  {getText('Science', 'ሳይንስ', 'Saayinsii')}
                </TabsTrigger>
              </TabsList>

              {/* Steps Tab */}
              <TabsContent value="steps" className="space-y-4 mt-4">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{getText('Progress', 'ሂደት', 'Adeemsa')}</span>
                    <span>{currentStep + 1} / {project.steps.length}</span>
                  </div>
                  <Progress value={((currentStep + 1) / project.steps.length) * 100} />
                </div>

                {/* Step content */}
                <Card className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 3D Equipment */}
                    <div className="flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-4 min-h-[200px]">
                      <Lab3DEquipment 
                        type={step.equipment3D || project.animation3D} 
                        size="lg" 
                        isAnimating={true}
                      />
                    </div>

                    {/* Step details */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {step.stepNumber}
                          </span>
                          {getText(step.titleEn, step.titleAm, step.titleOr)}
                        </h3>
                      </div>

                      <p className="text-muted-foreground">
                        {getText(step.descriptionEn, step.descriptionAm, step.descriptionOr)}
                      </p>

                      {step.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{step.duration}</span>
                        </div>
                      )}

                      {step.safetyNote && (
                        <Alert className="border-warning/50 bg-warning/10">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <AlertTitle className="text-warning text-sm">
                            {getText('Safety Note', 'የደህንነት ማስታወሻ', 'Yaadannoo Nageenya')}
                          </AlertTitle>
                          <AlertDescription className="text-warning/80 text-sm">
                            {step.safetyNote}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Step navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {getText('Previous', 'ቀዳሚ', 'Duraa')}
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(project.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === project.steps.length - 1}
                  >
                    {getText('Next', 'ቀጣይ', 'Itti aanuu')}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* All steps overview */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {project.steps.map((s, i) => (
                    <Button
                      key={i}
                      variant={i === currentStep ? "default" : i < currentStep ? "secondary" : "outline"}
                      size="sm"
                      className="relative"
                      onClick={() => setCurrentStep(i)}
                    >
                      {i + 1}
                      {i < currentStep && (
                        <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-bold flex items-center gap-2 mb-3">
                      <Beaker className="w-5 h-5 text-primary" />
                      {getText('Required Equipment', 'የሚያስፈልጉ መሳሪያዎች', 'Meeshaalee Barbaachisan')}
                    </h4>
                    <ul className="space-y-2">
                      {project.requiredEquipment.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-bold flex items-center gap-2 mb-3">
                      <TestTube className="w-5 h-5 text-primary" />
                      {getText('Required Chemicals', 'የሚያስፈልጉ ኬሚካሎች', 'Keemikaalota Barbaachisan')}
                    </h4>
                    <ul className="space-y-2">
                      {project.requiredChemicals.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <FlaskConical className="w-4 h-4 text-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="font-bold flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    {getText('Variations', 'ልዩነቶች', 'Garaagarummaa')}
                  </h4>
                  <ul className="space-y-2">
                    {project.variations.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>

              {/* Safety Tab */}
              <TabsContent value="safety" className="space-y-4 mt-4">
                <Alert className={`border-2 ${safetyColors[project.safetyLevel]}`}>
                  <Shield className="h-5 w-5" />
                  <AlertTitle className="text-lg">
                    {getText('Safety Level:', 'የደህንነት ደረጃ:', 'Sadarkaa Nageenya:')} {project.safetyLevel.toUpperCase()}
                  </AlertTitle>
                  <AlertDescription>
                    {project.safetyLevel === 'low' && getText(
                      'This project uses generally safe materials with minimal risk.',
                      'ይህ ፕሮጀክት በአጠቃላይ ደህንነታቸው የተረጋገጠ ቁሳቁሶችን ይጠቀማል።',
                      'Pirojektiin kun meeshaalee nageenya waliigalaa qaban fayyadama.'
                    )}
                    {project.safetyLevel === 'medium' && getText(
                      'This project requires standard safety equipment and caution.',
                      'ይህ ፕሮጀክት መደበኛ የደህንነት መሳሪያዎች እና ጥንቃቄ ይፈልጋል።',
                      'Pirojektiin kun meeshaalee nageenya idilee fi of-eeggannoo barbaada.'
                    )}
                    {project.safetyLevel === 'high' && getText(
                      'This project involves hazardous materials. Full PPE required!',
                      'ይህ ፕሮጀክት አደገኛ ቁሳቁሶችን ያካትታል። ሙሉ PPE ያስፈልጋል!',
                      'Pirojektiin kun meeshaalee balaa qaban of keessaa qaba. PPE guutuu barbaachisa!'
                    )}
                  </AlertDescription>
                </Alert>

                <Card className="p-4">
                  <h4 className="font-bold mb-3">{getText('Required PPE', 'የሚያስፈልግ PPE', 'PPE Barbaachisu')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <span className="text-2xl">🥽</span>
                      <span className="text-sm">{getText('Safety Goggles', 'የአይን መከላከያ', 'Funyoo Ija')}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <span className="text-2xl">🧤</span>
                      <span className="text-sm">{getText('Gloves', 'ጓንት', 'Guwaantii')}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <span className="text-2xl">🥼</span>
                      <span className="text-sm">{getText('Lab Coat', 'ላብ ኮት', 'Koota Laabii')}</span>
                    </div>
                    {project.safetyLevel === 'high' && (
                      <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <span className="text-2xl">😷</span>
                        <span className="text-sm">{getText('Fume Hood', 'የጭስ ማስወገጃ', 'Huudii Aaraa')}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {project.steps.filter(s => s.safetyNote).length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      {getText('Step-specific Warnings', 'ደረጃ-ተኮር ማስጠንቀቂያዎች', 'Akeekkachiisota Tarkaanfii-murtaa\'aa')}
                    </h4>
                    <ul className="space-y-2">
                      {project.steps.filter(s => s.safetyNote).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm p-2 bg-warning/10 rounded-lg">
                          <span className="font-bold text-warning">Step {s.stepNumber}:</span>
                          <span>{s.safetyNote}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </TabsContent>

              {/* Science Tab */}
              <TabsContent value="science" className="space-y-4 mt-4">
                <Card className="p-4">
                  <h4 className="font-bold flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    {getText('Scientific Explanation', 'ሳይንሳዊ ማብራሪያ', 'Ibsa Saayinsaawaa')}
                  </h4>
                  <p className="text-muted-foreground font-mono bg-muted/50 p-4 rounded-lg">
                    {project.scienceExplanation}
                  </p>
                </Card>

                <Card className="p-4">
                  <h4 className="font-bold flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {getText('Expected Results', 'የሚጠበቁ ውጤቶች', 'Bu\'aawwan Eegaman')}
                  </h4>
                  <p className="text-muted-foreground">
                    {project.expectedResults}
                  </p>
                </Card>

                <Card className="p-4">
                  <h4 className="font-bold mb-3">{getText('Chemistry Topics Covered', 'የተሸፈኑ የኬሚስትሪ ርዕሶች', 'Mata-dureewwan Keemistrii Hammatamanman')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.chemistryTopics.map((topic, i) => (
                      <Badge key={i} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
