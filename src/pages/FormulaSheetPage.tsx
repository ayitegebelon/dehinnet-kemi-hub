import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Atom, Zap, Thermometer } from 'lucide-react';

interface FormulaEntry {
  name: string;
  nameAm: string;
  formula: string;
  description: string;
  category: string;
}

const FORMULAS: FormulaEntry[] = [
  { name: 'Ideal Gas Law', nameAm: 'ተስማሚ ጋዝ ሕግ', formula: 'PV = nRT', description: 'Relates pressure, volume, moles and temperature of an ideal gas', category: 'gas' },
  { name: "Boyle's Law", nameAm: 'የቦይል ሕግ', formula: 'P₁V₁ = P₂V₂', description: 'At constant temperature, pressure and volume are inversely proportional', category: 'gas' },
  { name: "Charles's Law", nameAm: 'የቻርልስ ሕግ', formula: 'V₁/T₁ = V₂/T₂', description: 'At constant pressure, volume is directly proportional to temperature', category: 'gas' },
  { name: 'Molarity', nameAm: 'ሞላሪቲ', formula: 'M = n / V', description: 'Concentration in moles per liter of solution', category: 'solution' },
  { name: 'Dilution', nameAm: 'ውህድ', formula: 'C₁V₁ = C₂V₂', description: 'Dilution equation relating concentration and volume', category: 'solution' },
  { name: 'pH Definition', nameAm: 'pH ትርጓሜ', formula: 'pH = -log[H⁺]', description: 'Negative logarithm of hydrogen ion concentration', category: 'acid-base' },
  { name: 'pOH Definition', nameAm: 'pOH ትርጓሜ', formula: 'pOH = -log[OH⁻]', description: 'Negative logarithm of hydroxide ion concentration', category: 'acid-base' },
  { name: 'pH + pOH', nameAm: 'pH + pOH', formula: 'pH + pOH = 14', description: 'Sum of pH and pOH equals 14 at 25°C', category: 'acid-base' },
  { name: 'Moles', nameAm: 'ሞል', formula: 'n = m / M', description: 'Moles = mass divided by molar mass', category: 'stoichiometry' },
  { name: 'Percent Yield', nameAm: 'ምርት በመቶኛ', formula: '% yield = (actual/theoretical) × 100', description: 'Efficiency of a chemical reaction', category: 'stoichiometry' },
  { name: 'Density', nameAm: 'ጥግግት', formula: 'ρ = m / V', description: 'Mass per unit volume', category: 'physical' },
  { name: "Hess's Law", nameAm: 'የሄስ ሕግ', formula: 'ΔH°rxn = ΣΔH°f(products) - ΣΔH°f(reactants)', description: 'Enthalpy change is sum of formation enthalpies', category: 'thermo' },
  { name: 'Gibbs Free Energy', nameAm: 'ጊብስ ነጻ ኢነርጂ', formula: 'ΔG = ΔH - TΔS', description: 'Determines spontaneity of a reaction', category: 'thermo' },
  { name: 'Nernst Equation', nameAm: 'ነርንስት ቀመር', formula: 'E = E° - (RT/nF)lnQ', description: 'Cell potential under non-standard conditions', category: 'electro' },
  { name: "Faraday's Law", nameAm: 'የፋራዴይ ሕግ', formula: 'm = (MIt)/(nF)', description: 'Mass deposited during electrolysis', category: 'electro' },
  { name: 'Rate Law', nameAm: 'የፍጥነት ሕግ', formula: 'rate = k[A]^m[B]^n', description: 'Rate depends on concentration and rate constant', category: 'kinetics' },
  { name: 'Half-Life (1st order)', nameAm: 'ግማሽ ዕድሜ', formula: 't₁/₂ = 0.693 / k', description: 'Time for concentration to halve', category: 'kinetics' },
  { name: 'Equilibrium Constant', nameAm: 'ሚዛን ቋሚ', formula: 'Kc = [products]^coeff / [reactants]^coeff', description: 'Ratio of product to reactant concentrations at equilibrium', category: 'equilibrium' },
  { name: 'Kp from Kc', nameAm: 'Kp ከ Kc', formula: 'Kp = Kc(RT)^Δn', description: 'Pressure equilibrium constant from concentration constant', category: 'equilibrium' },
];

const CONSTANTS = [
  { name: 'Gas Constant (R)', value: '8.314 J/(mol·K)', alt: '0.0821 L·atm/(mol·K)' },
  { name: "Avogadro's Number (Nₐ)", value: '6.022 × 10²³ mol⁻¹', alt: '' },
  { name: "Faraday's Constant (F)", value: '96,485 C/mol', alt: '' },
  { name: "Planck's Constant (h)", value: '6.626 × 10⁻³⁴ J·s', alt: '' },
  { name: 'Speed of Light (c)', value: '3.0 × 10⁸ m/s', alt: '' },
  { name: 'Boltzmann Constant (k)', value: '1.381 × 10⁻²³ J/K', alt: '' },
  { name: 'Standard Pressure', value: '1 atm = 101.325 kPa', alt: '760 mmHg' },
  { name: 'Standard Temperature', value: '273.15 K = 0°C', alt: '' },
  { name: 'Molar Volume (STP)', value: '22.414 L/mol', alt: '' },
  { name: 'Water Kw', value: '1.0 × 10⁻¹⁴ at 25°C', alt: '' },
];

const CATEGORIES: Record<string, string> = {
  all: 'All',
  gas: 'Gas Laws',
  solution: 'Solutions',
  'acid-base': 'Acid-Base',
  stoichiometry: 'Stoichiometry',
  physical: 'Physical',
  thermo: 'Thermodynamics',
  electro: 'Electrochemistry',
  kinetics: 'Kinetics',
  equilibrium: 'Equilibrium',
};

const FormulaSheetPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = FORMULAS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.formula.toLowerCase().includes(searchTerm.toLowerCase()) || f.nameAm.includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'ቀመር ሉህ' : 'Formula Sheet'}</h1>
            <p className="text-muted-foreground text-sm">{isAm ? 'ሁሉም ኬሚስትሪ ቀመሮች እና ቋሚዎች' : 'All chemistry formulas & constants'}</p>
          </div>
        </div>

        <Tabs defaultValue="formulas">
          <TabsList>
            <TabsTrigger value="formulas"><Atom className="w-4 h-4 mr-1" />{isAm ? 'ቀመሮች' : 'Formulas'}</TabsTrigger>
            <TabsTrigger value="constants"><Zap className="w-4 h-4 mr-1" />{isAm ? 'ቋሚዎች' : 'Constants'}</TabsTrigger>
          </TabsList>

          <TabsContent value="formulas" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={isAm ? 'ፈልግ...' : 'Search formulas...'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <Button key={key} variant={selectedCategory === key ? 'default' : 'outline'} size="sm" className="text-xs h-8" onClick={() => setSelectedCategory(key)}>
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {filtered.map((f, i) => (
                <Card key={i} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{isAm ? f.nameAm : f.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{CATEGORIES[f.category]}</Badge>
                    </div>
                    <p className="font-mono text-lg font-bold text-primary mb-1">{f.formula}</p>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="constants">
            <div className="grid md:grid-cols-2 gap-3">
              {CONSTANTS.map((c, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{c.name}</h3>
                    <p className="font-mono text-lg font-bold text-primary">{c.value}</p>
                    {c.alt && <p className="text-xs text-muted-foreground mt-1">{c.alt}</p>}
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

export default FormulaSheetPage;
