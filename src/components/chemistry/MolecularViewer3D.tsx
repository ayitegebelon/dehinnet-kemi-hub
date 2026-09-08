import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Text, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Atom, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Atom colors based on CPK coloring convention
const ATOM_COLORS: Record<string, string> = {
  H: '#FFFFFF',
  C: '#909090',
  N: '#3050F8',
  O: '#FF0D0D',
  S: '#FFFF30',
  P: '#FF8000',
  Cl: '#1FF01F',
  Br: '#A62929',
  F: '#90E050',
  I: '#940094',
  Na: '#AB5CF2',
  K: '#8F40D4',
  Ca: '#3DFF00',
  Fe: '#E06633',
  Cu: '#C88033',
  Zn: '#7D80B0',
  Mg: '#8AFF00',
};

// Atom radii (relative scale)
const ATOM_RADII: Record<string, number> = {
  H: 0.25,
  C: 0.4,
  N: 0.38,
  O: 0.35,
  S: 0.5,
  P: 0.45,
  Cl: 0.48,
  Br: 0.55,
  F: 0.32,
  I: 0.6,
  Na: 0.45,
  K: 0.55,
  Ca: 0.5,
  Fe: 0.4,
  Cu: 0.35,
  Zn: 0.38,
  Mg: 0.42,
};

// Molecule definitions with 3D coordinates
interface AtomData {
  element: string;
  position: [number, number, number];
}

interface BondData {
  start: number;
  end: number;
  order: number;
}

interface MoleculeData {
  name: string;
  nameAm: string;
  formula: string;
  atoms: AtomData[];
  bonds: BondData[];
  description: string;
  descriptionAm: string;
}

