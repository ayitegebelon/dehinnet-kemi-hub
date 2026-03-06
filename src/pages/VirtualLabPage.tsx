import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text, RoundedBox, Cylinder, Sphere } from '@react-three/drei';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  FlaskConical, Beaker, Search, AlertTriangle, Play, RotateCcw,
  Thermometer, Droplets, Atom, TestTubes, Microscope, Flame,
  ShieldCheck, BookOpen, Sparkles, ChevronRight, Users, Volume2
} from 'lucide-react';
import scientistAvatar from '@/assets/scientist-avatar.png';
import * as THREE from 'three';

// ─── Chemical Database ───
interface Chemical {
  id: string;
  name: string;
  nameAm: string;
  formula: string;
  type: string;
  molarMass: number;
  hazards: string[];
  color: string;
  uses: string;
  discoverer: string;
  discoveryYear: string;
}

const CHEMICALS: Chemical[] = [
  { id: 'naoh', name: 'Sodium Hydroxide', nameAm: 'ሶዲየም ሃይድሮክሳይድ', formula: 'NaOH', type: 'Base', molarMass: 39.997, hazards: ['Corrosive', 'Burns'], color: '#ffffff', uses: 'Soap making, cleaning', discoverer: 'Humphry Davy', discoveryYear: '1807' },
  { id: 'hcl', name: 'Hydrochloric Acid', nameAm: 'ሃይድሮክሎሪክ አሲድ', formula: 'HCl', type: 'Acid', molarMass: 36.461, hazards: ['Corrosive', 'Toxic fumes'], color: '#e8f5e9', uses: 'pH control, cleaning', discoverer: 'Jabir ibn Hayyan', discoveryYear: '800 AD' },
  { id: 'h2so4', name: 'Sulfuric Acid', nameAm: 'ሰልፊዩሪክ አሲድ', formula: 'H₂SO₄', type: 'Acid', molarMass: 98.079, hazards: ['Highly Corrosive', 'Exothermic'], color: '#fff9c4', uses: 'Batteries, fertilizers', discoverer: 'Jabir ibn Hayyan', discoveryYear: '8th century' },
  { id: 'ethanol', name: 'Ethanol', nameAm: 'ኤታኖል', formula: 'C₂H₅OH', type: 'Alcohol', molarMass: 46.07, hazards: ['Flammable'], color: '#e3f2fd', uses: 'Solvent, fuel, drinks', discoverer: 'Ancient civilizations', discoveryYear: '~3000 BC' },
  { id: 'nacl', name: 'Sodium Chloride', nameAm: 'ጨው', formula: 'NaCl', type: 'Salt', molarMass: 58.44, hazards: ['Low hazard'], color: '#ffffff', uses: 'Seasoning, preservation', discoverer: 'Prehistoric', discoveryYear: 'Ancient' },
  { id: 'caco3', name: 'Calcium Carbonate', nameAm: 'ካልሲየም ካርቦኔት', formula: 'CaCO₃', type: 'Salt', molarMass: 100.09, hazards: ['Low hazard'], color: '#fafafa', uses: 'Antacids, cement', discoverer: 'Ancient', discoveryYear: 'Ancient' },
  { id: 'h2o2', name: 'Hydrogen Peroxide', nameAm: 'ሃይድሮጅን ፐሮክሳይድ', formula: 'H₂O₂', type: 'Oxidizer', molarMass: 34.01, hazards: ['Oxidizer', 'Irritant'], color: '#e1f5fe', uses: 'Disinfectant, bleaching', discoverer: 'Louis Jacques Thénard', discoveryYear: '1818' },
  { id: 'nahco3', name: 'Sodium Bicarbonate', nameAm: 'ቤኪንግ ሶዳ', formula: 'NaHCO₃', type: 'Base', molarMass: 84.01, hazards: ['Low hazard'], color: '#ffffff', uses: 'Baking, cleaning, antacid', discoverer: 'Nicolas Leblanc', discoveryYear: '1791' },
  { id: 'ch3cooh', name: 'Acetic Acid', nameAm: 'አሴቲክ አሲድ (ሆምጣጮ)', formula: 'CH₃COOH', type: 'Acid', molarMass: 60.05, hazards: ['Irritant', 'Flammable'], color: '#f1f8e9', uses: 'Vinegar, solvent', discoverer: 'Ancient', discoveryYear: '~3000 BC' },
  { id: 'koh', name: 'Potassium Hydroxide', nameAm: 'ፖታሲየም ሃይድሮክሳይድ', formula: 'KOH', type: 'Base', molarMass: 56.11, hazards: ['Corrosive'], color: '#ffffff', uses: 'Liquid soap, fertilizer', discoverer: 'Humphry Davy', discoveryYear: '1807' },
  { id: 'fe2o3', name: 'Iron(III) Oxide', nameAm: 'ብረት(III) ኦክሳይድ', formula: 'Fe₂O₃', type: 'Oxide', molarMass: 159.69, hazards: ['Low hazard'], color: '#bf360c', uses: 'Pigment, polishing', discoverer: 'Ancient', discoveryYear: 'Ancient' },
  { id: 'cuso4', name: 'Copper Sulfate', nameAm: 'ኮፐር ሰልፌት', formula: 'CuSO₄', type: 'Salt', molarMass: 159.61, hazards: ['Irritant', 'Toxic'], color: '#1565c0', uses: 'Fungicide, electroplating', discoverer: 'Ancient', discoveryYear: 'Ancient' },
];

