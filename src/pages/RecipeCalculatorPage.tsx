import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Atom, Beaker, Droplets, FlaskConical, Repeat, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateMolarMass, findChemical } from '@/data/chemicalsDatabase';

// Helper: assess concentration safety for known acids/bases/oxidizers
function assessConcentration(chemical: string, molarity: number): { level: 'safe' | 'caution' | 'dangerous'; message: string } | null {
  const entry = findChemical(chemical);
  if (!entry) return null;
  if (entry.hazardClass === 'safe') return { level: 'safe', message: 'This chemical is generally safe at common concentrations.' };
  // Heuristic safe limits for educational use
  const dangerThreshold = entry.riskLevel >= 4 ? 1 : entry.riskLevel >= 3 ? 2 : 5;
  const cautionThreshold = entry.riskLevel >= 4 ? 0.1 : entry.riskLevel >= 3 ? 0.5 : 1;
  if (molarity > dangerThreshold) {
    return {
      level: 'dangerous',
      message: `${molarity}M of ${entry.name} is HIGHLY ${entry.hazardClass.toUpperCase()}. Use full PPE: ${entry.ppe.slice(0, 3).join(', ')}.`,
    };
  }
  if (molarity > cautionThreshold) {
    return {
      level: 'caution',
      message: `${molarity}M of ${entry.name} requires careful handling. Wear: ${entry.ppe.slice(0, 2).join(', ')}.`,
    };
  }
  return { level: 'safe', message: `${molarity}M of ${entry.name} is below typical danger thresholds, but still wear basic PPE.` };
}

const SafetyBanner: React.FC<{ assessment: ReturnType<typeof assessConcentration> }> = ({ assessment }) => {
  if (!assessment) return null;
  const styles =
    assessment.level === 'dangerous' ? 'bg-destructive/10 border-destructive text-destructive' :
    assessment.level === 'caution' ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400' :
    'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400';
  const Icon = assessment.level === 'safe' ? ShieldCheck : AlertTriangle;
  return (
    <div className={`mt-4 p-3 rounded-lg border flex items-start gap-2 ${styles}`}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium">{assessment.message}</p>
    </div>
  );
};

