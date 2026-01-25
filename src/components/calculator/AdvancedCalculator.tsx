import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calculator, 
  FlaskConical, 
  Beaker, 
  AlertTriangle, 
  Shield, 
  Clock, 
  DollarSign,
  Droplet,
  Sparkles,
  CheckCircle2,
  Info,
  Scale,
  Atom,
  ArrowRight,
  Percent,
  TestTube,
  Zap,
  BookOpen
} from 'lucide-react';

// ============ MOLARITY CALCULATOR ============
interface MolarityResult {
  molarity: number;
  moles: number;
  massNeeded: number;
}

// Common chemicals with molar masses
const CHEMICALS = {
  NaOH: { name: 'Sodium Hydroxide', nameAm: 'ሶዲየም ሃይድሮክሳይድ', molarMass: 40.00, formula: 'NaOH' },
  HCl: { name: 'Hydrochloric Acid', nameAm: 'ሃይድሮክሎሪክ አሲድ', molarMass: 36.46, formula: 'HCl' },
  H2SO4: { name: 'Sulfuric Acid', nameAm: 'ሰልፈሪክ አሲድ', molarMass: 98.08, formula: 'H₂SO₄' },
  NaCl: { name: 'Sodium Chloride', nameAm: 'ሶዲየም ክሎራይድ', molarMass: 58.44, formula: 'NaCl' },
  KOH: { name: 'Potassium Hydroxide', nameAm: 'ፖታሲየም ሃይድሮክሳይድ', molarMass: 56.11, formula: 'KOH' },
  CuSO4: { name: 'Copper Sulfate', nameAm: 'ኮፐር ሰልፌት', molarMass: 159.61, formula: 'CuSO₄' },
  AgNO3: { name: 'Silver Nitrate', nameAm: 'ሲልቨር ናይትሬት', molarMass: 169.87, formula: 'AgNO₃' },
  NaHCO3: { name: 'Sodium Bicarbonate', nameAm: 'ሶዲየም ባይካርቦኔት', molarMass: 84.01, formula: 'NaHCO₃' },
  KMnO4: { name: 'Potassium Permanganate', nameAm: 'ፖታሲየም ፐርማንጋኔት', molarMass: 158.03, formula: 'KMnO₄' },
  CaCO3: { name: 'Calcium Carbonate', nameAm: 'ካልሲየም ካርቦኔት', molarMass: 100.09, formula: 'CaCO₃' },
};

// ============ STOICHIOMETRY DATA ============
const REACTIONS = {
  acidBase: {
    name: 'Acid-Base Neutralization',
    nameAm: 'አሲድ-ቤዝ ገለልተኝነት',
    equation: 'HCl + NaOH → NaCl + H₂O',
    reactants: [
      { formula: 'HCl', coefficient: 1, molarMass: 36.46 },
      { formula: 'NaOH', coefficient: 1, molarMass: 40.00 }
    ],
    products: [
      { formula: 'NaCl', coefficient: 1, molarMass: 58.44 },
      { formula: 'H₂O', coefficient: 1, molarMass: 18.02 }
    ]
  },
  combustion: {
    name: 'Methane Combustion',
    nameAm: 'ሚቴን ማቃጠል',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactants: [
      { formula: 'CH₄', coefficient: 1, molarMass: 16.04 },
      { formula: 'O₂', coefficient: 2, molarMass: 32.00 }
    ],
    products: [
      { formula: 'CO₂', coefficient: 1, molarMass: 44.01 },
      { formula: 'H₂O', coefficient: 2, molarMass: 18.02 }
    ]
  },
  precipitation: {
    name: 'Silver Chloride Precipitation',
    nameAm: 'የሲልቨር ክሎራይድ ማዘቅዘቅ',
    equation: 'AgNO₃ + NaCl → AgCl + NaNO₃',
    reactants: [
      { formula: 'AgNO₃', coefficient: 1, molarMass: 169.87 },
      { formula: 'NaCl', coefficient: 1, molarMass: 58.44 }
    ],
    products: [
      { formula: 'AgCl', coefficient: 1, molarMass: 143.32 },
      { formula: 'NaNO₃', coefficient: 1, molarMass: 84.99 }
    ]
  },
  decomposition: {
    name: 'Calcium Carbonate Decomposition',
    nameAm: 'የካልሲየም ካርቦኔት መበስበስ',
    equation: '2CaCO₃ → 2CaO + 2CO₂',
    reactants: [
      { formula: 'CaCO₃', coefficient: 2, molarMass: 100.09 }
    ],
    products: [
      { formula: 'CaO', coefficient: 2, molarMass: 56.08 },
      { formula: 'CO₂', coefficient: 2, molarMass: 44.01 }
    ]
  },
  saponification: {
    name: 'Saponification (Soap Making)',
    nameAm: 'ሳፖኒፊኬሽን (ሳሙና መሥራት)',
    equation: 'Fat + 3NaOH → Glycerol + 3Soap',
    reactants: [
      { formula: 'Tristearin', coefficient: 1, molarMass: 891.48 },
      { formula: 'NaOH', coefficient: 3, molarMass: 40.00 }
    ],
    products: [
      { formula: 'Glycerol', coefficient: 1, molarMass: 92.09 },
      { formula: 'Sodium Stearate', coefficient: 3, molarMass: 306.46 }
    ]
  }
};

const AdvancedCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';

  // ============ MOLARITY STATE ============
  const [selectedChemical, setSelectedChemical] = useState('NaOH');
  const [desiredMolarity, setDesiredMolarity] = useState(1);
  const [solutionVolume, setSolutionVolume] = useState(1000);
  const [customMolarMass, setCustomMolarMass] = useState(0);
  const [useCustom, setUseCustom] = useState(false);

  // ============ DILUTION STATE ============
  const [c1, setC1] = useState(12); // Initial concentration
  const [v1, setV1] = useState(0); // Initial volume (calculated)
  const [c2, setC2] = useState(1); // Final concentration
  const [v2, setV2] = useState(1000); // Final volume

  // ============ STOICHIOMETRY STATE ============
  const [selectedReaction, setSelectedReaction] = useState<keyof typeof REACTIONS>('acidBase');
  const [reactantMass, setReactantMass] = useState(100);
  const [limitingReactantIndex, setLimitingReactantIndex] = useState(0);

  // ============ MOLARITY CALCULATION ============
  const molarityResult = useMemo<MolarityResult>(() => {
    const molarMass = useCustom ? customMolarMass : CHEMICALS[selectedChemical as keyof typeof CHEMICALS].molarMass;
    const volumeInLiters = solutionVolume / 1000;
    const moles = desiredMolarity * volumeInLiters;
    const massNeeded = moles * molarMass;

    return {
      molarity: desiredMolarity,
      moles: Math.round(moles * 10000) / 10000,
      massNeeded: Math.round(massNeeded * 100) / 100
    };
  }, [selectedChemical, desiredMolarity, solutionVolume, customMolarMass, useCustom]);

  // ============ DILUTION CALCULATION ============
  const dilutionResult = useMemo(() => {
    // C1V1 = C2V2, solving for V1
    const calculatedV1 = (c2 * v2) / c1;
    const waterToAdd = v2 - calculatedV1;
    const dilutionFactor = c1 / c2;

    return {
      v1: Math.round(calculatedV1 * 100) / 100,
      waterToAdd: Math.round(waterToAdd * 100) / 100,
      dilutionFactor: Math.round(dilutionFactor * 100) / 100
    };
  }, [c1, c2, v2]);

  // ============ STOICHIOMETRY CALCULATION ============
  const stoichiometryResult = useMemo(() => {
    const reaction = REACTIONS[selectedReaction];
    const limitingReactant = reaction.reactants[limitingReactantIndex];
    
    // Calculate moles of limiting reactant
    const molesLimiting = reactantMass / limitingReactant.molarMass;
    
    // Calculate amounts of all products based on limiting reactant
    const products = reaction.products.map(product => {
      const molesProduct = (molesLimiting / limitingReactant.coefficient) * product.coefficient;
      const massProduct = molesProduct * product.molarMass;
      return {
        formula: product.formula,
        moles: Math.round(molesProduct * 10000) / 10000,
        mass: Math.round(massProduct * 100) / 100
      };
    });

    // Calculate required amounts of other reactants
    const reactants = reaction.reactants.map((reactant, i) => {
      if (i === limitingReactantIndex) {
        return {
          formula: reactant.formula,
          moles: Math.round(molesLimiting * 10000) / 10000,
          mass: reactantMass,
          isLimiting: true
        };
      }
      const molesRequired = (molesLimiting / limitingReactant.coefficient) * reactant.coefficient;
      const massRequired = molesRequired * reactant.molarMass;
      return {
        formula: reactant.formula,
        moles: Math.round(molesRequired * 10000) / 10000,
        mass: Math.round(massRequired * 100) / 100,
        isLimiting: false
      };
    });

    return { reactants, products, molesLimiting };
  }, [selectedReaction, reactantMass, limitingReactantIndex]);

  const chem = CHEMICALS[selectedChemical as keyof typeof CHEMICALS];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center animate-pulse">
          <Calculator className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">
            {isAmharic ? 'የላቁ ኬሚስትሪ ካልኩሌተር' : 'Advanced Chemistry Calculator'}
          </h2>
          <p className="text-muted-foreground">
            {isAmharic ? 'ሞላሪቲ፣ ዲሉሽን፣ ስቶይኪዮሜትሪ' : 'Molarity, Dilution, Stoichiometry'}
          </p>
        </div>
      </div>

      {/* Safety Warning */}
      <Alert className="border-warning/50 bg-warning/10">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <AlertTitle className="text-warning">
          {isAmharic ? 'የደህንነት ማስጠንቀቂያ' : 'Safety Warning'}
        </AlertTitle>
        <AlertDescription className="text-warning/80">
          {isAmharic 
            ? 'ኬሚካሎችን ሲይዙ ሁልጊዜ PPE ይልበሱ። ትክክለኛ መለኪያዎች ለደህንነት ወሳኝ ናቸው!'
            : 'Always wear PPE when handling chemicals. Accurate measurements are critical for safety!'}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="molarity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="molarity" className="flex flex-col items-center gap-1 py-3">
            <Beaker className="w-5 h-5" />
            <span className="text-xs">{isAmharic ? 'ሞላሪቲ' : 'Molarity'}</span>
          </TabsTrigger>
          <TabsTrigger value="dilution" className="flex flex-col items-center gap-1 py-3">
            <Droplet className="w-5 h-5" />
            <span className="text-xs">{isAmharic ? 'ዲሉሽን' : 'Dilution'}</span>
          </TabsTrigger>
          <TabsTrigger value="stoichiometry" className="flex flex-col items-center gap-1 py-3">
            <Scale className="w-5 h-5" />
            <span className="text-xs">{isAmharic ? 'ስቶይኪዮሜትሪ' : 'Stoichiometry'}</span>
          </TabsTrigger>
        </TabsList>

        {/* ============ MOLARITY CALCULATOR ============ */}
        <TabsContent value="molarity" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="w-5 h-5 text-primary icon-pulse" />
                  {isAmharic ? 'የሞላሪቲ ግብዓቶች' : 'Molarity Inputs'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'M = n / V (mol/L)' : 'M = n / V (mol/L)'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    {isAmharic ? 'ኬሚካል ይምረጡ' : 'Select Chemical'}
                  </Label>
                  <Select value={selectedChemical} onValueChange={setSelectedChemical}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CHEMICALS).map(([key, chem]) => (
                        <SelectItem key={key} value={key}>
                          <span className="font-mono">{chem.formula}</span> - {isAmharic ? chem.nameAm : chem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {isAmharic ? 'የሞላር ብዛት' : 'Molar Mass'}: <strong>{chem.molarMass} g/mol</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>{isAmharic ? 'የሚፈለግ ሞላሪቲ (M)' : 'Desired Molarity (M)'}</Label>
                    <Badge variant="secondary" className="font-mono">{desiredMolarity} M</Badge>
                  </div>
                  <Slider
                    value={[desiredMolarity]}
                    onValueChange={([v]) => setDesiredMolarity(v)}
                    min={0.1}
                    max={12}
                    step={0.1}
                    className="py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isAmharic ? 'የመፍትሄ መጠን (mL)' : 'Solution Volume (mL)'}</Label>
                  <Input
                    type="number"
                    value={solutionVolume}
                    onChange={(e) => setSolutionVolume(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={10000}
                  />
                </div>

                <Alert>
                  <BookOpen className="w-4 h-4" />
                  <AlertTitle>{isAmharic ? 'ቀመር' : 'Formula'}</AlertTitle>
                  <AlertDescription className="font-mono text-lg">
                    M = n/V = mass/(M.W. × V)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {isAmharic ? 'ውጤት' : 'Results'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የተሰላ መጠኖች' : 'Calculated amounts'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-card text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isAmharic ? 'የሚያስፈልግ ብዛት' : 'Mass Required'}
                    </p>
                    <p className="text-3xl font-bold text-primary">{molarityResult.massNeeded}</p>
                    <p className="text-sm text-muted-foreground">grams</p>
                  </div>

                  <div className="stat-card text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isAmharic ? 'ሞልስ' : 'Moles'}
                    </p>
                    <p className="text-3xl font-bold text-accent">{molarityResult.moles}</p>
                    <p className="text-sm text-muted-foreground">mol</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {isAmharic ? 'የዝግጅት ደረጃዎች' : 'Preparation Steps'}
                  </h4>
                  <ol className="space-y-2 text-sm">
                    {[
                      isAmharic ? `${molarityResult.massNeeded}ግ ${chem.formula} ይለኩ` : `Weigh out ${molarityResult.massNeeded}g of ${chem.formula}`,
                      isAmharic ? 'የመለኪያ ፍላስክ ውስጥ ይሟሟሉ' : 'Dissolve in volumetric flask',
                      isAmharic ? `በንፁህ ውሃ ወደ ${solutionVolume}mL ያድርሱ` : `Add distilled water to ${solutionVolume}mL mark`,
                      isAmharic ? 'በደንብ ይቀላቅሉ' : 'Mix thoroughly'
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ DILUTION CALCULATOR ============ */}
        <TabsContent value="dilution" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-primary icon-pulse" />
                  {isAmharic ? 'C₁V₁ = C₂V₂ ካልኩሌተር' : 'C₁V₁ = C₂V₂ Calculator'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የዲሉሽን ቀመር' : 'Dilution Formula'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <p className="text-center font-mono text-xl font-bold">
                    C₁V₁ = C₂V₂
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      C₁ ({isAmharic ? 'የመጀመሪያ ክብደት' : 'Initial Conc.'}) M
                    </Label>
                    <Input
                      type="number"
                      value={c1}
                      onChange={(e) => setC1(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                      min={0.01}
                      step={0.1}
                    />
                  </div>
                  <div className="stat-card text-center">
                    <Label className="text-sm">V₁ ({isAmharic ? 'ውጤት' : 'Result'})</Label>
                    <p className="text-2xl font-bold text-primary">{dilutionResult.v1} mL</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      C₂ ({isAmharic ? 'የመጨረሻ ክብደት' : 'Final Conc.'}) M
                    </Label>
                    <Input
                      type="number"
                      value={c2}
                      onChange={(e) => setC2(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                      min={0.01}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      V₂ ({isAmharic ? 'የመጨረሻ መጠን' : 'Final Volume'}) mL
                    </Label>
                    <Input
                      type="number"
                      value={v2}
                      onChange={(e) => setV2(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {isAmharic ? 'የዲሉሽን ውጤት' : 'Dilution Results'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-card text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isAmharic ? 'የሚያስፈልግ ክምችት' : 'Stock Solution'}
                    </p>
                    <p className="text-3xl font-bold text-primary">{dilutionResult.v1}</p>
                    <p className="text-sm text-muted-foreground">mL</p>
                  </div>

                  <div className="stat-card text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isAmharic ? 'የሚጨመር ውሃ' : 'Water to Add'}
                    </p>
                    <p className="text-3xl font-bold text-accent">{dilutionResult.waterToAdd}</p>
                    <p className="text-sm text-muted-foreground">mL</p>
                  </div>
                </div>

                <div className="stat-card text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {isAmharic ? 'የዲሉሽን ቅንጅት' : 'Dilution Factor'}
                  </p>
                  <p className="text-4xl font-bold gradient-text">{dilutionResult.dilutionFactor}×</p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-warning" />
                    {isAmharic ? 'አስፈላጊ ደረጃዎች' : 'Important Steps'}
                  </h4>
                  <ol className="space-y-2 text-sm">
                    {[
                      isAmharic ? `${dilutionResult.v1}mL ክምችት ይለኩ` : `Measure ${dilutionResult.v1}mL stock solution`,
                      isAmharic ? 'ወደ የመለኪያ ፍላስክ ያስተላልፉ' : 'Transfer to volumetric flask',
                      isAmharic ? `${dilutionResult.waterToAdd}mL ውሃ ይጨምሩ` : `Add ${dilutionResult.waterToAdd}mL distilled water`,
                      isAmharic ? 'በደንብ ይቀላቅሉ' : 'Mix thoroughly'
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <Alert className="border-warning/50 bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning/80 text-sm">
                    {isAmharic 
                      ? 'ሁልጊዜ አሲድን ወደ ውሃ ጨምሩ፣ ውሃን ወደ አሲድ አይጨምሩ!'
                      : 'Always add acid to water, never water to acid!'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ STOICHIOMETRY CALCULATOR ============ */}
        <TabsContent value="stoichiometry" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary icon-pulse" />
                  {isAmharic ? 'ስቶይኪዮሜትሪ ካልኩሌተር' : 'Stoichiometry Calculator'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የምላሽ ስሌቶች' : 'Reaction calculations'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>{isAmharic ? 'ምላሽ ይምረጡ' : 'Select Reaction'}</Label>
                  <Select value={selectedReaction} onValueChange={(v) => setSelectedReaction(v as keyof typeof REACTIONS)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(REACTIONS).map(([key, rxn]) => (
                        <SelectItem key={key} value={key}>
                          {isAmharic ? rxn.nameAm : rxn.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <p className="text-center font-mono text-lg font-bold">
                    {REACTIONS[selectedReaction].equation}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>{isAmharic ? 'ገደብ ሰጪ ምላሽ ሰጪ' : 'Limiting Reactant'}</Label>
                  <Select 
                    value={limitingReactantIndex.toString()} 
                    onValueChange={(v) => setLimitingReactantIndex(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REACTIONS[selectedReaction].reactants.map((r, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {r.formula} (M.W. = {r.molarMass} g/mol)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{isAmharic ? 'የምላሽ ሰጪ ብዛት (ግ)' : 'Reactant Mass (g)'}</Label>
                  <Input
                    type="number"
                    value={reactantMass}
                    onChange={(e) => setReactantMass(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                    min={0.01}
                    step={0.1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  {isAmharic ? 'የምላሽ ውጤቶች' : 'Reaction Results'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reactants needed */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    {isAmharic ? 'የሚያስፈልጉ ምላሽ ሰጪዎች' : 'Required Reactants'}
                  </h4>
                  <div className="grid gap-2">
                    {stoichiometryResult.reactants.map((r, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-lg flex justify-between items-center ${r.isLimiting ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{r.formula}</span>
                          {r.isLimiting && (
                            <Badge variant="secondary" className="text-xs">
                              {isAmharic ? 'ገደብ ሰጪ' : 'Limiting'}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{r.mass} g</p>
                          <p className="text-xs text-muted-foreground">{r.moles} mol</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products formed */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    {isAmharic ? 'የሚፈጠሩ ውጤቶች' : 'Products Formed'}
                  </h4>
                  <div className="grid gap-2">
                    {stoichiometryResult.products.map((p, i) => (
                      <div key={i} className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex justify-between items-center">
                        <span className="font-mono font-bold">{p.formula}</span>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{p.mass} g</p>
                          <p className="text-xs text-muted-foreground">{p.moles} mol</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    {isAmharic 
                      ? 'ይህ ስሌት 100% ምርታማነት ይገምታል። ትክክለኛ ምርቶች በተግባር ዝቅ ሊሆኑ ይችላሉ።'
                      : 'This calculation assumes 100% yield. Actual yields may be lower in practice.'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCalculator;