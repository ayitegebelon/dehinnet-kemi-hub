import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Atom,
  FlaskConical,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Search,
  Flame,
  Droplets,
  Wind,
  Sparkles,
} from 'lucide-react';

interface Chemical {
  name: string;
  nameAm: string;
  formula: string;
  type: 'acid' | 'base' | 'salt' | 'organic' | 'metal' | 'oxide' | 'other';
  molarMass: number;
}

interface Reaction {
  reactant1: string;
  reactant2: string;
  equation: string;
  products: string[];
  type: string;
  typeAm: string;
  observation: string;
  observationAm: string;
  safety: 'safe' | 'caution' | 'danger';
  safetyNote: string;
  safetyNoteAm: string;
  energy: 'exothermic' | 'endothermic' | 'neutral';
  temperature?: string;
  yield?: string;
}

const CHEMICALS: Chemical[] = [
  { name: 'Hydrochloric Acid', nameAm: 'ሃይድሮክሎሪክ አሲድ', formula: 'HCl', type: 'acid', molarMass: 36.46 },
  { name: 'Sulfuric Acid', nameAm: 'ሰልፊሪክ አሲድ', formula: 'H₂SO₄', type: 'acid', molarMass: 98.08 },
  { name: 'Acetic Acid', nameAm: 'አሴቲክ አሲድ', formula: 'CH₃COOH', type: 'acid', molarMass: 60.05 },
  { name: 'Sodium Hydroxide', nameAm: 'ሶዲየም ሃይድሮክሳይድ', formula: 'NaOH', type: 'base', molarMass: 40.00 },
  { name: 'Potassium Hydroxide', nameAm: 'ፖታሲየም ሃይድሮክሳይድ', formula: 'KOH', type: 'base', molarMass: 56.11 },
  { name: 'Calcium Hydroxide', nameAm: 'ካልሲየም ሃይድሮክሳይድ', formula: 'Ca(OH)₂', type: 'base', molarMass: 74.09 },
  { name: 'Sodium Chloride', nameAm: 'ሶዲየም ክሎራይድ', formula: 'NaCl', type: 'salt', molarMass: 58.44 },
  { name: 'Sodium Bicarbonate', nameAm: 'ሶዲየም ባይካርቦኔት', formula: 'NaHCO₃', type: 'salt', molarMass: 84.01 },
  { name: 'Calcium Carbonate', nameAm: 'ካልሲየም ካርቦኔት', formula: 'CaCO₃', type: 'salt', molarMass: 100.09 },
  { name: 'Iron', nameAm: 'ብረት', formula: 'Fe', type: 'metal', molarMass: 55.85 },
  { name: 'Zinc', nameAm: 'ዚንክ', formula: 'Zn', type: 'metal', molarMass: 65.38 },
  { name: 'Copper Sulfate', nameAm: 'ኮፐር ሰልፌት', formula: 'CuSO₄', type: 'salt', molarMass: 159.61 },
  { name: 'Silver Nitrate', nameAm: 'ሲልቨር ናይትሬት', formula: 'AgNO₃', type: 'salt', molarMass: 169.87 },
  { name: 'Hydrogen Peroxide', nameAm: 'ሃይድሮጂን ፐሮክሳይድ', formula: 'H₂O₂', type: 'other', molarMass: 34.01 },
  { name: 'Ethanol', nameAm: 'ኢታኖል', formula: 'C₂H₅OH', type: 'organic', molarMass: 46.07 },
  { name: 'Water', nameAm: 'ውሃ', formula: 'H₂O', type: 'other', molarMass: 18.02 },
  { name: 'Magnesium', nameAm: 'ማግኒዝየም', formula: 'Mg', type: 'metal', molarMass: 24.31 },
  { name: 'Potassium Permanganate', nameAm: 'ፖታሲየም ፐርማንጋኔት', formula: 'KMnO₄', type: 'salt', molarMass: 158.03 },
];

