import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { elements, Element, categoryColors, categoryNames, ElementCategory } from '@/data/elements';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Atom, Zap, Thermometer, Scale, X } from 'lucide-react';

const ElementCard: React.FC<{
  element: Element;
  onClick: () => void;
  isAmharic: boolean;
}> = ({ element, onClick, isAmharic }) => {
  const categoryClass = categoryColors[element.category];
  
  return (
    <div
      onClick={onClick}
      className={`element-card ${categoryClass} min-w-[3.5rem] min-h-[3.5rem] flex flex-col items-center justify-center text-center group`}
    >
      <span className="text-[10px] text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
        {element.atomicNumber}
      </span>
      <span className="text-lg font-bold leading-none">{element.symbol}</span>
      <span className="text-[9px] truncate max-w-full px-0.5 text-muted-foreground">
        {isAmharic ? element.nameAm : element.nameEn}
      </span>
    </div>
  );
};

const ElementDetailModal: React.FC<{
  element: Element | null;
  onClose: () => void;
  isAmharic: boolean;
}> = ({ element, onClose, isAmharic }) => {
  if (!element) return null;
  
  const categoryClass = categoryColors[element.category];
  const categoryName = categoryNames[element.category];
  
  return (
    <Dialog open={!!element} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-16 h-16 rounded-xl ${categoryClass} flex items-center justify-center`}>
              <span className="text-3xl font-bold">{element.symbol}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{isAmharic ? element.nameAm : element.nameEn}</h2>
              <p className="text-sm text-muted-foreground">
                {isAmharic ? element.nameEn : element.nameAm}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
          
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Atom className="w-4 h-4" />
                {isAmharic ? 'አቶሚክ ቁጥር' : 'Atomic Number'}
              </div>
              <p className="text-xl font-bold">{element.atomicNumber}</p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Scale className="w-4 h-4" />
                {isAmharic ? 'አቶሚክ ክብደት' : 'Atomic Mass'}
              </div>
              <p className="text-xl font-bold">{element.atomicMass.toFixed(3)}</p>
            </div>
            
            {element.electronegativity && (
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="w-4 h-4" />
                  {isAmharic ? 'ኤሌክትሮኔጋቲቪቲ' : 'Electronegativity'}
                </div>
                <p className="text-xl font-bold">{element.electronegativity}</p>
              </div>
            )}
            
            {element.meltingPoint !== null && (
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Thermometer className="w-4 h-4" />
                  {isAmharic ? 'የማቀዝቀዝ ነጥብ' : 'Melting Point'}
                </div>
                <p className="text-xl font-bold">{element.meltingPoint}°C</p>
              </div>
            )}
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">
              {isAmharic ? 'የኤሌክትሮን ውቅር' : 'Electron Configuration'}
            </h4>
            <p className="font-mono text-lg">{element.electronConfig}</p>
          </div>
          
          {element.discoveredBy && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{isAmharic ? 'የተገኘው በ' : 'Discovered by'}:</span>{' '}
              {element.discoveredBy}
              {element.yearDiscovered && ` (${element.yearDiscovered})`}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PeriodicTable: React.FC = () => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);
  
  const filteredElements = useMemo(() => {
    return elements.filter((el) => {
      const matchesSearch = searchQuery === '' ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.nameAm.includes(searchQuery);
      
      const matchesCategory = selectedCategory === null || el.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);
  
  // Create a grid representation of the periodic table
  const renderPeriodicTableGrid = () => {
    const grid: (Element | null)[][] = Array(10).fill(null).map(() => Array(18).fill(null));
    
    // Place main group elements
    elements.forEach((element) => {
      const { atomicNumber, group, period, category } = element;
      
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
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Atom className="w-7 h-7 text-primary icon-spin" />
            {isAmharic ? 'የንጥረ ነገሮች ሰንጠረዥ' : 'Periodic Table'}
          </h2>
          <p className="text-muted-foreground">
            {isAmharic ? `${elements.length} ንጥረ ነገሮች` : `${elements.length} Elements`}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={isAmharic ? 'ንጥረ ነገር ይፈልጉ...' : 'Search elements...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Category Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryNames).map(([key, names]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key as ElementCategory ? null : key as ElementCategory)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${categoryColors[key as ElementCategory]} ${
              selectedCategory === key ? 'ring-2 ring-primary ring-offset-2' : ''
            } ${selectedCategory && selectedCategory !== key ? 'opacity-40' : ''}`}
          >
            {isAmharic ? names.am : names.en}
          </button>
        ))}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {isAmharic ? 'ሁሉንም አሳይ' : 'Show All'}
          </button>
        )}
      </div>
      
      {/* Main Table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[900px]">
          {/* Main Grid */}
          <div className="grid grid-cols-18 gap-1 mb-4">
            {grid.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((element, colIndex) => {
                  if (element === null) {
                    // Check for placeholder for lanthanides/actinides
                    if ((rowIndex === 5 && colIndex === 2) || (rowIndex === 6 && colIndex === 2)) {
                      return (
                        <div key={`${rowIndex}-${colIndex}`} className="min-w-[3.5rem] min-h-[3.5rem] flex items-center justify-center text-xs text-muted-foreground border border-dashed border-muted-foreground/30 rounded-lg">
                          {rowIndex === 5 ? '57-71' : '89-103'}
                        </div>
                      );
                    }
                    return <div key={`${rowIndex}-${colIndex}`} className="min-w-[3.5rem] min-h-[3.5rem]" />;
                  }
                  
                  const isFiltered = !filteredElements.includes(element);
                  
                  return (
                    <div
                      key={element.atomicNumber}
                      className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20' : ''}`}
                    >
                      <ElementCard
                        element={element}
                        onClick={() => !isFiltered && setSelectedElement(element)}
                        isAmharic={isAmharic}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Lanthanides */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {isAmharic ? 'ላንታናይዶች (57-71)' : 'Lanthanides (57-71)'}
            </p>
            <div className="flex gap-1 flex-wrap">
              {lanthanides.map((element) => {
                const isFiltered = !filteredElements.includes(element);
                return (
                  <div
                    key={element.atomicNumber}
                    className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20' : ''}`}
                  >
                    <ElementCard
                      element={element}
                      onClick={() => !isFiltered && setSelectedElement(element)}
                      isAmharic={isAmharic}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Actinides */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {isAmharic ? 'አክቲናይዶች (89-103)' : 'Actinides (89-103)'}
            </p>
            <div className="flex gap-1 flex-wrap">
              {actinides.map((element) => {
                const isFiltered = !filteredElements.includes(element);
                return (
                  <div
                    key={element.atomicNumber}
                    className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20' : ''}`}
                  >
                    <ElementCard
                      element={element}
                      onClick={() => !isFiltered && setSelectedElement(element)}
                      isAmharic={isAmharic}
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
    </div>
  );
};

export default PeriodicTable;