const MOLECULES: Record<string, MoleculeData> = {
  water: {
    name: 'Water',
    nameAm: 'ውሃ',
    formula: 'H₂O',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'H', position: [0.76, 0.59, 0] },
      { element: 'H', position: [-0.76, 0.59, 0] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
      { start: 0, end: 2, order: 1 },
    ],
    description: 'Essential for life, water has a bent molecular structure with a 104.5° bond angle.',
    descriptionAm: 'ለሕይወት አስፈላጊ፣ ውሃ ከ104.5° ማሰሪያ አንግል ጋር የታጠፈ ሞለኪውላር መዋቅር አለው።',
  },
  carbonDioxide: {
    name: 'Carbon Dioxide',
    nameAm: 'ካርቦን ዳይኦክሳይድ',
    formula: 'CO₂',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'O', position: [-1.16, 0, 0] },
      { element: 'O', position: [1.16, 0, 0] },
    ],
    bonds: [
      { start: 0, end: 1, order: 2 },
      { start: 0, end: 2, order: 2 },
    ],
    description: 'Linear molecule with 180° bond angle, a greenhouse gas produced by respiration and combustion.',
    descriptionAm: 'ከ180° ማሰሪያ አንግል ጋር ቀጥተኛ ሞለኪውል፣ በመተንፈስ እና በማቃጠል የሚመረት የግሪንሃውስ ጋዝ።',
  },
  methane: {
    name: 'Methane',
    nameAm: 'ሚቴን',
    formula: 'CH₄',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'H', position: [0.63, 0.63, 0.63] },
      { element: 'H', position: [-0.63, -0.63, 0.63] },
      { element: 'H', position: [-0.63, 0.63, -0.63] },
      { element: 'H', position: [0.63, -0.63, -0.63] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
      { start: 0, end: 2, order: 1 },
      { start: 0, end: 3, order: 1 },
      { start: 0, end: 4, order: 1 },
    ],
    description: 'Tetrahedral molecule with 109.5° bond angles, the simplest hydrocarbon.',
    descriptionAm: 'ከ109.5° ማሰሪያ አንግሎች ጋር ቴትራሄድራል ሞለኪውል፣ ቀላሉ ሃይድሮካርበን።',
  },
  ammonia: {
    name: 'Ammonia',
    nameAm: 'አሞኒያ',
    formula: 'NH₃',
    atoms: [
      { element: 'N', position: [0, 0, 0] },
      { element: 'H', position: [0.94, 0.38, 0] },
      { element: 'H', position: [-0.47, 0.38, 0.81] },
      { element: 'H', position: [-0.47, 0.38, -0.81] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
      { start: 0, end: 2, order: 1 },
      { start: 0, end: 3, order: 1 },
    ],
    description: 'Trigonal pyramidal molecule with a lone pair on nitrogen, used in fertilizers.',
    descriptionAm: 'በናይትሮጅን ላይ ብቸኛ ጥንድ ያለው ትሪጎናል ፒራሚዳል ሞለኪውል፣ ለማዳበሪያ ይጠቅማል።',
  },
  ethanol: {
    name: 'Ethanol',
    nameAm: 'ኤታኖል',
    formula: 'C₂H₅OH',
    atoms: [
      { element: 'C', position: [-0.75, 0, 0] },
      { element: 'C', position: [0.75, 0, 0] },
      { element: 'O', position: [1.5, 1.2, 0] },
      { element: 'H', position: [-1.2, 0.9, 0.4] },
      { element: 'H', position: [-1.2, -0.9, 0.4] },
      { element: 'H', position: [-1.2, 0, -1] },
      { element: 'H', position: [0.9, -0.6, 0.9] },
      { element: 'H', position: [0.9, -0.6, -0.9] },
      { element: 'H', position: [2.3, 1.5, 0] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
      { start: 1, end: 2, order: 1 },
      { start: 0, end: 3, order: 1 },
      { start: 0, end: 4, order: 1 },
      { start: 0, end: 5, order: 1 },
      { start: 1, end: 6, order: 1 },
      { start: 1, end: 7, order: 1 },
      { start: 2, end: 8, order: 1 },
    ],
    description: 'Common alcohol found in beverages and used as a solvent and fuel.',
    descriptionAm: 'በመጠጦች ውስጥ የሚገኝ የተለመደ አልኮል እና እንደ ማሟሟት እና ነዳጅ ይጠቅማል።',
  },
  sodiumChloride: {
    name: 'Sodium Chloride',
    nameAm: 'ሶዲየም ክሎራይድ',
    formula: 'NaCl',
    atoms: [
      { element: 'Na', position: [-0.8, 0, 0] },
      { element: 'Cl', position: [0.8, 0, 0] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
    ],
    description: 'Common table salt, an ionic compound essential for human health.',
    descriptionAm: 'የተለመደ የጠረጴዛ ጨው፣ ለሰው ጤና አስፈላጊ የሆነ ionic ውህድ።',
  },
  glucose: {
    name: 'Glucose',
    nameAm: 'ግሉኮስ',
    formula: 'C₆H₁₂O₆',
    atoms: [
      // Simplified ring structure
      { element: 'C', position: [1.2, 0.3, 0] },
      { element: 'C', position: [0.6, 1.2, 0.3] },
      { element: 'C', position: [-0.6, 1.2, 0.3] },
      { element: 'C', position: [-1.2, 0.3, 0] },
      { element: 'C', position: [-0.6, -0.6, -0.3] },
      { element: 'O', position: [0.6, -0.6, -0.3] },
      { element: 'O', position: [2.0, 0.3, 0.5] },
      { element: 'O', position: [0.9, 2.1, 0.6] },
      { element: 'O', position: [-0.9, 2.1, 0.6] },
      { element: 'O', position: [-2.0, 0.3, 0.5] },
      { element: 'C', position: [-0.9, -1.6, -0.5] },
      { element: 'O', position: [-0.6, -2.3, 0.7] },
    ],
    bonds: [
      { start: 0, end: 1, order: 1 },
      { start: 1, end: 2, order: 1 },
      { start: 2, end: 3, order: 1 },
      { start: 3, end: 4, order: 1 },
      { start: 4, end: 5, order: 1 },
      { start: 5, end: 0, order: 1 },
      { start: 0, end: 6, order: 1 },
      { start: 1, end: 7, order: 1 },
      { start: 2, end: 8, order: 1 },
      { start: 3, end: 9, order: 1 },
      { start: 4, end: 10, order: 1 },
      { start: 10, end: 11, order: 1 },
    ],
    description: 'Essential sugar and primary energy source for living organisms.',
    descriptionAm: 'አስፈላጊ ስኳር እና ለሕይወት ያላቸው ፍጥረታት ዋና የኃይል ምንጭ።',
  },
  aspirinMolecule: {
    name: 'Aspirin',
    nameAm: 'አስፕሪን',
    formula: 'C₉H₈O₄',
    atoms: [
      // Benzene ring
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.2, 0.7, 0] },
      { element: 'C', position: [1.2, 2.1, 0] },
      { element: 'C', position: [0, 2.8, 0] },
      { element: 'C', position: [-1.2, 2.1, 0] },
      { element: 'C', position: [-1.2, 0.7, 0] },
      // Carboxylic acid group
      { element: 'C', position: [0, -1.4, 0] },
      { element: 'O', position: [1.0, -2.0, 0] },
      { element: 'O', position: [-1.0, -2.0, 0] },
      // Ester group
      { element: 'O', position: [2.4, 0, 0] },
      { element: 'C', position: [3.2, -1.0, 0] },
      { element: 'O', position: [4.2, -1.2, 0] },
      { element: 'C', position: [2.6, -2.2, 0] },
    ],
    bonds: [
      { start: 0, end: 1, order: 2 },
      { start: 1, end: 2, order: 1 },
      { start: 2, end: 3, order: 2 },
      { start: 3, end: 4, order: 1 },
      { start: 4, end: 5, order: 2 },
      { start: 5, end: 0, order: 1 },
      { start: 0, end: 6, order: 1 },
      { start: 6, end: 7, order: 2 },
      { start: 6, end: 8, order: 1 },
      { start: 1, end: 9, order: 1 },
      { start: 9, end: 10, order: 1 },
      { start: 10, end: 11, order: 2 },
      { start: 10, end: 12, order: 1 },
    ],
    description: 'Pain reliever and anti-inflammatory drug, one of the most widely used medications.',
    descriptionAm: 'ህመም ማስታገስ እና ፀረ-ብግነት መድሃኒት፣ በሰፊው ከሚጠቀሙ መድሃኒቶች አንዱ።',
  },
};

