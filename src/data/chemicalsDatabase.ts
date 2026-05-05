// Curated Chemical Safety Database
// Source: PubChem, NIOSH, OSHA standards
// Used for instant offline safety lookups before AI analysis

export interface ChemicalEntry {
  id: string;
  name: string;
  formula: string;
  aliases: string[];
  hazardClass: 'corrosive' | 'flammable' | 'toxic' | 'oxidizer' | 'irritant' | 'reactive' | 'safe';
  riskLevel: 1 | 2 | 3 | 4 | 5; // 1=safe, 5=extreme
  symbols: string[]; // GHS pictograms
  hazards: string[];
  firstAid: {
    skin: string;
    eyes: string;
    inhalation: string;
    ingestion: string;
  };
  storage: string;
  ppe: string[];
  incompatibleWith: string[]; // names of chemicals that cause dangerous reactions
  safeAlternatives?: string[];
}

export const CHEMICALS: ChemicalEntry[] = [
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    aliases: ['muriatic acid', 'hydrogen chloride', 'spirits of salt'],
    hazardClass: 'corrosive',
    riskLevel: 4,
    symbols: ['GHS05 (Corrosive)', 'GHS07 (Irritant)'],
    hazards: [
      'Causes severe skin burns and eye damage',
      'Releases toxic fumes when heated',
      'Reacts violently with bases, metals, and oxidizers',
    ],
    firstAid: {
      skin: 'Flush with plenty of water for at least 15 minutes. Remove contaminated clothing. Seek medical attention.',
      eyes: 'Flush eyes with water for 20+ minutes, lifting eyelids. Get immediate medical help — do NOT delay.',
      inhalation: 'Move to fresh air immediately. If breathing is difficult, give oxygen. Call ambulance (907).',
      ingestion: 'Do NOT induce vomiting. Rinse mouth, drink water/milk. Get emergency medical care.',
    },
    storage: 'Store in cool, well-ventilated area away from metals, bases, and oxidizers. Use acid-resistant containers.',
    ppe: ['Acid-resistant gloves', 'Chemical splash goggles', 'Lab coat', 'Face shield for >2M concentrations'],
    incompatibleWith: ['Sodium Hydroxide', 'Bleach', 'Potassium Permanganate', 'Ammonia', 'Aluminum', 'Zinc'],
    safeAlternatives: ['Citric acid (for cleaning)', 'Vinegar (mild descaling)'],
  },
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    aliases: ['lye', 'caustic soda', 'soda lye'],
    hazardClass: 'corrosive',
    riskLevel: 4,
    symbols: ['GHS05 (Corrosive)'],
    hazards: [
      'Causes severe burns to skin and eyes',
      'Generates extreme heat when dissolved in water',
      'Reacts dangerously with acids and aluminum',
    ],
    firstAid: {
      skin: 'Brush off solid first. Flush with copious water for 20+ minutes. Do NOT use creams. Seek medical care.',
      eyes: 'Flush continuously for 30 minutes. Get immediate ophthalmologic care — risk of blindness.',
      inhalation: 'Move to fresh air. Give oxygen if needed. Call 907.',
      ingestion: 'Do NOT induce vomiting. Drink water/milk. Emergency care immediately.',
    },
    storage: 'Airtight container in dry, cool area. Away from acids, water, aluminum, and organic materials.',
    ppe: ['Heavy nitrile/rubber gloves', 'Goggles + face shield', 'Lab coat', 'Apron for large quantities'],
    incompatibleWith: ['Hydrochloric Acid', 'Sulfuric Acid', 'Aluminum', 'Zinc', 'Tin', 'Ammonium salts'],
    safeAlternatives: ['Potassium hydroxide (for soap, slightly safer handling)', 'Washing soda (Na₂CO₃)'],
  },
  {
    id: 'h2so4',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    aliases: ['oil of vitriol', 'battery acid'],
    hazardClass: 'corrosive',
    riskLevel: 5,
    symbols: ['GHS05 (Corrosive)'],
    hazards: [
      'Extremely corrosive — causes deep tissue burns',
      'Violent reaction with water (always add acid TO water)',
      'Strong dehydrating agent — chars organic material',
    ],
    firstAid: {
      skin: 'Flush with massive amounts of water for 30+ minutes. Remove clothing under water. Hospital immediately.',
      eyes: 'Continuous flushing for 30+ min. Emergency eye care — risk of permanent blindness.',
      inhalation: 'Fresh air, oxygen, call 907 immediately.',
      ingestion: 'Do NOT vomit. Small sips of water. Emergency room — life-threatening.',
    },
    storage: 'Dedicated acid cabinet. Away from water, bases, organics, metals.',
    ppe: ['Heavy chemical gloves', 'Full face shield', 'Acid-proof apron', 'Closed shoes'],
    incompatibleWith: ['Water (when concentrated)', 'Sodium Hydroxide', 'Organic matter', 'Chlorates', 'Permanganates'],
  },
  {
    id: 'naclo',
    name: 'Sodium Hypochlorite (Bleach)',
    formula: 'NaClO',
    aliases: ['bleach', 'chlorine bleach', 'liquid bleach'],
    hazardClass: 'oxidizer',
    riskLevel: 3,
    symbols: ['GHS05 (Corrosive)', 'GHS09 (Environmental)'],
    hazards: [
      'Releases TOXIC chlorine gas when mixed with acids or ammonia',
      'Skin and eye irritation',
      'Damages clothing, metal, and many materials',
    ],
    firstAid: {
      skin: 'Wash with water and mild soap for 10 minutes.',
      eyes: 'Flush with water for 15 minutes. Medical attention if pain persists.',
      inhalation: 'Fresh air immediately. If chest tightness or coughing, call 907.',
      ingestion: 'Drink water or milk. Do NOT induce vomiting. Call poison control.',
    },
    storage: 'Cool, dark, well-ventilated. Far from acids, ammonia, and organic chemicals.',
    ppe: ['Rubber gloves', 'Splash goggles', 'Old clothing or apron'],
    incompatibleWith: ['Hydrochloric Acid', 'Ammonia', 'Vinegar', 'Hydrogen Peroxide', 'Rubbing Alcohol'],
    safeAlternatives: ['Hydrogen peroxide 3% (for disinfection)', 'Vinegar + heat (for some surfaces)'],
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH₃',
    aliases: ['ammonia solution', 'ammonium hydroxide'],
    hazardClass: 'toxic',
    riskLevel: 3,
    symbols: ['GHS05', 'GHS06 (Toxic)', 'GHS09'],
    hazards: [
      'Toxic by inhalation — damages respiratory system',
      'Forms toxic chloramine gas with bleach',
      'Severe eye and skin irritation',
    ],
    firstAid: {
      skin: 'Wash with plenty of water for 15 minutes.',
      eyes: 'Flush 20+ minutes. Seek medical care.',
      inhalation: 'Fresh air immediately, oxygen if needed, call 907.',
      ingestion: 'Drink water, do NOT vomit, get medical help.',
    },
    storage: 'Cool, ventilated area. Sealed container. Away from bleach, acids, and oxidizers.',
    ppe: ['Gloves', 'Goggles', 'Use only with ventilation/fume hood'],
    incompatibleWith: ['Bleach', 'Iodine', 'Mercury', 'Hydrochloric Acid', 'Hypochlorites'],
  },
  {
    id: 'h2o2',
    name: 'Hydrogen Peroxide',
    formula: 'H₂O₂',
    aliases: ['peroxide'],
    hazardClass: 'oxidizer',
    riskLevel: 2,
    symbols: ['GHS07'],
    hazards: [
      'Mild irritant at 3%; corrosive at >10%',
      'Strong oxidizer — fire risk with organics at high concentration',
      'Decomposes to oxygen — pressure buildup in sealed containers',
    ],
    firstAid: {
      skin: 'Rinse with water. Mild redness usually resolves.',
      eyes: 'Flush 15 minutes. See doctor if pain continues.',
      inhalation: 'Fresh air; usually no severe effects at low concentration.',
      ingestion: 'Drink water. For >3%, get medical help.',
    },
    storage: 'Cool, dark place. Vented cap. Away from organics and metals.',
    ppe: ['Gloves', 'Goggles for >6%'],
    incompatibleWith: ['Bleach', 'Iron', 'Copper', 'Manganese', 'Acetone'],
  },
  {
    id: 'ch3coOH',
    name: 'Acetic Acid (Vinegar)',
    formula: 'CH₃COOH',
    aliases: ['vinegar', 'ethanoic acid'],
    hazardClass: 'irritant',
    riskLevel: 1,
    symbols: ['GHS07 (>10%)'],
    hazards: [
      'Mild at household concentration (5%)',
      'Corrosive when concentrated (glacial, >50%)',
      'Reacts with bleach to release chlorine gas',
    ],
    firstAid: {
      skin: 'Rinse with water.',
      eyes: 'Flush 15 minutes.',
      inhalation: 'Fresh air.',
      ingestion: 'Drink water (small amounts safe at household strength).',
    },
    storage: 'Sealed container, away from bleach and bases.',
    ppe: ['Gloves and goggles for >10%'],
    incompatibleWith: ['Bleach', 'Sodium Hydroxide', 'Strong oxidizers'],
  },
  {
    id: 'nahco3',
    name: 'Sodium Bicarbonate',
    formula: 'NaHCO₃',
    aliases: ['baking soda', 'bicarb'],
    hazardClass: 'safe',
    riskLevel: 1,
    symbols: [],
    hazards: ['Generally safe; mild irritant if inhaled as fine dust'],
    firstAid: {
      skin: 'Rinse with water.',
      eyes: 'Flush with water.',
      inhalation: 'Fresh air.',
      ingestion: 'Safe in small amounts.',
    },
    storage: 'Dry, sealed container.',
    ppe: ['Dust mask if handling large quantities'],
    incompatibleWith: ['Strong acids (releases CO₂ vigorously)'],
  },
  {
    id: 'kmno4',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    aliases: ['Condy\'s crystals'],
    hazardClass: 'oxidizer',
    riskLevel: 4,
    symbols: ['GHS03 (Oxidizer)', 'GHS07', 'GHS09'],
    hazards: [
      'Strong oxidizer — fire/explosion risk with organics, glycerin',
      'Stains skin brown',
      'Corrosive in concentrated solutions',
    ],
    firstAid: {
      skin: 'Wash thoroughly. Stains will fade.',
      eyes: 'Flush 20 minutes, get medical care.',
      inhalation: 'Fresh air.',
      ingestion: 'Do not vomit, get medical help.',
    },
    storage: 'Dry, away from organics, glycerin, hydrogen peroxide, alcohols.',
    ppe: ['Gloves', 'Goggles', 'No flammable clothing'],
    incompatibleWith: ['Glycerin', 'Hydrogen Peroxide', 'Hydrochloric Acid', 'Sulfuric Acid', 'Alcohols'],
  },
  {
    id: 'c2h5oh',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    aliases: ['ethyl alcohol', 'drinking alcohol', 'rubbing alcohol (some)'],
    hazardClass: 'flammable',
    riskLevel: 2,
    symbols: ['GHS02 (Flammable)', 'GHS07'],
    hazards: ['Highly flammable', 'Eye and respiratory irritant', 'CNS depressant if ingested in quantity'],
    firstAid: {
      skin: 'Wash with water.',
      eyes: 'Flush 15 minutes.',
      inhalation: 'Fresh air.',
      ingestion: 'Get medical attention for large amounts.',
    },
    storage: 'Cool, ventilated, away from sparks/flames and oxidizers.',
    ppe: ['Goggles', 'Gloves', 'No open flames nearby'],
    incompatibleWith: ['Potassium Permanganate', 'Strong oxidizers', 'Nitric Acid'],
  },
];

