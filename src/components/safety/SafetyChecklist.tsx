import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Hand, 
  Wind, 
  Droplet, 
  Phone, 
  Users, 
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Award,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  iconType: 'goggles' | 'gloves' | 'ventilation' | 'water' | 'phone' | 'buddy' | 'chemicals' | 'clothing';
  labelEn: string;
  labelAm: string;
  descEn: string;
  descAm: string;
  required: boolean;
  category: 'ppe' | 'environment' | 'emergency' | 'preparation';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // PPE
  { id: 'goggles', iconType: 'goggles', labelEn: 'Safety Goggles', labelAm: 'የደህንነት መነፅር', descEn: 'Chemical splash protection', descAm: 'ከኬሚካል ፍንጣሪ መከላከያ', required: true, category: 'ppe' },
  { id: 'gloves', iconType: 'gloves', labelEn: 'Chemical Gloves', labelAm: 'የኬሚካል ጓንቶች', descEn: 'Nitrile or rubber gloves', descAm: 'ናይትራይል ወይም ጎማ ጓንቶች', required: true, category: 'ppe' },
  { id: 'labcoat', iconType: 'clothing', labelEn: 'Lab Coat / Apron', labelAm: 'ላብ ኮት / ፎጣ', descEn: 'Protective clothing', descAm: 'የመከላከያ ልብስ', required: true, category: 'ppe' },
  
  // Environment
  { id: 'ventilation', iconType: 'ventilation', labelEn: 'Good Ventilation', labelAm: 'ጥሩ አየር ማናፈሻ', descEn: 'Open windows or use fan', descAm: 'መስኮቶችን ይክፈቱ ወይም ደጋፊ ይጠቀሙ', required: true, category: 'environment' },
  { id: 'workspace', iconType: 'chemicals', labelEn: 'Clear Workspace', labelAm: 'ንጹህ የስራ ቦታ', descEn: 'No clutter, clean surfaces', descAm: 'ብጥብጥ የሌለበት፣ ንጹህ ወለል', required: true, category: 'environment' },
  
  // Emergency
  { id: 'water', iconType: 'water', labelEn: 'Emergency Water', labelAm: 'ድንገተኛ ውሃ', descEn: 'Clean water for rinsing', descAm: 'ለማጠብ ንጹህ ውሃ', required: true, category: 'emergency' },
  { id: 'phone', iconType: 'phone', labelEn: 'Emergency Phone', labelAm: 'ድንገተኛ ስልክ', descEn: 'Phone ready with emergency numbers', descAm: 'የአደጋ ቁጥሮች ያለው ስልክ ዝግጁ', required: true, category: 'emergency' },
  { id: 'buddy', iconType: 'buddy', labelEn: 'Safety Buddy', labelAm: 'ረዳት ሰው', descEn: 'Another person nearby', descAm: 'ሌላ ሰው በአቅራቢያ', required: false, category: 'emergency' },
  
  // Preparation
  { id: 'readRecipe', iconType: 'chemicals', labelEn: 'Read Recipe Completely', labelAm: 'ሪሰፒውን ሙሉ ያንብቡ', descEn: 'Understand all steps first', descAm: 'መጀመሪያ ሁሉንም ደረጃዎች ይረዱ', required: true, category: 'preparation' },
  { id: 'materials', iconType: 'chemicals', labelEn: 'All Materials Ready', labelAm: 'ሁሉም ቁሳቁሶች ዝግጁ', descEn: 'Gather everything before starting', descAm: 'ከመጀመር በፊት ሁሉንም ያሰባስቡ', required: true, category: 'preparation' },
];

const getIcon = (iconType: string, className?: string) => {
  const icons: Record<string, React.ReactNode> = {
    goggles: <Eye className={className} />,
    gloves: <Hand className={className} />,
    ventilation: <Wind className={className} />,
    water: <Droplet className={className} />,
    phone: <Phone className={className} />,
    buddy: <Users className={className} />,
    chemicals: <FlaskConical className={className} />,
    clothing: <Shield className={className} />,
  };
  return icons[iconType] || <Shield className={className} />;
};

const categoryNames = {
  ppe: { en: 'Personal Protective Equipment', am: 'የግል የመከላከያ መሳሪያ' },
  environment: { en: 'Environment Check', am: 'የአካባቢ ቁጥጥር' },
  emergency: { en: 'Emergency Preparedness', am: 'ለአደጋ ዝግጁነት' },
  preparation: { en: 'Preparation', am: 'ዝግጅት' },
};

interface SafetyChecklistProps {
  onComplete?: () => void;
  experimentType?: string;
}

const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ onComplete, experimentType }) => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const requiredItems = CHECKLIST_ITEMS.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => checkedItems[item.id]).length;
  const totalCompleted = Object.values(checkedItems).filter(Boolean).length;
  const progress = (completedRequired / requiredItems.length) * 100;
  const allRequiredCompleted = completedRequired === requiredItems.length;
  
  const groupedItems = CHECKLIST_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-safety-light flex items-center justify-center animate-pulse-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {isAmharic ? 'የደህንነት የቁጥጥር ዝርዝር' : 'Safety Checklist'}
            </h2>
            <p className="text-muted-foreground">
              {isAmharic ? 'ከመጀመርዎ በፊት ይፈትሹ' : 'Verify before starting'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={allRequiredCompleted ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {totalCompleted}/{CHECKLIST_ITEMS.length} {isAmharic ? 'ተጠናቋል' : 'completed'}
          </Badge>
        </div>
      </div>
      
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isAmharic ? 'አስፈላጊ ንጥሎች' : 'Required Items'}
            </span>
            <span className="text-sm text-muted-foreground">
              {completedRequired}/{requiredItems.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 progress-animated" />
          <p className="mt-2 text-sm text-muted-foreground">
            {allRequiredCompleted 
              ? (isAmharic ? '✅ ሁሉም አስፈላጊ ንጥሎች ተጠናቅቀዋል!' : '✅ All required items completed!')
              : (isAmharic ? 'ሁሉንም * ንጥሎች ያጠናቅቁ' : 'Complete all * items to proceed')}
          </p>
        </CardContent>
      </Card>
      
      {/* Checklist Groups */}
      <div className="grid gap-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {category === 'ppe' && <Hand className="w-5 h-5 text-primary" />}
                {category === 'environment' && <Wind className="w-5 h-5 text-primary" />}
                {category === 'emergency' && <Phone className="w-5 h-5 text-primary" />}
                {category === 'preparation' && <FlaskConical className="w-5 h-5 text-primary" />}
                {isAmharic ? categoryNames[category as keyof typeof categoryNames].am : categoryNames[category as keyof typeof categoryNames].en}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    'safety-item relative cursor-pointer',
                    checkedItems[item.id] && 'completed'
                  )}
                >
                  <Checkbox
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {isAmharic ? item.labelAm : item.labelEn}
                      </span>
                      {item.required && (
                        <span className="text-danger text-sm">*</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? item.descAm : item.descEn}
                    </p>
                  </div>
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    checkedItems[item.id] 
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {getIcon(item.iconType, 'w-5 h-5')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Action Buttons */}
      {allRequiredCompleted ? (
        <Alert className="border-primary/50 bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary">
            {isAmharic ? 'ደህንነት ተረጋግጧል!' : 'Safety Verified!'}
          </AlertTitle>
          <AlertDescription>
            {isAmharic 
              ? 'ሁሉም አስፈላጊ የደህንነት ፍተሻዎች ተጠናቅቀዋል። ሙከራዎን መጀመር ይችላሉ።'
              : 'All required safety checks completed. You may begin your experiment.'}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-warning/50 bg-warning/5">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <AlertTitle className="text-warning">
            {isAmharic ? 'ደህንነት አልተጠናቀቀም' : 'Safety Incomplete'}
          </AlertTitle>
          <AlertDescription>
            {isAmharic 
              ? 'ሙከራ ከመጀመርዎ በፊት ሁሉንም አስፈላጊ (*) ንጥሎች ያጠናቅቁ።'
              : 'Complete all required (*) items before starting your experiment.'}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-3">
        <Button
          onClick={onComplete}
          disabled={!allRequiredCompleted}
          className="flex-1"
          size="lg"
        >
          {allRequiredCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {isAmharic ? 'ሙከራ ይጀምሩ' : 'Start Experiment'}
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              {isAmharic ? 'ዝርዝሩን ያጠናቅቁ' : 'Complete Checklist'}
            </>
          )}
        </Button>
      </div>
      
      {/* Safety Score Badge */}
      {allRequiredCompleted && (
        <div className="flex justify-center animate-scale-in-bounce">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white">
            <Award className="w-6 h-6" />
            <span className="font-bold">
              {isAmharic ? 'የደህንነት ነጥብ: +10' : 'Safety Score: +10'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyChecklist;