// 3D Atom Component
const Atom3D: React.FC<{
  element: string;
  position: [number, number, number];
  showLabel?: boolean;
}> = ({ element, position, showLabel = true }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = ATOM_COLORS[element] || '#808080';
  const radius = ATOM_RADII[element] || 0.4;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[radius, 32, 32]}>
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Sphere>
      {showLabel && (
        <Text
          position={[0, radius + 0.2, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
        >
          {element}
        </Text>
      )}
    </group>
  );
};

// 3D Bond Component
const Bond3D: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  order: number;
}> = ({ start, end, order }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = startVec.clone().add(endVec).divideScalar(2);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  
  // Calculate rotation
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(axis, direction.clone().normalize());
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  const bondRadius = 0.06;
  const spacing = 0.15;

  if (order === 1) {
    return (
      <group position={[midPoint.x, midPoint.y, midPoint.z]} rotation={[euler.x, euler.y, euler.z]}>
        <Cylinder args={[bondRadius, bondRadius, length, 8]}>
          <meshStandardMaterial color="#888888" metalness={0.2} roughness={0.6} />
        </Cylinder>
      </group>
    );
  }

  // Double or triple bonds
  return (
    <group position={[midPoint.x, midPoint.y, midPoint.z]} rotation={[euler.x, euler.y, euler.z]}>
      {Array.from({ length: order }).map((_, i) => {
        const offset = (i - (order - 1) / 2) * spacing;
        return (
          <Cylinder key={i} args={[bondRadius * 0.8, bondRadius * 0.8, length, 8]} position={[offset, 0, 0]}>
            <meshStandardMaterial color="#888888" metalness={0.2} roughness={0.6} />
          </Cylinder>
        );
      })}
    </group>
  );
};

// Molecule Scene
const MoleculeScene: React.FC<{
  molecule: MoleculeData;
  showLabels: boolean;
  autoRotate: boolean;
}> = ({ molecule, showLabels, autoRotate }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render bonds first (behind atoms) */}
      {molecule.bonds.map((bond, i) => (
        <Bond3D
          key={`bond-${i}`}
          start={molecule.atoms[bond.start].position}
          end={molecule.atoms[bond.end].position}
          order={bond.order}
        />
      ))}
      
      {/* Render atoms */}
      {molecule.atoms.map((atom, i) => (
        <Float key={`atom-${i}`} speed={2} rotationIntensity={0} floatIntensity={0.1}>
          <Atom3D
            element={atom.element}
            position={atom.position}
            showLabel={showLabels}
          />
        </Float>
      ))}
    </group>
  );
};

// Main Component
const MolecularViewer3D: React.FC = () => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  const [selectedMolecule, setSelectedMolecule] = useState<keyof typeof MOLECULES>('water');
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(5);

  const molecule = MOLECULES[selectedMolecule];

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="gradient-text">
              {isAmharic ? '3D ሞለኪውላር ቪወር' : '3D Molecular Viewer'}
            </span>
            <Badge variant="secondary" className="ml-2 font-mono">{molecule.formula}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Controls */}
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center bg-muted/30">
          <Select value={selectedMolecule} onValueChange={(v) => setSelectedMolecule(v as keyof typeof MOLECULES)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MOLECULES).map(([key, mol]) => (
                <SelectItem key={key} value={key}>
                  <span className="font-mono mr-2">{mol.formula}</span>
                  {isAmharic ? mol.nameAm : mol.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={autoRotate ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {isAmharic ? 'አዙር' : 'Rotate'}
            </Button>
            <Button
              variant={showLabels ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
            >
              {isAmharic ? 'መለያዎች' : 'Labels'}
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(z + 1, 10))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(z - 1, 2))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="h-[400px] bg-gradient-to-b from-slate-900 to-slate-800">
          <Canvas camera={{ position: [0, 0, zoom], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />
            <Suspense fallback={null}>
              <MoleculeScene
                molecule={molecule}
                showLabels={showLabels}
                autoRotate={autoRotate}
              />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={!autoRotate}
              minDistance={2}
              maxDistance={10}
            />
          </Canvas>
        </div>

        {/* Info Panel */}
        <div className="p-4 bg-gradient-to-r from-muted/50 to-card">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="text-xl font-bold">{isAmharic ? molecule.nameAm : molecule.name}</h3>
            <Badge variant="outline" className="font-mono text-lg">{molecule.formula}</Badge>
          </div>
          <p className="text-muted-foreground">
            {isAmharic ? molecule.descriptionAm : molecule.description}
          </p>
          
          {/* Atom Legend */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from(new Set(molecule.atoms.map(a => a.element))).map(element => (
              <Badge
                key={element}
                variant="secondary"
                className="flex items-center gap-2"
                style={{ borderColor: ATOM_COLORS[element] }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ATOM_COLORS[element] }}
                />
                {element}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MolecularViewer3D;