// Find chemical by name/alias/formula (case-insensitive partial match)
export function findChemical(query: string): ChemicalEntry | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  return (
    CHEMICALS.find(
      (c) =>
        c.name.toLowerCase() === q ||
        c.formula.toLowerCase() === q ||
        c.aliases.some((a) => a.toLowerCase() === q)
    ) ||
    CHEMICALS.find(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.formula.toLowerCase().includes(q) ||
        c.aliases.some((a) => a.toLowerCase().includes(q))
    ) ||
    null
  );
}

// Check if two chemicals are dangerously incompatible
export function checkCompatibility(
  a: ChemicalEntry,
  b: ChemicalEntry
): { dangerous: boolean; reason?: string } {
  const aIncompatible = a.incompatibleWith.some(
    (name) => b.name.toLowerCase().includes(name.toLowerCase()) || b.aliases.some((al) => name.toLowerCase().includes(al.toLowerCase()))
  );
  const bIncompatible = b.incompatibleWith.some(
    (name) => a.name.toLowerCase().includes(name.toLowerCase()) || a.aliases.some((al) => name.toLowerCase().includes(al.toLowerCase()))
  );
  if (aIncompatible || bIncompatible) {
    return {
      dangerous: true,
      reason: `${a.name} and ${b.name} are chemically incompatible. Mixing can produce toxic gases, heat, fire, or explosion.`,
    };
  }
  return { dangerous: false };
}