// ─── Experiment definitions ───
interface ExperimentStep {
  instruction: string;
  instructionAm: string;
  chemical?: string;
  equipment?: string;
  warning?: string;
  duration?: string;
}

interface Experiment {
  id: string;
  name: string;
  nameAm: string;
  description: string;
  descriptionAm: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chemicals: string[];
  steps: ExperimentStep[];
  result: string;
  resultAm: string;
  equation: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'soap',
    name: 'Soap Making (Saponification)',
    nameAm: 'ሳሙና መስራት',
    description: 'Create soap by reacting fats/oils with a strong base',
    descriptionAm: 'ቅባት/ዘይት ከጠንካራ ቤዝ ጋር በማዋሃድ ሳሙና ይሥሩ',
    difficulty: 'Medium',
    chemicals: ['naoh', 'ethanol'],
    steps: [
      { instruction: 'Measure 100ml of vegetable oil into the beaker', instructionAm: 'ከአትክልት ዘይት 100 ሚሊ ሊትር ወደ ቢከር ያፈሱ', equipment: 'beaker', duration: '1 min' },
      { instruction: 'Carefully add 40g NaOH dissolved in 50ml water', instructionAm: 'በ50 ሚሊ ሊትር ውሃ የተሟሟ 40 ግራም NaOH በጥንቃቄ ይጨምሩ', chemical: 'naoh', warning: 'Wear gloves! NaOH is corrosive', duration: '2 min' },
      { instruction: 'Heat the mixture to 65°C while stirring', instructionAm: 'ድብልቅውን ያማሱ ወደ 65 ዲግሪ ያሞቁ', equipment: 'burner', duration: '15 min' },
      { instruction: 'Stir continuously until the mixture thickens (trace)', instructionAm: 'ድብልቅው እስኪተምም ድረስ ያማሱ', equipment: 'stirrer', duration: '20 min' },
      { instruction: 'Pour into mold and let cure for 24-48 hours', instructionAm: 'ወደ ማረጊያ ያፈሱ እና ከ24-48 ሰዓት ያሳርፉ', equipment: 'mold', duration: '48 hours' },
    ],
    result: 'Solid soap bar formed through saponification!',
    resultAm: 'በሳፖኒፊኬሽን ጠንካራ ሳሙና ተሰራ!',
    equation: 'Fat + NaOH → Soap + Glycerol',
  },
  {
    id: 'volcano',
    name: 'Baking Soda Volcano',
    nameAm: 'የቤኪንግ ሶዳ እሳተ ገሞራ',
    description: 'Acid-base reaction producing CO₂ gas eruption',
    descriptionAm: 'CO₂ ጋዝ የሚፈጥር የአሲድ-ቤዝ ምላሽ',
    difficulty: 'Easy',
    chemicals: ['nahco3', 'ch3cooh'],
    steps: [
      { instruction: 'Place 2 tablespoons of baking soda in a flask', instructionAm: '2 የማንኪያ ቤኪንግ ሶዳ በፍላስክ ውስጥ ያስቀምጡ', equipment: 'flask', duration: '1 min' },
      { instruction: 'Add a few drops of food coloring', instructionAm: 'ጥቂት ጠብታ የምግብ ማቅለሚያ ይጨምሩ', duration: '30 sec' },
      { instruction: 'Slowly pour vinegar into the flask', instructionAm: 'ሆምጣጮን ቀስ ብለው ወደ ፍላስኩ ያፈሱ', chemical: 'ch3cooh', duration: '1 min' },
      { instruction: 'Watch the eruption! CO₂ gas is released', instructionAm: 'ፍንዳታውን ይመልከቱ! CO₂ ጋዝ ይወጣል', duration: '2 min' },
    ],
    result: 'Fizzy eruption! CO₂ gas produced by acid-base reaction',
    resultAm: 'ፍንዳታ! በአሲድ-ቤዝ ምላሽ CO₂ ጋዝ ተፈጠረ',
    equation: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑',
  },
  {
    id: 'indicator',
    name: 'Natural pH Indicator',
    nameAm: 'ተፈጥሮአዊ pH ማሳያ',
    description: 'Extract natural indicators from red cabbage to test pH',
    descriptionAm: 'ከቀይ ጎመን ተፈጥሮአዊ pH ማሳያ ማውጣት',
    difficulty: 'Easy',
    chemicals: ['hcl', 'naoh', 'nahco3'],
    steps: [
      { instruction: 'Boil chopped red cabbage in water for 10 minutes', instructionAm: 'የተቆረጠ ቀይ ጎመን ለ10 ደቂቃ በውሃ ያፍሉ', equipment: 'beaker', duration: '10 min' },
      { instruction: 'Filter the purple liquid into test tubes', instructionAm: 'ሐምራዊ ፈሳሹን ወደ ቴስት ቱቦች ያጣሩ', equipment: 'test-tube', duration: '3 min' },
      { instruction: 'Add acid to tube 1 — observe red/pink color', instructionAm: 'ለቱብ 1 አሲድ ይጨምሩ — ቀይ/ሮዝ ቀለም ይመልከቱ', chemical: 'hcl', duration: '1 min' },
      { instruction: 'Add base to tube 2 — observe green/yellow color', instructionAm: 'ለቱብ 2 ቤዝ ይጨምሩ — አረንጓዴ/ቢጫ ቀለም ይመልከቱ', chemical: 'naoh', duration: '1 min' },
    ],
    result: 'Acids turn indicator red, bases turn it green/yellow!',
    resultAm: 'አሲድ ማሳያውን ቀይ ያደርገዋል፣ ቤዝ አረንጓዴ/ቢጫ!',
    equation: 'Anthocyanin + H⁺ → Red | Anthocyanin + OH⁻ → Green',
  },
  {
    id: 'crystals',
    name: 'Crystal Growing',
    nameAm: 'ክሪስታል ማሳደግ',
    description: 'Grow beautiful copper sulfate crystals from solution',
    descriptionAm: 'ከሟሟት ውብ ኮፐር ሰልፌት ክሪስታሎችን ያሳድጉ',
    difficulty: 'Medium',
    chemicals: ['cuso4'],
    steps: [
      { instruction: 'Heat 200ml water to near boiling', instructionAm: '200 ሚሊ ሊትር ውሃ ወደ ማፍላት ያሞቁ', equipment: 'burner', duration: '5 min' },
      { instruction: 'Dissolve copper sulfate until saturated (no more dissolves)', instructionAm: 'ኮፐር ሰልፌት እስኪሞላ ድረስ ያሟሟ', chemical: 'cuso4', warning: 'Copper sulfate is toxic — wear gloves', duration: '5 min' },
      { instruction: 'Filter the solution and pour into a clean jar', instructionAm: 'ሟሟቱን ያጣሩ ወደ ንፁህ ማሰሮ ያፈሱ', equipment: 'flask', duration: '3 min' },
      { instruction: 'Hang a seed crystal on a string in the solution', instructionAm: 'የዘር ክሪስታልን በክር ላይ በሟሟቱ ውስጥ ያንጠልጥሉ', duration: '2 min' },
      { instruction: 'Wait 1-2 weeks — crystals will grow!', instructionAm: '1-2 ሳምንት ይጠብቁ — ክሪስታሎች ያድጋሉ!', duration: '1-2 weeks' },
    ],
    result: 'Beautiful blue copper sulfate crystals formed!',
    resultAm: 'ውብ ሰማያዊ ኮፐር ሰልፌት ክሪስታሎች ተሰሩ!',
    equation: 'CuSO₄ · 5H₂O (saturated) → CuSO₄ crystals',
  },
];

