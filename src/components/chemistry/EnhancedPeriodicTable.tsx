import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { elements, Element, categoryColors, categoryNames, ElementCategory } from '@/data/elements';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Atom, Zap, Thermometer, Scale, X, Info, Sparkles, Grid3X3, Beaker } from 'lucide-react';
import MolecularViewer3D from './MolecularViewer3D';

// Element to molecule mapping for quick visualization
const ELEMENT_MOLECULE_MAP: Record<string, string> = {
  H: 'water',
  O: 'water',
  C: 'methane',
  N: 'ammonia',
  Na: 'sodiumChloride',
  Cl: 'sodiumChloride',
};

// Enhanced Element Card with 3D hover effect
const ElementCard: React.FC<{
  element: Element;
  onClick: () => void;
  isAmharic: boolean;
  isHighlighted: boolean;
  viewMode: 'standard' | 'compact';
}> = ({ element, onClick, isAmharic, isHighlighted, viewMode }) => {
  const categoryClass = categoryColors[element.category];
  
  const baseClasses = viewMode === 'compact' 
    ? 'w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem]'
    : 'w-[3.5rem] h-[3.5rem] md:w-[4rem] md:h-[4rem]';
  
  return (
    <div
      onClick={onClick}
      className={`element-card ${categoryClass} ${baseClasses} flex flex-col items-center justify-center text-center group cursor-pointer
        ${isHighlighted ? 'ring-2 ring-primary ring-offset-2 scale-110 z-10' : ''}
        transition-all duration-300 hover:scale-110 hover:z-10`}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <span className="text-[8px] md:text-[10px] text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
        {element.atomicNumber}
      </span>
      <span className={`${viewMode === 'compact' ? 'text-sm md:text-base' : 'text-lg md:text-xl'} font-bold leading-none`}>
        {element.symbol}
      </span>
      {viewMode === 'standard' && (
        <span className="text-[7px] md:text-[9px] truncate max-w-full px-0.5 text-muted-foreground">
          {isAmharic ? element.nameAm : element.nameEn}
        </span>
      )}
    </div>
  );
};