// Atomic masses for molar mass calculator
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.94, Be: 9.012, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06,
  Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.63,
  As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224,
  Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
  In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.6, I: 126.9, Xe: 131.29, Cs: 132.91, Ba: 137.33,
  Hg: 200.59, Pb: 207.2, Bi: 208.98,
};

// Parse a formula like "H2SO4" or "Ca(OH)2" and return molar mass
export function calculateMolarMass(formula: string): { mass: number; breakdown: { element: string; count: number; mass: number }[] } | null {
  if (!formula || !formula.trim()) return null;
  // Tokenize: handle parentheses by expanding
  const expand = (f: string): string => {
    let s = f;
    let depth = 0;
    while (s.includes('(')) {
      const match = s.match(/\(([^()]+)\)(\d*)/);
      if (!match) break;
      const inner = match[1];
      const mult = parseInt(match[2] || '1', 10);
      const expanded = inner.replace(/([A-Z][a-z]?)(\d*)/g, (_, el, n) => {
        const c = parseInt(n || '1', 10) * mult;
        return el + (c > 1 ? c : '');
      });
      s = s.replace(match[0], expanded);
      if (++depth > 10) break;
    }
    return s;
  };
  try {
    const expanded = expand(formula.replace(/\s/g, ''));
    const tokens = expanded.match(/[A-Z][a-z]?\d*/g);
    if (!tokens) return null;
    const counts: Record<string, number> = {};
    for (const t of tokens) {
      const m = t.match(/^([A-Z][a-z]?)(\d*)$/);
      if (!m) continue;
      const el = m[1];
      const n = parseInt(m[2] || '1', 10);
      counts[el] = (counts[el] || 0) + n;
    }
    const breakdown = Object.entries(counts).map(([el, n]) => {
      const m = ATOMIC_MASSES[el];
      if (m == null) throw new Error(`Unknown element: ${el}`);
      return { element: el, count: n, mass: m * n };
    });
    const mass = breakdown.reduce((sum, b) => sum + b.mass, 0);
    return { mass: Math.round(mass * 1000) / 1000, breakdown };
  } catch {
    return null;
  }
}