// ─── 3D Lab Scene Components ───
const LabTable = () => (
  <group position={[0, -0.5, 0]}>
    <RoundedBox args={[6, 0.15, 3]} radius={0.02} position={[0, 0.75, 0]}>
      <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.1} />
    </RoundedBox>
    {[[-2.5, 0, -1.2], [2.5, 0, -1.2], [-2.5, 0, 1.2], [2.5, 0, 1.2]].map((pos, i) => (
      <Cylinder key={i} args={[0.05, 0.05, 0.75]} position={pos as [number, number, number]}>
        <meshStandardMaterial color="#9e9e9e" metalness={0.5} />
      </Cylinder>
    ))}
  </group>
);

const LabBeaker = ({ position, liquidColor = '#90caf9', fillLevel = 0.6 }: { position: [number, number, number]; liquidColor?: string; fillLevel?: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.1; });
  return (
    <group ref={ref} position={position}>
      <Cylinder args={[0.25, 0.22, 0.5, 16, 1, true]} position={[0, 0.25, 0]}>
        <meshPhysicalMaterial color="#cfd8dc" transparent opacity={0.3} roughness={0} transmission={0.8} />
      </Cylinder>
      <Cylinder args={[0.22, 0.2, fillLevel * 0.45, 16]} position={[0, fillLevel * 0.22, 0]}>
        <meshStandardMaterial color={liquidColor} transparent opacity={0.7} />
      </Cylinder>
    </group>
  );
};

const LabFlask = ({ position, color = '#a5d6a7' }: { position: [number, number, number]; color?: string }) => (
  <group position={position}>
    <Sphere args={[0.2, 16, 16]} position={[0, 0.2, 0]}>
      <meshPhysicalMaterial color="#e0e0e0" transparent opacity={0.25} roughness={0} transmission={0.9} />
    </Sphere>
    <Cylinder args={[0.06, 0.06, 0.2, 8]} position={[0, 0.42, 0]}>
      <meshPhysicalMaterial color="#e0e0e0" transparent opacity={0.3} />
    </Cylinder>
    <Sphere args={[0.16, 16, 16]} position={[0, 0.2, 0]}>
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </Sphere>
  </group>
);

const BunsenBurner = ({ position, isOn }: { position: [number, number, number]; isOn: boolean }) => {
  const flameRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (flameRef.current && isOn) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 7) * 0.15;
    }
  });
  return (
    <group position={position}>
      <Cylinder args={[0.06, 0.08, 0.3, 8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#616161" metalness={0.8} roughness={0.3} />
      </Cylinder>
      {isOn && (
        <mesh ref={flameRef} position={[0, 0.38, 0]}>
          <coneGeometry args={[0.04, 0.15, 8]} />
          <meshStandardMaterial color="#ff9800" emissive="#ff6f00" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const ChemicalShelf = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <RoundedBox args={[2.5, 2, 0.4]} radius={0.02}>
      <meshStandardMaterial color="#5d4037" roughness={0.8} />
    </RoundedBox>
    {[-0.6, 0, 0.6].map((y, i) => (
      <RoundedBox key={i} args={[2.3, 0.05, 0.35]} radius={0.01} position={[0, y, 0.05]}>
        <meshStandardMaterial color="#6d4c41" />
      </RoundedBox>
    ))}
    {[[-0.8, 0.75], [-0.3, 0.75], [0.2, 0.75], [0.7, 0.75], [-0.6, 0.15], [0.1, 0.15], [0.6, 0.15]].map(([x, y], i) => (
      <Cylinder key={i} args={[0.06, 0.06, 0.2, 8]} position={[x, y, 0.05]}>
        <meshStandardMaterial color={['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8', '#4dd0e1', '#fff176'][i]} />
      </Cylinder>
    ))}
  </group>
);

const LabScene = ({ activeExperiment, currentStep }: { activeExperiment: Experiment | null; currentStep: number }) => {
  const burnerOn = activeExperiment !== null && currentStep >= 2;
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 3, 2]} intensity={0.5} color="#bbdefb" />
      <Environment preset="studio" />

      <LabTable />
      <ChemicalShelf position={[0, 1.2, -2.5]} />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <LabBeaker position={[-1.5, 0.55, 0]} liquidColor={activeExperiment ? '#42a5f5' : '#90caf9'} fillLevel={activeExperiment ? 0.4 + currentStep * 0.1 : 0.6} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
        <LabFlask position={[0, 0.55, 0.3]} color={activeExperiment ? '#66bb6a' : '#a5d6a7'} />
      </Float>
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
        <LabBeaker position={[1.5, 0.55, -0.2]} liquidColor="#ef5350" fillLevel={0.3} />
      </Float>

      <BunsenBurner position={[0.5, 0.3, -0.5]} isOn={burnerOn} />

      {/* Test tubes */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <group key={i} position={[-2, 0.55, 0.8]}>
          <Cylinder args={[0.03, 0.03, 0.25, 8]} position={[x, 0.12, 0]}>
            <meshPhysicalMaterial color="#e0e0e0" transparent opacity={0.3} transmission={0.8} />
          </Cylinder>
          <Cylinder args={[0.025, 0.025, 0.12, 8]} position={[x, 0.03, 0]}>
            <meshStandardMaterial color={['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ce93d8'][i]} transparent opacity={0.7} />
          </Cylinder>
        </group>
      ))}

      <Text position={[0, 2.5, -2.4]} fontSize={0.2} color="#1565c0" anchorX="center" font={undefined}>
        {activeExperiment ? activeExperiment.name : 'Virtual Chemistry Lab'}
      </Text>

      <OrbitControls enablePan={true} enableZoom={true} maxDistance={10} minDistance={2} autoRotate={!activeExperiment} autoRotateSpeed={0.5} />
    </>
  );
};

// ─── Main Page ───
const VirtualLabPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [activeTab, setActiveTab] = useState('lab');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [experimentLog, setExperimentLog] = useState<string[]>([]);

  const filteredChemicals = CHEMICALS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nameAm.includes(searchTerm)
  );

  const startExperiment = (exp: Experiment) => {
    setActiveExperiment(exp);
    setCurrentStep(0);
    setCompletedSteps([]);
    setExperimentLog([`Started: ${isAm ? exp.nameAm : exp.name}`]);
    setActiveTab('lab');
    toast.success(isAm ? 'ሙከራ ተጀምሯል!' : 'Experiment started!');
  };

  const advanceStep = () => {
    if (!activeExperiment) return;
    setCompletedSteps(prev => [...prev, currentStep]);
    const step = activeExperiment.steps[currentStep];
    setExperimentLog(prev => [...prev, `✓ Step ${currentStep + 1}: ${isAm ? step.instructionAm : step.instruction}`]);

    if (currentStep < activeExperiment.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setExperimentLog(prev => [...prev, `🎉 Result: ${isAm ? activeExperiment.resultAm : activeExperiment.result}`, `⚗️ ${activeExperiment.equation}`]);
      toast.success(isAm ? 'ሙከራ ተጠናቋል!' : 'Experiment completed!', { description: activeExperiment.equation });
    }
  };

  const resetExperiment = () => {
    setActiveExperiment(null);
    setCurrentStep(0);
    setCompletedSteps([]);
    setExperimentLog([]);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'ቨርቹዋል ኬሚስትሪ ላብ' : 'Virtual Chemistry Lab'}</h1>
            <p className="text-muted-foreground text-sm">{isAm ? 'በ3D ላብ ውስጥ ሙከራዎችን ያካሂዱ' : 'Conduct experiments in an interactive 3D lab'}</p>
          </div>
          <img src={scientistAvatar} alt="Lab scientist" className="h-14 w-14 ml-auto rounded-full object-cover border-2 border-primary/20" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="lab"><Beaker className="w-4 h-4 mr-1" />{isAm ? 'ላብ' : 'Lab'}</TabsTrigger>
            <TabsTrigger value="chemicals"><Atom className="w-4 h-4 mr-1" />{isAm ? 'ኬሚካሎች' : 'Chemicals'}</TabsTrigger>
            <TabsTrigger value="experiments"><TestTubes className="w-4 h-4 mr-1" />{isAm ? 'ሙከራዎች' : 'Experiments'}</TabsTrigger>
            <TabsTrigger value="safety"><ShieldCheck className="w-4 h-4 mr-1" />{isAm ? 'ደህንነት' : 'Safety'}</TabsTrigger>
          </TabsList>

          {/* 3D LAB TAB */}
          <TabsContent value="lab" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="h-[400px] md:h-[500px] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
                      <Suspense fallback={null}>
                        <LabScene activeExperiment={activeExperiment} currentStep={currentStep} />
                      </Suspense>
                    </Canvas>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {/* Experiment Controls */}
                {activeExperiment ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{isAm ? activeExperiment.nameAm : activeExperiment.name}</span>
                        <Button variant="ghost" size="sm" onClick={resetExperiment}><RotateCcw className="w-4 h-4" /></Button>
                      </CardTitle>
                      <Badge variant={activeExperiment.difficulty === 'Easy' ? 'secondary' : activeExperiment.difficulty === 'Medium' ? 'default' : 'destructive'}>
                        {activeExperiment.difficulty}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {activeExperiment.steps.map((step, idx) => (
                        <div key={idx} className={`flex items-start gap-3 p-2 rounded-lg transition-all ${idx === currentStep ? 'bg-primary/10 border border-primary/30' : completedSteps.includes(idx) ? 'bg-muted/50 opacity-60' : 'opacity-40'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${completedSteps.includes(idx) ? 'bg-green-500 text-white' : idx === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {completedSteps.includes(idx) ? '✓' : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs">{isAm ? step.instructionAm : step.instruction}</p>
                            {step.warning && idx === currentStep && (
                              <p className="text-[10px] text-destructive flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" />{step.warning}</p>
                            )}
                            {step.duration && <p className="text-[10px] text-muted-foreground mt-0.5">⏱ {step.duration}</p>}
                          </div>
                        </div>
                      ))}
                      <Button onClick={advanceStep} className="w-full" disabled={completedSteps.length === activeExperiment.steps.length}>
                        {completedSteps.length === activeExperiment.steps.length
                          ? (isAm ? '✅ ተጠናቋል' : '✅ Completed')
                          : (isAm ? 'ቀጣይ ደረጃ' : 'Next Step')}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">{isAm ? 'ሙከራ ይምረጡ ለመጀመር' : 'Select an experiment to begin'}</p>
                      <Button variant="outline" className="mt-3" onClick={() => setActiveTab('experiments')}>
                        <TestTubes className="w-4 h-4 mr-1" />{isAm ? 'ሙከራዎችን ይመልከቱ' : 'Browse Experiments'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Experiment Log */}
                {experimentLog.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{isAm ? 'የሙከራ ማስታወሻ' : 'Experiment Log'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {experimentLog.map((log, i) => (
                            <p key={i} className="text-[11px] text-muted-foreground font-mono">{log}</p>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* CHEMICALS DATABASE TAB */}
          <TabsContent value="chemicals" className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isAm ? 'ኬሚካል ይፈልጉ...' : 'Search chemicals...'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredChemicals.map(chem => (
                <Card key={chem.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedChemical?.id === chem.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedChemical(chem)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{isAm ? chem.nameAm : chem.name}</h3>
                        <p className="font-mono text-lg font-bold text-primary">{chem.formula}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{chem.type}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{isAm ? 'ሞለኪዩላር ክብደት' : 'Molar mass'}: {chem.molarMass} g/mol</p>
                      <p>{isAm ? 'አግኚ' : 'Discoverer'}: {chem.discoverer} ({chem.discoveryYear})</p>
                      <p>{isAm ? 'አጠቃቀም' : 'Uses'}: {chem.uses}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {chem.hazards.map(h => (
                          <Badge key={h} variant="destructive" className="text-[9px] px-1.5 py-0">{h}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EXPERIMENTS TAB */}
          <TabsContent value="experiments" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {EXPERIMENTS.map(exp => (
                <Card key={exp.id} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{isAm ? exp.nameAm : exp.name}</CardTitle>
                      <Badge variant={exp.difficulty === 'Easy' ? 'secondary' : exp.difficulty === 'Medium' ? 'default' : 'destructive'}>
                        {exp.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{isAm ? exp.descriptionAm : exp.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium mb-1">{isAm ? 'ኬሚካሎች' : 'Chemicals needed'}:</p>
                      <div className="flex flex-wrap gap-1">
                        {exp.chemicals.map(cId => {
                          const c = CHEMICALS.find(ch => ch.id === cId);
                          return c ? <Badge key={cId} variant="outline" className="text-[10px]">{c.formula}</Badge> : null;
                        })}
                      </div>
                    </div>
                    <p className="text-xs font-mono bg-muted p-2 rounded">{exp.equation}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{exp.steps.length} {isAm ? 'ደረጃዎች' : 'steps'}</p>
                    </div>
                    <Button onClick={() => startExperiment(exp)} className="w-full">
                      <Play className="w-4 h-4 mr-1" />{isAm ? 'ሙከራ ጀምር' : 'Start Experiment'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SAFETY TAB */}
          <TabsContent value="safety" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '🥽', title: isAm ? 'የዓይን መከላከያ' : 'Eye Protection', desc: isAm ? 'ሁልጊዜ የደህንነት መነጽር ያድርጉ' : 'Always wear safety goggles when handling chemicals' },
                { icon: '🧤', title: isAm ? 'ጓንቶች' : 'Gloves', desc: isAm ? 'ኬሚካሎችን ሲነኩ ጓንት ያድርጉ' : 'Wear chemical-resistant gloves when handling corrosive substances' },
                { icon: '🥼', title: isAm ? 'ላብ ኮት' : 'Lab Coat', desc: isAm ? 'ቆዳንና ልብስን ለመከላከል' : 'Protect skin and clothing from spills and splashes' },
                { icon: '🌬️', title: isAm ? 'አየር ማናፈሻ' : 'Ventilation', desc: isAm ? 'በደንብ አየር በሚዘዋወርበት ቦታ ይሥሩ' : 'Work in well-ventilated areas, use fume hoods for toxic gases' },
                { icon: '🚿', title: isAm ? 'ድንገተኛ ሻወር' : 'Emergency Shower', desc: isAm ? 'የኬሚካል ንክኪ ቢኖር ለ15 ደቂቃ ያጠቡ' : 'In case of chemical contact, flush with water for 15 minutes' },
                { icon: '🧯', title: isAm ? 'እሳት ማጥፊያ' : 'Fire Extinguisher', desc: isAm ? 'በእያንዳንዱ ላብ ውስጥ ተዘጋጅቶ ይቀመጥ' : 'Must be available and accessible at all times in the lab' },
                { icon: '☎️', title: isAm ? 'የአደጋ ጊዜ ቁጥሮች' : 'Emergency Numbers', desc: `${isAm ? 'ፖሊስ' : 'Police'}: 991 | ${isAm ? 'አምቡላንስ' : 'Ambulance'}: 907 | ${isAm ? 'እሳት' : 'Fire'}: 939` },
                { icon: '⚠️', title: isAm ? 'ኬሚካል ተኳሃኝነት' : 'Chemical Compatibility', desc: isAm ? 'አሲድና ቤዝን በአግባቡ ያስቀምጡ' : 'Store acids and bases separately, check compatibility before mixing' },
                { icon: '📋', title: isAm ? 'MSDS ወረቀቶች' : 'MSDS Sheets', desc: isAm ? 'ለእያንዳንዱ ኬሚካል MSDS ያንብቡ' : 'Read Material Safety Data Sheets before handling any chemical' },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VirtualLabPage;