const REACTIONS: Reaction[] = [
  { reactant1: 'HCl', reactant2: 'NaOH', equation: 'HCl + NaOH → NaCl + H₂O', products: ['NaCl', 'H₂O'], type: 'Neutralization', typeAm: 'ገለልተኛ ምላሽ', observation: 'Solution heats up, pH becomes neutral (≈7). Clear solution remains.', observationAm: 'መፍትሄው ይሞቃል፣ pH ገለልተኛ ይሆናል (≈7)።', safety: 'caution', safetyNote: 'Exothermic reaction. Use eye protection.', safetyNoteAm: 'ሙቀት የሚሰጥ ምላሽ። የአይን መከላከያ ይጠቀሙ።', energy: 'exothermic', temperature: '25-40°C', yield: '~95%' },
  { reactant1: 'HCl', reactant2: 'NaHCO₃', equation: 'HCl + NaHCO₃ → NaCl + H₂O + CO₂↑', products: ['NaCl', 'H₂O', 'CO₂'], type: 'Acid-Carbonate', typeAm: 'አሲድ-ካርቦኔት', observation: 'Vigorous bubbling (CO₂ gas released). Solution fizzes.', observationAm: 'ጠንካራ አረፋ (CO₂ ጋዝ ይለቀቃል)። መፍትሄው ያረፋል።', safety: 'safe', safetyNote: 'Safe reaction. Good for demonstrations.', safetyNoteAm: 'ደህንነቱ የተጠበቀ ምላሽ።', energy: 'endothermic', yield: '~98%' },
  { reactant1: 'HCl', reactant2: 'CaCO₃', equation: '2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑', products: ['CaCl₂', 'H₂O', 'CO₂'], type: 'Acid-Carbonate', typeAm: 'አሲድ-ካርቦኔት', observation: 'Calcium carbonate dissolves with effervescence. CO₂ gas produced.', observationAm: 'ካልሲየም ካርቦኔት በአረፋ ይቀልጣል።', safety: 'caution', safetyNote: 'Use dilute HCl. Wear gloves.', safetyNoteAm: 'የተቀላቀለ HCl ይጠቀሙ። ጓንት ያድርጉ።', energy: 'exothermic', yield: '~90%' },
  { reactant1: 'H₂SO₄', reactant2: 'NaOH', equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', products: ['Na₂SO₄', 'H₂O'], type: 'Neutralization', typeAm: 'ገለልተኛ ምላሽ', observation: 'Strongly exothermic. Solution becomes hot rapidly.', observationAm: 'በጣም ሙቀት-ሰጪ። መፍትሄው በፍጥነት ይሞቃል።', safety: 'danger', safetyNote: 'Highly exothermic! Add acid to base slowly. Full PPE required.', safetyNoteAm: 'በጣም ሙቀት-ሰጪ! አሲድን ወደ ቤዝ ቀስ ብለው ይጨምሩ።', energy: 'exothermic', temperature: '40-80°C', yield: '~97%' },
  { reactant1: 'Zn', reactant2: 'HCl', equation: 'Zn + 2HCl → ZnCl₂ + H₂↑', products: ['ZnCl₂', 'H₂'], type: 'Single Displacement', typeAm: 'ነጠላ ምትክ', observation: 'Zinc dissolves. Hydrogen gas bubbles vigorously. Flammable gas!', observationAm: 'ዚንክ ይቀልጣል። ሃይድሮጂን ጋዝ ያረፋል። ተቀጣጣይ ጋዝ!', safety: 'danger', safetyNote: 'H₂ is flammable! No open flames. Use fume hood.', safetyNoteAm: 'H₂ ተቀጣጣይ ነው! ክፍት እሳት አይጠቀሙ።', energy: 'exothermic', temperature: '25-50°C', yield: '~85%' },
  { reactant1: 'Fe', reactant2: 'CuSO₄', equation: 'Fe + CuSO₄ → FeSO₄ + Cu↓', products: ['FeSO₄', 'Cu'], type: 'Single Displacement', typeAm: 'ነጠላ ምትክ', observation: 'Iron nail turns copper-colored. Blue solution fades to green.', observationAm: 'የብረት ሚስማር ወደ የመዳብ ቀለም ይለወጣል። ሰማያዊ መፍትሄ ወደ አረንጓዴ ይለወጣል።', safety: 'caution', safetyNote: 'Wear gloves. Copper sulfate is irritant.', safetyNoteAm: 'ጓንት ያድርጉ። ኮፐር ሰልፌት አበሳጫ ነው።', energy: 'exothermic', yield: '~80%' },
  { reactant1: 'AgNO₃', reactant2: 'NaCl', equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃', products: ['AgCl', 'NaNO₃'], type: 'Double Displacement', typeAm: 'ድርብ ምትክ', observation: 'White curdy precipitate of AgCl forms immediately.', observationAm: 'ነጭ ቁልቁል ያለ ክምር (AgCl) ወዲያውኑ ይፈጠራል።', safety: 'caution', safetyNote: 'Silver nitrate stains skin. Wear gloves.', safetyNoteAm: 'ሲልቨር ናይትሬት ቆዳን ያጨልማል። ጓንት ያድርጉ።', energy: 'neutral', yield: '~99%' },
  { reactant1: 'CH₃COOH', reactant2: 'NaHCO₃', equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑', products: ['CH₃COONa', 'H₂O', 'CO₂'], type: 'Acid-Carbonate', typeAm: 'አሲድ-ካርቦኔት', observation: 'Classic volcano reaction! Fizzing and foaming with CO₂ release.', observationAm: 'ክላሲክ የእሳተ ገሞራ ምላሽ! አረፋና ፎም ከ CO₂ ልቀት ጋር።', safety: 'safe', safetyNote: 'Completely safe. Great for kids.', safetyNoteAm: 'ሙሉ በሙሉ ደህንነቱ የተጠበቀ። ለልጆች ጥሩ።', energy: 'endothermic', yield: '~95%' },
  { reactant1: 'Mg', reactant2: 'HCl', equation: 'Mg + 2HCl → MgCl₂ + H₂↑', products: ['MgCl₂', 'H₂'], type: 'Single Displacement', typeAm: 'ነጠላ ምትክ', observation: 'Magnesium dissolves rapidly with intense bubbling. Very exothermic.', observationAm: 'ማግኒዝየም በፍጥነት ይቀልጣል ከጠንካራ አረፋ ጋር።', safety: 'danger', safetyNote: 'Very vigorous! H₂ gas is explosive. No flames nearby.', safetyNoteAm: 'በጣም ጠንካራ! H₂ ጋዝ ፈንጂ ነው። በአቅራቢያ እሳት አይኑር።', energy: 'exothermic', temperature: '30-60°C', yield: '~92%' },
  { reactant1: 'H₂O₂', reactant2: 'KMnO₄', equation: '5H₂O₂ + 2KMnO₄ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 8H₂O + 5O₂↑', products: ['MnSO₄', 'O₂', 'H₂O'], type: 'Redox', typeAm: 'ሬዶክስ', observation: 'Purple KMnO₄ decolorizes. Oxygen gas released. Dramatic color change!', observationAm: 'ወይን ጠጅ KMnO₄ ቀለሙ ይጠፋል። ኦክስጂን ጋዝ ይለቀቃል።', safety: 'danger', safetyNote: 'KMnO₄ is a strong oxidizer. Use dilute solutions. Full PPE.', safetyNoteAm: 'KMnO₄ ጠንካራ ኦክሲዳይዘር ነው። የተቀላቀሉ መፍትሄዎችን ይጠቀሙ።', energy: 'exothermic', temperature: '25-70°C', yield: '~88%' },
  { reactant1: 'Zn', reactant2: 'CuSO₄', equation: 'Zn + CuSO₄ → ZnSO₄ + Cu↓', products: ['ZnSO₄', 'Cu'], type: 'Single Displacement', typeAm: 'ነጠላ ምትክ', observation: 'Zinc strip turns reddish-brown (copper deposits). Blue solution fades.', observationAm: 'የዚንክ ቁራጭ ቀይ-ቡናማ ይሆናል (መዳብ ይቀርባል)።', safety: 'caution', safetyNote: 'Wear gloves. Avoid skin contact with CuSO₄.', safetyNoteAm: 'ጓንት ያድርጉ።', energy: 'exothermic', yield: '~85%' },
  { reactant1: 'C₂H₅OH', reactant2: 'CH₃COOH', equation: 'C₂H₅OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O', products: ['CH₃COOC₂H₅', 'H₂O'], type: 'Esterification', typeAm: 'ኢስተሪፊኬሽን', observation: 'Fruity sweet smell of ethyl acetate forms. Requires acid catalyst and heat.', observationAm: 'የፍራፍሬ ጣፋጭ ሽታ ያለው ኢቲል አሴቴት ይፈጠራል።', safety: 'danger', safetyNote: 'Use H₂SO₄ catalyst carefully. Ethanol is flammable. Fume hood required.', safetyNoteAm: 'H₂SO₄ ካታሊስት በጥንቃቄ ይጠቀሙ። ኢታኖል ተቀጣጣይ ነው።', energy: 'endothermic', temperature: '60-80°C', yield: '~65%' },
];

const ReactionSimulatorPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';

  const [selectedReactant1, setSelectedReactant1] = useState<Chemical | null>(null);
  const [selectedReactant2, setSelectedReactant2] = useState<Chemical | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getText = (en: string, am: string) => isAm ? am : en;

  const filteredChemicals = useMemo(() => {
    if (!searchTerm) return CHEMICALS;
    const q = searchTerm.toLowerCase();
    return CHEMICALS.filter(c =>
      c.name.toLowerCase().includes(q) || c.formula.toLowerCase().includes(q) || c.nameAm.includes(searchTerm)
    );
  }, [searchTerm]);

  const reaction = useMemo(() => {
    if (!selectedReactant1 || !selectedReactant2) return null;
    return REACTIONS.find(r =>
      (r.reactant1 === selectedReactant1.formula && r.reactant2 === selectedReactant2.formula) ||
      (r.reactant1 === selectedReactant2.formula && r.reactant2 === selectedReactant1.formula)
    ) || null;
  }, [selectedReactant1, selectedReactant2]);

  const handleReact = () => {
    if (!selectedReactant1 || !selectedReactant2) return;
    setIsAnimating(true);
    setShowResult(false);
    setTimeout(() => {
      setShowResult(true);
      setIsAnimating(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedReactant1(null);
    setSelectedReactant2(null);
    setShowResult(false);
    setIsAnimating(false);
  };

  const typeColors: Record<string, string> = {
    acid: 'bg-red-500/20 text-red-400 border-red-500/30',
    base: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    salt: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    metal: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    organic: 'bg-green-500/20 text-green-400 border-green-500/30',
    oxide: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    other: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const safetyIcons = { safe: CheckCircle2, caution: AlertTriangle, danger: AlertTriangle };
  const safetyColors = {
    safe: 'border-green-500/50 bg-green-500/10 text-green-400',
    caution: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    danger: 'border-red-500/50 bg-red-500/10 text-red-400',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center animate-float">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {getText('Reaction Simulator', 'የምላሽ ሲሙሌተር')}
            </h1>
            <p className="text-muted-foreground">
              {getText('Select two chemicals and simulate their reaction', 'ሁለት ኬሚካሎችን ይምረጡ እና ምላሻቸውን ይመልከቱ')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chemical Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={getText('Search chemicals...', 'ኬሚካሎችን ፈልግ...')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 pr-4">
                {filteredChemicals.map(chem => {
                  const isSelected = chem === selectedReactant1 || chem === selectedReactant2;
                  return (
                    <Card
                      key={chem.formula}
                      className={`p-3 cursor-pointer transition-all hover:scale-[1.02] ${
                        isSelected ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          if (chem === selectedReactant1) setSelectedReactant1(null);
                          else setSelectedReactant2(null);
                          setShowResult(false);
                        } else if (!selectedReactant1) {
                          setSelectedReactant1(chem);
                          setShowResult(false);
                        } else if (!selectedReactant2) {
                          setSelectedReactant2(chem);
                          setShowResult(false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{isAm ? chem.nameAm : chem.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{chem.formula} · {chem.molarMass} g/mol</p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${typeColors[chem.type]}`}>
                          {chem.type}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Reaction Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Chemicals Display */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <Card className={`p-6 text-center min-h-[160px] flex flex-col items-center justify-center ${selectedReactant1 ? 'border-primary/50 bg-primary/5' : 'border-dashed'}`}>
                {selectedReactant1 ? (
                  <>
                    <div className="text-3xl font-bold font-mono text-primary mb-2">{selectedReactant1.formula}</div>
                    <p className="text-sm text-muted-foreground">{isAm ? selectedReactant1.nameAm : selectedReactant1.name}</p>
                    <Badge className={`mt-2 ${typeColors[selectedReactant1.type]}`}>{selectedReactant1.type}</Badge>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">{getText('Select Reactant 1', 'ምላሽ ሰጪ 1 ምረጥ')}</p>
                )}
              </Card>

              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAnimating ? 'bg-primary animate-pulse' : 'bg-muted'}`}>
                  <Zap className={`w-6 h-6 ${isAnimating ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <span className="text-2xl font-bold text-muted-foreground">+</span>
              </div>

              <Card className={`p-6 text-center min-h-[160px] flex flex-col items-center justify-center ${selectedReactant2 ? 'border-accent/50 bg-accent/5' : 'border-dashed'}`}>
                {selectedReactant2 ? (
                  <>
                    <div className="text-3xl font-bold font-mono text-accent mb-2">{selectedReactant2.formula}</div>
                    <p className="text-sm text-muted-foreground">{isAm ? selectedReactant2.nameAm : selectedReactant2.name}</p>
                    <Badge className={`mt-2 ${typeColors[selectedReactant2.type]}`}>{selectedReactant2.type}</Badge>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">{getText('Select Reactant 2', 'ምላሽ ሰጪ 2 ምረጥ')}</p>
                )}
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={handleReact} disabled={!selectedReactant1 || !selectedReactant2 || isAnimating} className="gap-2">
                <FlaskConical className="w-5 h-5" />
                {isAnimating ? getText('Reacting...', 'በምላሽ ላይ...') : getText('Simulate Reaction', 'ምላሽ ጀምር')}
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset} className="gap-2">
                {getText('Reset', 'ዳግም ጀምር')}
              </Button>
            </div>

            {/* Reaction Animation */}
            {isAnimating && (
              <div className="flex justify-center py-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="absolute inset-4 rounded-full bg-accent/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute inset-8 rounded-full bg-primary/40 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-spin" />
                  </div>
                </div>
              </div>
            )}

            {/* Reaction Result */}
            {showResult && (
              <div className="space-y-4 animate-fade-in-up">
                {reaction ? (
                  <>
                    {/* Balanced Equation */}
                    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/30">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Atom className="w-5 h-5 text-primary" />
                        {getText('Balanced Equation', 'ሚዛናዊ ስሌት')}
                      </h3>
                      <div className="text-2xl font-mono font-bold text-center py-4 bg-background/50 rounded-lg">
                        {reaction.equation}
                      </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Reaction Info */}
                      <Card className="p-4 space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-primary" />
                          {getText('Reaction Details', 'የምላሽ ዝርዝሮች')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">{getText('Type', 'ዓይነት')}</span><Badge variant="secondary">{isAm ? reaction.typeAm : reaction.type}</Badge></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">{getText('Energy', 'ኢነርጂ')}</span>
                            <Badge variant="outline" className="gap-1">
                              {reaction.energy === 'exothermic' && <Flame className="w-3 h-3" />}
                              {reaction.energy === 'endothermic' && <Droplets className="w-3 h-3" />}
                              {reaction.energy}
                            </Badge>
                          </div>
                          {reaction.temperature && <div className="flex justify-between"><span className="text-muted-foreground">{getText('Temperature', 'ሙቀት')}</span><span className="font-mono">{reaction.temperature}</span></div>}
                          {reaction.yield && <div className="flex justify-between"><span className="text-muted-foreground">{getText('Yield', 'ምርት')}</span><span className="font-mono font-bold text-primary">{reaction.yield}</span></div>}
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1">{getText('Products', 'ውጤቶች')}</p>
                          <div className="flex flex-wrap gap-1">
                            {reaction.products.map((p, i) => <Badge key={i} className="font-mono">{p}</Badge>)}
                          </div>
                        </div>
                      </Card>

                      {/* Observation */}
                      <Card className="p-4 space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {getText('What You\'ll See', 'ምን ታያለህ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isAm ? reaction.observationAm : reaction.observation}
                        </p>
                      </Card>
                    </div>

                    {/* Safety */}
                    <Alert className={`${safetyColors[reaction.safety]}`}>
                      {React.createElement(safetyIcons[reaction.safety], { className: 'h-5 w-5' })}
                      <AlertTitle>{getText('Safety Warning', 'የደህንነት ማስጠንቀቂያ')}</AlertTitle>
                      <AlertDescription>{isAm ? reaction.safetyNoteAm : reaction.safetyNote}</AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <Alert className="border-muted">
                    <Wind className="h-5 w-5" />
                    <AlertTitle>{getText('No Known Reaction', 'የሚታወቅ ምላሽ የለም')}</AlertTitle>
                    <AlertDescription>
                      {getText(
                        'These chemicals do not have a notable reaction in our database. They may not react, or the reaction requires special conditions.',
                        'እነዚህ ኬሚካሎች በመረጃ ቋታችን ውስጥ ታዋቂ ምላሽ የላቸውም።'
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReactionSimulatorPage;
