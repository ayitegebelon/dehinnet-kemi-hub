import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Atom, Plus, Trash2, Info, Beaker, Search } from 'lucide-react';

interface AtomEntry {
  symbol: string;
  count: number;
  name: string;
  mass: number;
}

const ATOM_DATA: Record<string, { name: string; mass: number; nameAm: string; category: string }> = {
  H: { name: 'Hydrogen', mass: 1.008, nameAm: 'ሃይድሮጅን', category: 'Nonmetal' },
  He: { name: 'Helium', mass: 4.003, nameAm: 'ሂሊየም', category: 'Noble Gas' },
  Li: { name: 'Lithium', mass: 6.941, nameAm: 'ሊቲየም', category: 'Alkali Metal' },
  Be: { name: 'Beryllium', mass: 9.012, nameAm: 'ቤሪሊየም', category: 'Alkaline Earth' },
  B: { name: 'Boron', mass: 10.81, nameAm: 'ቦሮን', category: 'Metalloid' },
  C: { name: 'Carbon', mass: 12.011, nameAm: 'ካርቦን', category: 'Nonmetal' },
  N: { name: 'Nitrogen', mass: 14.007, nameAm: 'ናይትሮጅን', category: 'Nonmetal' },
  O: { name: 'Oxygen', mass: 15.999, nameAm: 'ኦክስጅን', category: 'Nonmetal' },
  F: { name: 'Fluorine', mass: 18.998, nameAm: 'ፍሎሪን', category: 'Halogen' },
  Ne: { name: 'Neon', mass: 20.180, nameAm: 'ኒዮን', category: 'Noble Gas' },
  Na: { name: 'Sodium', mass: 22.990, nameAm: 'ሶዲየም', category: 'Alkali Metal' },
  Mg: { name: 'Magnesium', mass: 24.305, nameAm: 'ማግኒዚየም', category: 'Alkaline Earth' },
  Al: { name: 'Aluminum', mass: 26.982, nameAm: 'አሉሚኒየም', category: 'Post-transition Metal' },
  Si: { name: 'Silicon', mass: 28.086, nameAm: 'ሲሊኮን', category: 'Metalloid' },
  P: { name: 'Phosphorus', mass: 30.974, nameAm: 'ፎስፈረስ', category: 'Nonmetal' },
  S: { name: 'Sulfur', mass: 32.065, nameAm: 'ሰልፈር', category: 'Nonmetal' },
  Cl: { name: 'Chlorine', mass: 35.453, nameAm: 'ክሎሪን', category: 'Halogen' },
  K: { name: 'Potassium', mass: 39.098, nameAm: 'ፖታሲየም', category: 'Alkali Metal' },
  Ca: { name: 'Calcium', mass: 40.078, nameAm: 'ካልሲየም', category: 'Alkaline Earth' },
  Fe: { name: 'Iron', mass: 55.845, nameAm: 'ብረት', category: 'Transition Metal' },
  Cu: { name: 'Copper', mass: 63.546, nameAm: 'መዳብ', category: 'Transition Metal' },
  Zn: { name: 'Zinc', mass: 65.38, nameAm: 'ዚንክ', category: 'Transition Metal' },
  Br: { name: 'Bromine', mass: 79.904, nameAm: 'ብሮሚን', category: 'Halogen' },
  Ag: { name: 'Silver', mass: 107.868, nameAm: 'ብር', category: 'Transition Metal' },
  I: { name: 'Iodine', mass: 126.904, nameAm: 'አዮዲን', category: 'Halogen' },
  Au: { name: 'Gold', mass: 196.967, nameAm: 'ወርቅ', category: 'Transition Metal' },
};

const COMMON_MOLECULES = [
  { formula: 'H2O', name: 'Water', nameAm: 'ውሃ', atoms: [{ s: 'H', c: 2 }, { s: 'O', c: 1 }] },
  { formula: 'CO2', name: 'Carbon Dioxide', nameAm: 'ካርቦን ዳይኦክሳይድ', atoms: [{ s: 'C', c: 1 }, { s: 'O', c: 2 }] },
  { formula: 'NaCl', name: 'Sodium Chloride', nameAm: 'ጨው', atoms: [{ s: 'Na', c: 1 }, { s: 'Cl', c: 1 }] },
  { formula: 'H2SO4', name: 'Sulfuric Acid', nameAm: 'ሰልፊዩሪክ አሲድ', atoms: [{ s: 'H', c: 2 }, { s: 'S', c: 1 }, { s: 'O', c: 4 }] },
  { formula: 'CH4', name: 'Methane', nameAm: 'ሚቴን', atoms: [{ s: 'C', c: 1 }, { s: 'H', c: 4 }] },
  { formula: 'NH3', name: 'Ammonia', nameAm: 'አሞኒያ', atoms: [{ s: 'N', c: 1 }, { s: 'H', c: 3 }] },
  { formula: 'C6H12O6', name: 'Glucose', nameAm: 'ግሉኮስ', atoms: [{ s: 'C', c: 6 }, { s: 'H', c: 12 }, { s: 'O', c: 6 }] },
  { formula: 'CaCO3', name: 'Calcium Carbonate', nameAm: 'ካልሲየም ካርቦኔት', atoms: [{ s: 'Ca', c: 1 }, { s: 'C', c: 1 }, { s: 'O', c: 3 }] },
];

const MoleculeBuilderPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const [atoms, setAtoms] = useState<AtomEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addAtom = (symbol: string) => {
    const existing = atoms.find(a => a.symbol === symbol);
    if (existing) {
      setAtoms(atoms.map(a => a.symbol === symbol ? { ...a, count: a.count + 1 } : a));
    } else {
      const data = ATOM_DATA[symbol];
      if (data) setAtoms([...atoms, { symbol, count: 1, name: data.name, mass: data.mass }]);
    }
  };

  const removeAtom = (symbol: string) => {
    setAtoms(atoms.filter(a => a.symbol !== symbol));
  };

  const updateCount = (symbol: string, delta: number) => {
    setAtoms(atoms.map(a => {
      if (a.symbol !== symbol) return a;
      const newCount = Math.max(1, a.count + delta);
      return { ...a, count: newCount };
    }));
  };

  const loadMolecule = (mol: typeof COMMON_MOLECULES[0]) => {
    setAtoms(mol.atoms.map(a => ({
      symbol: a.s,
      count: a.c,
      name: ATOM_DATA[a.s]?.name || '',
      mass: ATOM_DATA[a.s]?.mass || 0,
    })));
  };

  const totalMass = atoms.reduce((sum, a) => sum + a.mass * a.count, 0);
  const formula = atoms.map(a => `${a.symbol}${a.count > 1 ? a.count : ''}`).join('');
  const totalAtoms = atoms.reduce((sum, a) => sum + a.count, 0);

  const filteredElements = Object.entries(ATOM_DATA).filter(([sym, data]) =>
    sym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Beaker className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'ሞለኪዩል ገንቢ' : 'Molecule Builder'}</h1>
            <p className="text-muted-foreground text-sm">{isAm ? 'ሞለኪዩሎችን ይገንቡ እና ክብደታቸውን ያስሉ' : 'Build molecules and calculate molecular weight'}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Element Picker */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{isAm ? 'ንጥረ ነገሮች' : 'Elements'}</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={isAm ? 'ፈልግ...' : 'Search...'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60">
                  <div className="grid grid-cols-4 gap-1.5">
                    {filteredElements.map(([sym, data]) => (
                      <button
                        key={sym}
                        onClick={() => addAtom(sym)}
                        className="flex flex-col items-center p-2 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
                        title={isAm ? data.nameAm : data.name}
                      >
                        <span className="text-sm font-bold">{sym}</span>
                        <span className="text-[9px] text-muted-foreground">{data.mass.toFixed(1)}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Common Molecules */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{isAm ? 'የተለመዱ ሞለኪዩሎች' : 'Common Molecules'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_MOLECULES.map(mol => (
                    <button
                      key={mol.formula}
                      onClick={() => loadMolecule(mol)}
                      className="text-left p-2 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all"
                    >
                      <p className="font-mono text-sm font-bold">{mol.formula}</p>
                      <p className="text-[10px] text-muted-foreground">{isAm ? mol.nameAm : mol.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Builder Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Formula Display */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="py-6 text-center">
                {atoms.length === 0 ? (
                  <div className="py-4">
                    <Atom className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-muted-foreground">{isAm ? 'ንጥረ ነገሮችን ይጨምሩ' : 'Add elements to build a molecule'}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-4xl font-mono font-bold tracking-wide mb-2">{formula}</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <span>{isAm ? 'ሞለኪዩላር ክብደት' : 'Molecular Weight'}: <strong className="text-foreground">{totalMass.toFixed(3)} g/mol</strong></span>
                      <span>{isAm ? 'ጠቅላላ አቶሞች' : 'Total Atoms'}: <strong className="text-foreground">{totalAtoms}</strong></span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Atom List */}
            {atoms.length > 0 && (
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{isAm ? 'ቅንብር' : 'Composition'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setAtoms([])}>
                    <Trash2 className="h-4 w-4 mr-1" />{isAm ? 'አጽዳ' : 'Clear'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {atoms.map(atom => {
                      const percent = totalMass > 0 ? ((atom.mass * atom.count) / totalMass * 100) : 0;
                      return (
                        <div key={atom.symbol} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {atom.symbol}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{isAm ? ATOM_DATA[atom.symbol]?.nameAm : atom.name}</span>
                              <span className="text-xs text-muted-foreground">{(atom.mass * atom.count).toFixed(3)} g/mol ({percent.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCount(atom.symbol, -1)}>-</Button>
                            <span className="w-8 text-center font-mono text-sm">{atom.count}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCount(atom.symbol, 1)}>+</Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeAtom(atom.symbol)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoleculeBuilderPage;