// ============ MOLAR MASS ============
const MolarMassTab: React.FC = () => {
  const [formula, setFormula] = useState('H2SO4');
  const result = useMemo(() => calculateMolarMass(formula), [formula]);

  return (
    <Card className="p-6 space-y-4">
      <div>
        <Label>Chemical formula</Label>
        <Input value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="e.g., H2SO4, Ca(OH)2, NaCl" />
        <p className="text-xs text-muted-foreground mt-1">Use proper case: H, Na, Ca, Cl. Subscripts as numbers (H2O), parentheses supported.</p>
      </div>

      {result ? (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Molar mass</p>
            <p className="text-3xl font-bold text-primary">{result.mass} g/mol</p>
          </div>
          <div>
            <Label className="text-xs">Breakdown</Label>
            <div className="space-y-1 mt-2">
              {result.breakdown.map((b) => (
                <div key={b.element} className="flex items-center justify-between text-sm border-b pb-1">
                  <span><span className="font-mono font-bold">{b.element}</span> × {b.count}</span>
                  <span className="text-muted-foreground">{b.mass.toFixed(3)} g/mol</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-destructive">Could not parse formula. Check element symbols (H, He, Li, Na, Cl…).</p>
      )}
    </Card>
  );
};

// ============ MOLARITY ============
const MolarityTab: React.FC = () => {
  const [chemical, setChemical] = useState('HCl');
  const [moles, setMoles] = useState('0.5');
  const [volume, setVolume] = useState('1');
  const m = parseFloat(moles);
  const v = parseFloat(volume);
  const molarity = v > 0 ? m / v : 0;
  const assessment = assessConcentration(chemical, molarity);
  return (
    <Card className="p-6 space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <Label>Chemical</Label>
          <Input value={chemical} onChange={(e) => setChemical(e.target.value)} />
        </div>
        <div>
          <Label>Moles (mol)</Label>
          <Input type="number" value={moles} onChange={(e) => setMoles(e.target.value)} />
        </div>
        <div>
          <Label>Volume (L)</Label>
          <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} />
        </div>
      </div>
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Molarity</p>
        <p className="text-3xl font-bold text-primary">{isFinite(molarity) ? molarity.toFixed(3) : '—'} mol/L</p>
        <p className="text-xs text-muted-foreground mt-1">Formula: M = n / V</p>
      </div>
      <SafetyBanner assessment={assessment} />
    </Card>
  );
};

// ============ DILUTION ============
const DilutionTab: React.FC = () => {
  const [chemical, setChemical] = useState('HCl');
  const [c1, setC1] = useState('5');
  const [c2, setC2] = useState('1');
  const [v2, setV2] = useState('0.5');
  const C1 = parseFloat(c1), C2 = parseFloat(c2), V2 = parseFloat(v2);
  const V1 = C1 > 0 ? (C2 * V2) / C1 : 0;
  const water = V2 - V1;
  const assessment = assessConcentration(chemical, C2);
  return (
    <Card className="p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Chemical</Label>
          <Input value={chemical} onChange={(e) => setChemical(e.target.value)} />
        </div>
        <div>
          <Label>Stock concentration C₁ (mol/L)</Label>
          <Input type="number" value={c1} onChange={(e) => setC1(e.target.value)} />
        </div>
        <div>
          <Label>Final concentration C₂ (mol/L)</Label>
          <Input type="number" value={c2} onChange={(e) => setC2(e.target.value)} />
        </div>
        <div>
          <Label>Final volume V₂ (L)</Label>
          <Input type="number" value={v2} onChange={(e) => setV2(e.target.value)} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Stock to take (V₁)</p>
          <p className="text-2xl font-bold text-primary">{isFinite(V1) ? (V1 * 1000).toFixed(1) : '—'} mL</p>
        </div>
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Water to add</p>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{isFinite(water) && water > 0 ? (water * 1000).toFixed(1) : '—'} mL</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Formula: C₁V₁ = C₂V₂. ⚠ For acids: always add ACID TO WATER, never the reverse.</p>
      <SafetyBanner assessment={assessment} />
    </Card>
  );
};

// ============ STOICHIOMETRY ============
const StoichTab: React.FC = () => {
  const [reactantFormula, setReactantFormula] = useState('NaOH');
  const [productFormula, setProductFormula] = useState('Na2SO4');
  const [reactantCoef, setReactantCoef] = useState('2');
  const [productCoef, setProductCoef] = useState('1');
  const [grams, setGrams] = useState('40');

  const rMass = useMemo(() => calculateMolarMass(reactantFormula), [reactantFormula]);
  const pMass = useMemo(() => calculateMolarMass(productFormula), [productFormula]);
  const rCoef = parseFloat(reactantCoef) || 1;
  const pCoef = parseFloat(productCoef) || 1;
  const g = parseFloat(grams) || 0;

  const productGrams = rMass && pMass ? (g / rMass.mass) * (pCoef / rCoef) * pMass.mass : null;

  return (
    <Card className="p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Calculate product yield: {rCoef} {reactantFormula} → {pCoef} {productFormula}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Reactant formula</Label>
          <Input value={reactantFormula} onChange={(e) => setReactantFormula(e.target.value)} />
        </div>
        <div>
          <Label>Product formula</Label>
          <Input value={productFormula} onChange={(e) => setProductFormula(e.target.value)} />
        </div>
        <div>
          <Label>Reactant coefficient</Label>
          <Input type="number" value={reactantCoef} onChange={(e) => setReactantCoef(e.target.value)} />
        </div>
        <div>
          <Label>Product coefficient</Label>
          <Input type="number" value={productCoef} onChange={(e) => setProductCoef(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Reactant mass (g)</Label>
          <Input type="number" value={grams} onChange={(e) => setGrams(e.target.value)} />
        </div>
      </div>
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Theoretical yield of {productFormula}</p>
        <p className="text-3xl font-bold text-primary">{productGrams !== null && isFinite(productGrams) ? productGrams.toFixed(2) : '—'} g</p>
      </div>
    </Card>
  );
};

// ============ UNIT CONVERSION ============
const UnitConvertTab: React.FC = () => {
  const [mode, setMode] = useState('g_to_mol');
  const [value, setValue] = useState('98');
  const [formula, setFormula] = useState('H2SO4');
  const [solute, setSolute] = useState('1');
  const [solution, setSolution] = useState('1000000');

  const mass = useMemo(() => calculateMolarMass(formula), [formula]);
  const v = parseFloat(value) || 0;

  let result = '—';
  let unit = '';
  if (mode === 'g_to_mol' && mass) {
    result = (v / mass.mass).toFixed(4);
    unit = 'mol';
  } else if (mode === 'mol_to_g' && mass) {
    result = (v * mass.mass).toFixed(3);
    unit = 'g';
  } else if (mode === 'ppm_to_pct') {
    result = (v / 10000).toFixed(6);
    unit = '%';
  } else if (mode === 'pct_to_ppm') {
    result = (v * 10000).toFixed(0);
    unit = 'ppm';
  } else if (mode === 'mass_ppm') {
    const sol = parseFloat(solute);
    const tot = parseFloat(solution);
    if (tot > 0) {
      result = ((sol / tot) * 1_000_000).toFixed(2);
      unit = 'ppm';
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <Label>Conversion type</Label>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="g_to_mol">Grams → Moles</SelectItem>
            <SelectItem value="mol_to_g">Moles → Grams</SelectItem>
            <SelectItem value="ppm_to_pct">ppm → %</SelectItem>
            <SelectItem value="pct_to_ppm">% → ppm</SelectItem>
            <SelectItem value="mass_ppm">Mass ratio → ppm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(mode === 'g_to_mol' || mode === 'mol_to_g') && (
        <>
          <div>
            <Label>Formula</Label>
            <Input value={formula} onChange={(e) => setFormula(e.target.value)} />
            {mass && <p className="text-xs text-muted-foreground mt-1">Molar mass: {mass.mass} g/mol</p>}
          </div>
          <div>
            <Label>Value</Label>
            <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </>
      )}

      {(mode === 'ppm_to_pct' || mode === 'pct_to_ppm') && (
        <div>
          <Label>Value</Label>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
      )}

      {mode === 'mass_ppm' && (
        <>
          <div>
            <Label>Mass of solute (g)</Label>
            <Input type="number" value={solute} onChange={(e) => setSolute(e.target.value)} />
          </div>
          <div>
            <Label>Total mass of solution (g)</Label>
            <Input type="number" value={solution} onChange={(e) => setSolution(e.target.value)} />
          </div>
        </>
      )}

      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Result</p>
        <p className="text-3xl font-bold text-primary">{result} {unit}</p>
      </div>
    </Card>
  );
};

const RecipeCalculatorPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የላቀ የኬሚስትሪ ካልኩሌተር' : 'Advanced Chemistry Calculator'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAm ? 'ስሌት + ደህንነት ማስጠንቀቂያ' : 'Calculations with built-in safety warnings'}
            </p>
          </div>
        </div>

        <Tabs defaultValue="molar">
          <TabsList className="grid grid-cols-5 mb-4 w-full">
            <TabsTrigger value="molar"><Atom className="h-4 w-4 mr-1 hidden sm:inline" />Molar</TabsTrigger>
            <TabsTrigger value="molarity"><Beaker className="h-4 w-4 mr-1 hidden sm:inline" />Molarity</TabsTrigger>
            <TabsTrigger value="dilution"><Droplets className="h-4 w-4 mr-1 hidden sm:inline" />Dilution</TabsTrigger>
            <TabsTrigger value="stoich"><FlaskConical className="h-4 w-4 mr-1 hidden sm:inline" />Stoich</TabsTrigger>
            <TabsTrigger value="convert"><Repeat className="h-4 w-4 mr-1 hidden sm:inline" />Convert</TabsTrigger>
          </TabsList>
          <TabsContent value="molar"><MolarMassTab /></TabsContent>
          <TabsContent value="molarity"><MolarityTab /></TabsContent>
          <TabsContent value="dilution"><DilutionTab /></TabsContent>
          <TabsContent value="stoich"><StoichTab /></TabsContent>
          <TabsContent value="convert"><UnitConvertTab /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RecipeCalculatorPage;