// Enhanced Element Detail Modal with more info
const ElementDetailModal: React.FC<{
  element: Element | null;
  onClose: () => void;
  isAmharic: boolean;
}> = ({ element, onClose, isAmharic }) => {
  if (!element) return null;
  
  const categoryClass = categoryColors[element.category];
  const categoryName = categoryNames[element.category];
  
  // Electron shell visualization
  const getElectronShells = (config: string) => {
    // Simplified shell counts for visualization
    const shells = [2, 8, 18, 32, 32, 18, 8]; // Max electrons per shell
    const electronCount = element.atomicNumber;
    const filled: number[] = [];
    let remaining = electronCount;
    
    for (let i = 0; i < shells.length && remaining > 0; i++) {
      const toAdd = Math.min(remaining, shells[i]);
      filled.push(toAdd);
      remaining -= toAdd;
    }
    
    return filled;
  };
  
  const electronShells = getElectronShells(element.electronConfig);
  
  return (
    <Dialog open={!!element} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl ${categoryClass} flex flex-col items-center justify-center relative overflow-hidden`}>
              <span className="text-[10px] absolute top-1 left-2 opacity-60">{element.atomicNumber}</span>
              <span className="text-4xl font-bold">{element.symbol}</span>
              <span className="text-[10px] absolute bottom-1 opacity-60">{element.atomicMass.toFixed(2)}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold">{isAmharic ? element.nameAm : element.nameEn}</h2>
              <p className="text-lg text-muted-foreground">
                {isAmharic ? element.nameEn : element.nameAm}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="properties" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">
              <Info className="w-4 h-4 mr-1" />
              {isAmharic ? 'ባህሪያት' : 'Properties'}
            </TabsTrigger>
            <TabsTrigger value="electron">
              <Atom className="w-4 h-4 mr-1" />
              {isAmharic ? 'ኤሌክትሮን' : 'Electron'}
            </TabsTrigger>
            <TabsTrigger value="history">
              <Sparkles className="w-4 h-4 mr-1" />
              {isAmharic ? 'ታሪክ' : 'History'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={categoryClass}>
                {isAmharic ? categoryName.am : categoryName.en}
              </Badge>
              <Badge variant="outline">
                {isAmharic ? 'ቡድን' : 'Group'} {element.group || '-'}
              </Badge>
              <Badge variant="outline">
                {isAmharic ? 'ጊዜ' : 'Period'} {element.period}
              </Badge>
              <Badge variant="outline">
                Block {element.block}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Atom className="w-4 h-4" />
                  {isAmharic ? 'አቶሚክ ቁጥር' : 'Atomic Number'}
                </div>
                <p className="text-2xl font-bold">{element.atomicNumber}</p>
              </div>
              
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Scale className="w-4 h-4" />
                  {isAmharic ? 'አቶሚክ ክብደት' : 'Atomic Mass'}
                </div>
                <p className="text-2xl font-bold">{element.atomicMass.toFixed(3)}</p>
              </div>
              
              {element.electronegativity && (
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Zap className="w-4 h-4" />
                    {isAmharic ? 'ኤሌክትሮኔጋቲቪቲ' : 'Electronegativity'}
                  </div>
                  <p className="text-2xl font-bold">{element.electronegativity}</p>
                </div>
              )}
              
              {element.meltingPoint !== null && (
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Thermometer className="w-4 h-4" />
                    {isAmharic ? 'የማቅለጥ ነጥብ' : 'Melting Point'}
                  </div>
                  <p className="text-2xl font-bold">{element.meltingPoint}°C</p>
                </div>
              )}
              
              {element.boilingPoint !== null && (
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    {isAmharic ? 'የፍላት ነጥብ' : 'Boiling Point'}
                  </div>
                  <p className="text-2xl font-bold">{element.boilingPoint}°C</p>
                </div>
              )}
              
              {element.density !== null && (
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Scale className="w-4 h-4" />
                    {isAmharic ? 'ጥግግት' : 'Density'}
                  </div>
                  <p className="text-2xl font-bold">{element.density}</p>
                  <p className="text-xs text-muted-foreground">g/cm³</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="electron" className="space-y-4 mt-4">
            {/* Electron Shell Visualization */}
            <div className="relative w-full h-64 flex items-center justify-center">
              <div className="relative">
                {/* Nucleus */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center z-10">
                  <span className="text-white font-bold text-sm">{element.symbol}</span>
                </div>
                
                {/* Electron Shells */}
                {electronShells.map((count, i) => {
                  const size = 60 + i * 35;
                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-primary/30 rounded-full"
                      style={{
                        width: size,
                        height: size,
                        animation: `spin ${10 + i * 5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
                      }}
                    >
                      {/* Electrons on this shell */}
                      {Array.from({ length: count }).map((_, j) => {
                        const angle = (j / count) * 360;
                        return (
                          <div
                            key={j}
                            className="absolute w-2 h-2 rounded-full bg-accent"
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: `rotate(${angle}deg) translateX(${size / 2 - 4}px) translateY(-50%)`
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2">
                {isAmharic ? 'የኤሌክትሮን ውቅር' : 'Electron Configuration'}
              </h4>
              <p className="font-mono text-lg">{element.electronConfig}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2">
                {isAmharic ? 'የኤሌክትሮን ሼሎች' : 'Electron Shells'}
              </h4>
              <div className="flex gap-2">
                {electronShells.map((count, i) => (
                  <Badge key={i} variant="outline">
                    K{i > 0 ? String.fromCharCode(75 + i) : ''}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-4">
            {element.discoveredBy && (
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-2">
                  {isAmharic ? 'ያገኘው' : 'Discovered by'}
                </h4>
                <p className="text-lg font-semibold">{element.discoveredBy}</p>
                {element.yearDiscovered && (
                  <p className="text-muted-foreground">{element.yearDiscovered}</p>
                )}
              </div>
            )}
            
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
              <h4 className="text-sm font-medium mb-2">
                {isAmharic ? 'ስለ ንጥረ ነገሩ' : 'About the Element'}
              </h4>
              <p className="text-muted-foreground">
                {element.nameEn} is a {categoryNames[element.category].en.toLowerCase()} with atomic number {element.atomicNumber}. 
                It belongs to Period {element.period}{element.group ? ` and Group ${element.group}` : ''} of the periodic table.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const EnhancedPeriodicTable: React.FC = () => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'compact'>('standard');
  
  const filteredElements = useMemo(() => {
    return elements.filter((el) => {
      const matchesSearch = searchQuery === '' ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.nameAm.includes(searchQuery) ||
        el.atomicNumber.toString() === searchQuery;
      
      const matchesCategory = selectedCategory === null || el.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);
  
  // Create a grid representation of the periodic table
  const renderPeriodicTableGrid = () => {
    const grid: (Element | null)[][] = Array(10).fill(null).map(() => Array(18).fill(null));
    
    // Place main group elements
    elements.forEach((element) => {
      const { group, period, category } = element;
      
      // Skip lanthanides and actinides for main table
      if (category === 'lanthanide' || category === 'actinide') {
        return;
      }
      
      if (group !== null && period <= 7) {
        grid[period - 1][group - 1] = element;
      }
    });
    
    return grid;
  };
  
  const grid = renderPeriodicTableGrid();
  const lanthanides = elements.filter(el => el.category === 'lanthanide');
  const actinides = elements.filter(el => el.category === 'actinide');
  
  const [showMolecularViewer, setShowMolecularViewer] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* 3D Molecular Viewer Section */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant={showMolecularViewer ? 'default' : 'outline'}
            onClick={() => setShowMolecularViewer(!showMolecularViewer)}
            className="gap-2"
          >
            <Beaker className="w-4 h-4" />
            {isAmharic ? (showMolecularViewer ? '3D ቪወር ደብቅ' : '3D ሞለኪውል ቪወር') : (showMolecularViewer ? 'Hide 3D Viewer' : '3D Molecular Viewer')}
          </Button>
        </div>
        
        {showMolecularViewer && (
          <div className="mb-8 animate-fade-in">
            <MolecularViewer3D />
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
            <Atom className="w-7 h-7 text-white icon-spin" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">
              {isAmharic ? 'የንጥረ ነገሮች ሰንጠረዥ' : 'Periodic Table'}
            </h2>
            <p className="text-muted-foreground">
              {isAmharic ? `${elements.length} ንጥረ ነገሮች` : `${elements.length} Elements`}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isAmharic ? 'ንጥረ ነገር ይፈልጉ...' : 'Search elements...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('standard')}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              {isAmharic ? 'መደበኛ' : 'Standard'}
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('compact')}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              {isAmharic ? 'ጥቅጥቅ' : 'Compact'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/30 border border-border">
        {Object.entries(categoryNames).map(([key, names]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key as ElementCategory ? null : key as ElementCategory)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${categoryColors[key as ElementCategory]} ${
              selectedCategory === key ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''
            } ${selectedCategory && selectedCategory !== key ? 'opacity-40' : ''} hover:scale-105`}
          >
            {isAmharic ? names.am : names.en}
          </button>
        ))}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive flex items-center gap-1 hover:bg-destructive/20"
          >
            <X className="w-3 h-3" />
            {isAmharic ? 'ሁሉንም አሳይ' : 'Show All'}
          </button>
        )}
      </div>
      
      {/* Main Table */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className={viewMode === 'compact' ? 'min-w-[700px]' : 'min-w-[900px]'}>
          {/* Group Numbers */}
          <div className={`grid ${viewMode === 'compact' ? 'grid-cols-18 gap-0.5' : 'grid-cols-18 gap-1'} mb-1`}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground font-medium">
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* Main Grid */}
          <div className={`grid ${viewMode === 'compact' ? 'grid-cols-18 gap-0.5' : 'grid-cols-18 gap-1'} mb-4`}>
            {grid.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((element, colIndex) => {
                  if (element === null) {
                    // Check for placeholder for lanthanides/actinides
                    if ((rowIndex === 5 && colIndex === 2) || (rowIndex === 6 && colIndex === 2)) {
                      return (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className={`${viewMode === 'compact' ? 'w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem]' : 'w-[3.5rem] h-[3.5rem] md:w-[4rem] md:h-[4rem]'} flex items-center justify-center text-[10px] text-muted-foreground border border-dashed border-muted-foreground/30 rounded-lg`}
                        >
                          {rowIndex === 5 ? '57-71' : '89-103'}
                        </div>
                      );
                    }
                    return <div key={`${rowIndex}-${colIndex}`} className={viewMode === 'compact' ? 'w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem]' : 'w-[3.5rem] h-[3.5rem] md:w-[4rem] md:h-[4rem]'} />;
                  }
                  
                  const isFiltered = !filteredElements.includes(element);
                  const isHighlighted = searchQuery && filteredElements.includes(element) && filteredElements.length < 10;
                  
                  return (
                    <div
                      key={element.atomicNumber}
                      className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20 pointer-events-none' : ''}`}
                    >
                      <ElementCard
                        element={element}
                        onClick={() => !isFiltered && setSelectedElement(element)}
                        isAmharic={isAmharic}
                        isHighlighted={isHighlighted}
                        viewMode={viewMode}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Lanthanides */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="element-lanthanide">
                {isAmharic ? 'ላንታናይዶች (57-71)' : 'Lanthanides (57-71)'}
              </Badge>
            </div>
            <div className={`flex ${viewMode === 'compact' ? 'gap-0.5' : 'gap-1'} flex-wrap`}>
              {lanthanides.map((element) => {
                const isFiltered = !filteredElements.includes(element);
                const isHighlighted = searchQuery && filteredElements.includes(element) && filteredElements.length < 10;
                return (
                  <div
                    key={element.atomicNumber}
                    className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20 pointer-events-none' : ''}`}
                  >
                    <ElementCard
                      element={element}
                      onClick={() => !isFiltered && setSelectedElement(element)}
                      isAmharic={isAmharic}
                      isHighlighted={isHighlighted}
                      viewMode={viewMode}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Actinides */}
          <div className="mt-4 pt-4 border-t border-dashed border-border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="element-actinide">
                {isAmharic ? 'አክቲናይዶች (89-103)' : 'Actinides (89-103)'}
              </Badge>
            </div>
            <div className={`flex ${viewMode === 'compact' ? 'gap-0.5' : 'gap-1'} flex-wrap`}>
              {actinides.map((element) => {
                const isFiltered = !filteredElements.includes(element);
                const isHighlighted = searchQuery && filteredElements.includes(element) && filteredElements.length < 10;
                return (
                  <div
                    key={element.atomicNumber}
                    className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20 pointer-events-none' : ''}`}
                  >
                    <ElementCard
                      element={element}
                      onClick={() => !isFiltered && setSelectedElement(element)}
                      isAmharic={isAmharic}
                      isHighlighted={isHighlighted}
                      viewMode={viewMode}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Element Detail Modal */}
      <ElementDetailModal
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
        isAmharic={isAmharic}
      />
      
      {/* Add spin animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedPeriodicTable;