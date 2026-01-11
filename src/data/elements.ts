// Complete Periodic Table Data with Amharic translations
export interface Element {
  atomicNumber: number;
  symbol: string;
  nameEn: string;
  nameAm: string;
  atomicMass: number;
  category: ElementCategory;
  group: number | null;
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  electronConfig: string;
  electronegativity: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  discoveredBy: string | null;
  yearDiscovered: number | null;
}

export type ElementCategory = 
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export const categoryColors: Record<ElementCategory, string> = {
  'alkali-metal': 'element-alkali',
  'alkaline-earth': 'element-alkaline',
  'transition-metal': 'element-transition',
  'post-transition-metal': 'element-post-transition',
  'metalloid': 'element-metalloid',
  'nonmetal': 'element-nonmetal',
  'halogen': 'element-halogen',
  'noble-gas': 'element-noble-gas',
  'lanthanide': 'element-lanthanide',
  'actinide': 'element-actinide',
};

export const categoryNames: Record<ElementCategory, { en: string; am: string }> = {
  'alkali-metal': { en: 'Alkali Metal', am: 'አልካላይ ብረት' },
  'alkaline-earth': { en: 'Alkaline Earth Metal', am: 'አልካላይን ምድር ብረት' },
  'transition-metal': { en: 'Transition Metal', am: 'ሽግግር ብረት' },
  'post-transition-metal': { en: 'Post-transition Metal', am: 'ድህረ-ሽግግር ብረት' },
  'metalloid': { en: 'Metalloid', am: 'ከፊል ብረት' },
  'nonmetal': { en: 'Nonmetal', am: 'ብረት ያልሆነ' },
  'halogen': { en: 'Halogen', am: 'ሃሎጅን' },
  'noble-gas': { en: 'Noble Gas', am: 'ኖብል ጋዝ' },
  'lanthanide': { en: 'Lanthanide', am: 'ላንታናይድ' },
  'actinide': { en: 'Actinide', am: 'አክቲናይድ' },
};

export const elements: Element[] = [
  // Period 1
  { atomicNumber: 1, symbol: 'H', nameEn: 'Hydrogen', nameAm: 'ሃይድሮጅን', atomicMass: 1.008, category: 'nonmetal', group: 1, period: 1, block: 's', electronConfig: '1s¹', electronegativity: 2.20, meltingPoint: -259.16, boilingPoint: -252.87, density: 0.00008988, discoveredBy: 'Henry Cavendish', yearDiscovered: 1766 },
  { atomicNumber: 2, symbol: 'He', nameEn: 'Helium', nameAm: 'ሂሊየም', atomicMass: 4.003, category: 'noble-gas', group: 18, period: 1, block: 's', electronConfig: '1s²', electronegativity: null, meltingPoint: -272.20, boilingPoint: -268.93, density: 0.0001785, discoveredBy: 'Pierre Janssen', yearDiscovered: 1868 },
  
  // Period 2
  { atomicNumber: 3, symbol: 'Li', nameEn: 'Lithium', nameAm: 'ሊቲየም', atomicMass: 6.94, category: 'alkali-metal', group: 1, period: 2, block: 's', electronConfig: '[He] 2s¹', electronegativity: 0.98, meltingPoint: 180.54, boilingPoint: 1342, density: 0.534, discoveredBy: 'Johan August Arfwedson', yearDiscovered: 1817 },
  { atomicNumber: 4, symbol: 'Be', nameEn: 'Beryllium', nameAm: 'ቤሪሊየም', atomicMass: 9.012, category: 'alkaline-earth', group: 2, period: 2, block: 's', electronConfig: '[He] 2s²', electronegativity: 1.57, meltingPoint: 1287, boilingPoint: 2469, density: 1.85, discoveredBy: 'Louis Nicolas Vauquelin', yearDiscovered: 1798 },
  { atomicNumber: 5, symbol: 'B', nameEn: 'Boron', nameAm: 'ቦሮን', atomicMass: 10.81, category: 'metalloid', group: 13, period: 2, block: 'p', electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04, meltingPoint: 2076, boilingPoint: 3927, density: 2.34, discoveredBy: 'Joseph Louis Gay-Lussac', yearDiscovered: 1808 },
  { atomicNumber: 6, symbol: 'C', nameEn: 'Carbon', nameAm: 'ካርቦን', atomicMass: 12.011, category: 'nonmetal', group: 14, period: 2, block: 'p', electronConfig: '[He] 2s² 2p²', electronegativity: 2.55, meltingPoint: 3550, boilingPoint: 4027, density: 2.267, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 7, symbol: 'N', nameEn: 'Nitrogen', nameAm: 'ናይትሮጅን', atomicMass: 14.007, category: 'nonmetal', group: 15, period: 2, block: 'p', electronConfig: '[He] 2s² 2p³', electronegativity: 3.04, meltingPoint: -210.1, boilingPoint: -195.79, density: 0.0012506, discoveredBy: 'Daniel Rutherford', yearDiscovered: 1772 },
  { atomicNumber: 8, symbol: 'O', nameEn: 'Oxygen', nameAm: 'ኦክስጅን', atomicMass: 15.999, category: 'nonmetal', group: 16, period: 2, block: 'p', electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44, meltingPoint: -218.79, boilingPoint: -182.95, density: 0.001429, discoveredBy: 'Carl Wilhelm Scheele', yearDiscovered: 1774 },
  { atomicNumber: 9, symbol: 'F', nameEn: 'Fluorine', nameAm: 'ፍሎሪን', atomicMass: 18.998, category: 'halogen', group: 17, period: 2, block: 'p', electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98, meltingPoint: -219.67, boilingPoint: -188.11, density: 0.001696, discoveredBy: 'Henri Moissan', yearDiscovered: 1886 },
  { atomicNumber: 10, symbol: 'Ne', nameEn: 'Neon', nameAm: 'ኒዮን', atomicMass: 20.180, category: 'noble-gas', group: 18, period: 2, block: 'p', electronConfig: '[He] 2s² 2p⁶', electronegativity: null, meltingPoint: -248.59, boilingPoint: -246.08, density: 0.0008999, discoveredBy: 'William Ramsay', yearDiscovered: 1898 },
  
  // Period 3
  { atomicNumber: 11, symbol: 'Na', nameEn: 'Sodium', nameAm: 'ሶዲየም', atomicMass: 22.990, category: 'alkali-metal', group: 1, period: 3, block: 's', electronConfig: '[Ne] 3s¹', electronegativity: 0.93, meltingPoint: 97.79, boilingPoint: 882.94, density: 0.971, discoveredBy: 'Humphry Davy', yearDiscovered: 1807 },
  { atomicNumber: 12, symbol: 'Mg', nameEn: 'Magnesium', nameAm: 'ማግኒዚየም', atomicMass: 24.305, category: 'alkaline-earth', group: 2, period: 3, block: 's', electronConfig: '[Ne] 3s²', electronegativity: 1.31, meltingPoint: 650, boilingPoint: 1090, density: 1.738, discoveredBy: 'Joseph Black', yearDiscovered: 1755 },
  { atomicNumber: 13, symbol: 'Al', nameEn: 'Aluminium', nameAm: 'አሉሚኒየም', atomicMass: 26.982, category: 'post-transition-metal', group: 13, period: 3, block: 'p', electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61, meltingPoint: 660.32, boilingPoint: 2519, density: 2.698, discoveredBy: 'Hans Christian Ørsted', yearDiscovered: 1825 },
  { atomicNumber: 14, symbol: 'Si', nameEn: 'Silicon', nameAm: 'ሲሊኮን', atomicMass: 28.085, category: 'metalloid', group: 14, period: 3, block: 'p', electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90, meltingPoint: 1414, boilingPoint: 3265, density: 2.3296, discoveredBy: 'Jöns Jacob Berzelius', yearDiscovered: 1824 },
  { atomicNumber: 15, symbol: 'P', nameEn: 'Phosphorus', nameAm: 'ፎስፈረስ', atomicMass: 30.974, category: 'nonmetal', group: 15, period: 3, block: 'p', electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19, meltingPoint: 44.15, boilingPoint: 280.5, density: 1.82, discoveredBy: 'Hennig Brand', yearDiscovered: 1669 },
  { atomicNumber: 16, symbol: 'S', nameEn: 'Sulfur', nameAm: 'ሰልፈር', atomicMass: 32.06, category: 'nonmetal', group: 16, period: 3, block: 'p', electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58, meltingPoint: 115.21, boilingPoint: 444.72, density: 2.067, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 17, symbol: 'Cl', nameEn: 'Chlorine', nameAm: 'ክሎሪን', atomicMass: 35.45, category: 'halogen', group: 17, period: 3, block: 'p', electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16, meltingPoint: -101.5, boilingPoint: -34.04, density: 0.003214, discoveredBy: 'Carl Wilhelm Scheele', yearDiscovered: 1774 },
  { atomicNumber: 18, symbol: 'Ar', nameEn: 'Argon', nameAm: 'አርጎን', atomicMass: 39.948, category: 'noble-gas', group: 18, period: 3, block: 'p', electronConfig: '[Ne] 3s² 3p⁶', electronegativity: null, meltingPoint: -189.34, boilingPoint: -185.85, density: 0.0017837, discoveredBy: 'Lord Rayleigh', yearDiscovered: 1894 },
  
  // Period 4
  { atomicNumber: 19, symbol: 'K', nameEn: 'Potassium', nameAm: 'ፖታሲየም', atomicMass: 39.098, category: 'alkali-metal', group: 1, period: 4, block: 's', electronConfig: '[Ar] 4s¹', electronegativity: 0.82, meltingPoint: 63.38, boilingPoint: 759, density: 0.862, discoveredBy: 'Humphry Davy', yearDiscovered: 1807 },
  { atomicNumber: 20, symbol: 'Ca', nameEn: 'Calcium', nameAm: 'ካልሲየም', atomicMass: 40.078, category: 'alkaline-earth', group: 2, period: 4, block: 's', electronConfig: '[Ar] 4s²', electronegativity: 1.00, meltingPoint: 842, boilingPoint: 1484, density: 1.54, discoveredBy: 'Humphry Davy', yearDiscovered: 1808 },
  { atomicNumber: 21, symbol: 'Sc', nameEn: 'Scandium', nameAm: 'ስካንዲየም', atomicMass: 44.956, category: 'transition-metal', group: 3, period: 4, block: 'd', electronConfig: '[Ar] 3d¹ 4s²', electronegativity: 1.36, meltingPoint: 1541, boilingPoint: 2836, density: 2.989, discoveredBy: 'Lars Fredrik Nilson', yearDiscovered: 1879 },
  { atomicNumber: 22, symbol: 'Ti', nameEn: 'Titanium', nameAm: 'ቲታኒየም', atomicMass: 47.867, category: 'transition-metal', group: 4, period: 4, block: 'd', electronConfig: '[Ar] 3d² 4s²', electronegativity: 1.54, meltingPoint: 1668, boilingPoint: 3287, density: 4.54, discoveredBy: 'William Gregor', yearDiscovered: 1791 },
  { atomicNumber: 23, symbol: 'V', nameEn: 'Vanadium', nameAm: 'ቫናዲየም', atomicMass: 50.942, category: 'transition-metal', group: 5, period: 4, block: 'd', electronConfig: '[Ar] 3d³ 4s²', electronegativity: 1.63, meltingPoint: 1910, boilingPoint: 3407, density: 6.11, discoveredBy: 'Andrés Manuel del Río', yearDiscovered: 1801 },
  { atomicNumber: 24, symbol: 'Cr', nameEn: 'Chromium', nameAm: 'ክሮሚየም', atomicMass: 51.996, category: 'transition-metal', group: 6, period: 4, block: 'd', electronConfig: '[Ar] 3d⁵ 4s¹', electronegativity: 1.66, meltingPoint: 1907, boilingPoint: 2671, density: 7.15, discoveredBy: 'Louis Nicolas Vauquelin', yearDiscovered: 1794 },
  { atomicNumber: 25, symbol: 'Mn', nameEn: 'Manganese', nameAm: 'ማንጋኒዝ', atomicMass: 54.938, category: 'transition-metal', group: 7, period: 4, block: 'd', electronConfig: '[Ar] 3d⁵ 4s²', electronegativity: 1.55, meltingPoint: 1246, boilingPoint: 2061, density: 7.44, discoveredBy: 'Johan Gottlieb Gahn', yearDiscovered: 1774 },
  { atomicNumber: 26, symbol: 'Fe', nameEn: 'Iron', nameAm: 'ብረት', atomicMass: 55.845, category: 'transition-metal', group: 8, period: 4, block: 'd', electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, meltingPoint: 1538, boilingPoint: 2861, density: 7.874, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 27, symbol: 'Co', nameEn: 'Cobalt', nameAm: 'ኮባልት', atomicMass: 58.933, category: 'transition-metal', group: 9, period: 4, block: 'd', electronConfig: '[Ar] 3d⁷ 4s²', electronegativity: 1.88, meltingPoint: 1495, boilingPoint: 2927, density: 8.86, discoveredBy: 'Georg Brandt', yearDiscovered: 1735 },
  { atomicNumber: 28, symbol: 'Ni', nameEn: 'Nickel', nameAm: 'ኒኬል', atomicMass: 58.693, category: 'transition-metal', group: 10, period: 4, block: 'd', electronConfig: '[Ar] 3d⁸ 4s²', electronegativity: 1.91, meltingPoint: 1455, boilingPoint: 2913, density: 8.912, discoveredBy: 'Axel Fredrik Cronstedt', yearDiscovered: 1751 },
  { atomicNumber: 29, symbol: 'Cu', nameEn: 'Copper', nameAm: 'መዳብ', atomicMass: 63.546, category: 'transition-metal', group: 11, period: 4, block: 'd', electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, meltingPoint: 1084.62, boilingPoint: 2562, density: 8.96, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 30, symbol: 'Zn', nameEn: 'Zinc', nameAm: 'ዚንክ', atomicMass: 65.38, category: 'transition-metal', group: 12, period: 4, block: 'd', electronConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, meltingPoint: 419.53, boilingPoint: 907, density: 7.134, discoveredBy: 'Andreas Sigismund Marggraf', yearDiscovered: 1746 },
  { atomicNumber: 31, symbol: 'Ga', nameEn: 'Gallium', nameAm: 'ጋሊየም', atomicMass: 69.723, category: 'post-transition-metal', group: 13, period: 4, block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronegativity: 1.81, meltingPoint: 29.76, boilingPoint: 2204, density: 5.907, discoveredBy: 'Paul Emile Lecoq de Boisbaudran', yearDiscovered: 1875 },
  { atomicNumber: 32, symbol: 'Ge', nameEn: 'Germanium', nameAm: 'ጀርማኒየም', atomicMass: 72.630, category: 'metalloid', group: 14, period: 4, block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronegativity: 2.01, meltingPoint: 938.25, boilingPoint: 2833, density: 5.323, discoveredBy: 'Clemens Winkler', yearDiscovered: 1886 },
  { atomicNumber: 33, symbol: 'As', nameEn: 'Arsenic', nameAm: 'አርሴኒክ', atomicMass: 74.922, category: 'metalloid', group: 15, period: 4, block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronegativity: 2.18, meltingPoint: 817, boilingPoint: 614, density: 5.776, discoveredBy: 'Albertus Magnus', yearDiscovered: 1250 },
  { atomicNumber: 34, symbol: 'Se', nameEn: 'Selenium', nameAm: 'ሴሊኒየም', atomicMass: 78.971, category: 'nonmetal', group: 16, period: 4, block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegativity: 2.55, meltingPoint: 221, boilingPoint: 685, density: 4.809, discoveredBy: 'Jöns Jacob Berzelius', yearDiscovered: 1817 },
  { atomicNumber: 35, symbol: 'Br', nameEn: 'Bromine', nameAm: 'ብሮሚን', atomicMass: 79.904, category: 'halogen', group: 17, period: 4, block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, meltingPoint: -7.2, boilingPoint: 58.8, density: 3.122, discoveredBy: 'Antoine Jérôme Balard', yearDiscovered: 1826 },
  { atomicNumber: 36, symbol: 'Kr', nameEn: 'Krypton', nameAm: 'ክሪፕቶን', atomicMass: 83.798, category: 'noble-gas', group: 18, period: 4, block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegativity: 3.00, meltingPoint: -157.36, boilingPoint: -153.22, density: 0.003733, discoveredBy: 'William Ramsay', yearDiscovered: 1898 },
  
  // Period 5
  { atomicNumber: 37, symbol: 'Rb', nameEn: 'Rubidium', nameAm: 'ሩቢዲየም', atomicMass: 85.468, category: 'alkali-metal', group: 1, period: 5, block: 's', electronConfig: '[Kr] 5s¹', electronegativity: 0.82, meltingPoint: 39.31, boilingPoint: 688, density: 1.532, discoveredBy: 'Robert Bunsen', yearDiscovered: 1861 },
  { atomicNumber: 38, symbol: 'Sr', nameEn: 'Strontium', nameAm: 'ስትሮንቲየም', atomicMass: 87.62, category: 'alkaline-earth', group: 2, period: 5, block: 's', electronConfig: '[Kr] 5s²', electronegativity: 0.95, meltingPoint: 777, boilingPoint: 1382, density: 2.64, discoveredBy: 'Adair Crawford', yearDiscovered: 1790 },
  { atomicNumber: 39, symbol: 'Y', nameEn: 'Yttrium', nameAm: 'ይትሪየም', atomicMass: 88.906, category: 'transition-metal', group: 3, period: 5, block: 'd', electronConfig: '[Kr] 4d¹ 5s²', electronegativity: 1.22, meltingPoint: 1526, boilingPoint: 3345, density: 4.469, discoveredBy: 'Johan Gadolin', yearDiscovered: 1794 },
  { atomicNumber: 40, symbol: 'Zr', nameEn: 'Zirconium', nameAm: 'ዚርኮኒየም', atomicMass: 91.224, category: 'transition-metal', group: 4, period: 5, block: 'd', electronConfig: '[Kr] 4d² 5s²', electronegativity: 1.33, meltingPoint: 1855, boilingPoint: 4409, density: 6.506, discoveredBy: 'Martin Heinrich Klaproth', yearDiscovered: 1789 },
  { atomicNumber: 41, symbol: 'Nb', nameEn: 'Niobium', nameAm: 'ናይኦቢየም', atomicMass: 92.906, category: 'transition-metal', group: 5, period: 5, block: 'd', electronConfig: '[Kr] 4d⁴ 5s¹', electronegativity: 1.6, meltingPoint: 2477, boilingPoint: 4744, density: 8.57, discoveredBy: 'Charles Hatchett', yearDiscovered: 1801 },
  { atomicNumber: 42, symbol: 'Mo', nameEn: 'Molybdenum', nameAm: 'ሞሊብዴኒየም', atomicMass: 95.95, category: 'transition-metal', group: 6, period: 5, block: 'd', electronConfig: '[Kr] 4d⁵ 5s¹', electronegativity: 2.16, meltingPoint: 2623, boilingPoint: 4639, density: 10.22, discoveredBy: 'Carl Wilhelm Scheele', yearDiscovered: 1778 },
  { atomicNumber: 43, symbol: 'Tc', nameEn: 'Technetium', nameAm: 'ቴክኔቲየም', atomicMass: 98, category: 'transition-metal', group: 7, period: 5, block: 'd', electronConfig: '[Kr] 4d⁵ 5s²', electronegativity: 1.9, meltingPoint: 2157, boilingPoint: 4265, density: 11.5, discoveredBy: 'Emilio Segrè', yearDiscovered: 1937 },
  { atomicNumber: 44, symbol: 'Ru', nameEn: 'Ruthenium', nameAm: 'ሩቴኒየም', atomicMass: 101.07, category: 'transition-metal', group: 8, period: 5, block: 'd', electronConfig: '[Kr] 4d⁷ 5s¹', electronegativity: 2.2, meltingPoint: 2334, boilingPoint: 4150, density: 12.37, discoveredBy: 'Karl Ernst Claus', yearDiscovered: 1844 },
  { atomicNumber: 45, symbol: 'Rh', nameEn: 'Rhodium', nameAm: 'ሮዲየም', atomicMass: 102.91, category: 'transition-metal', group: 9, period: 5, block: 'd', electronConfig: '[Kr] 4d⁸ 5s¹', electronegativity: 2.28, meltingPoint: 1964, boilingPoint: 3695, density: 12.41, discoveredBy: 'William Hyde Wollaston', yearDiscovered: 1803 },
  { atomicNumber: 46, symbol: 'Pd', nameEn: 'Palladium', nameAm: 'ፓላዲየም', atomicMass: 106.42, category: 'transition-metal', group: 10, period: 5, block: 'd', electronConfig: '[Kr] 4d¹⁰', electronegativity: 2.20, meltingPoint: 1554.9, boilingPoint: 2963, density: 12.02, discoveredBy: 'William Hyde Wollaston', yearDiscovered: 1803 },
  { atomicNumber: 47, symbol: 'Ag', nameEn: 'Silver', nameAm: 'ብር', atomicMass: 107.87, category: 'transition-metal', group: 11, period: 5, block: 'd', electronConfig: '[Kr] 4d¹⁰ 5s¹', electronegativity: 1.93, meltingPoint: 961.78, boilingPoint: 2162, density: 10.501, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 48, symbol: 'Cd', nameEn: 'Cadmium', nameAm: 'ካድሚየም', atomicMass: 112.41, category: 'transition-metal', group: 12, period: 5, block: 'd', electronConfig: '[Kr] 4d¹⁰ 5s²', electronegativity: 1.69, meltingPoint: 321.07, boilingPoint: 767, density: 8.69, discoveredBy: 'Karl Samuel Leberecht Hermann', yearDiscovered: 1817 },
  { atomicNumber: 49, symbol: 'In', nameEn: 'Indium', nameAm: 'ኢንዲየም', atomicMass: 114.82, category: 'post-transition-metal', group: 13, period: 5, block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹', electronegativity: 1.78, meltingPoint: 156.60, boilingPoint: 2072, density: 7.31, discoveredBy: 'Ferdinand Reich', yearDiscovered: 1863 },
  { atomicNumber: 50, symbol: 'Sn', nameEn: 'Tin', nameAm: 'ቲን', atomicMass: 118.71, category: 'post-transition-metal', group: 14, period: 5, block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', electronegativity: 1.96, meltingPoint: 231.93, boilingPoint: 2602, density: 7.287, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 51, symbol: 'Sb', nameEn: 'Antimony', nameAm: 'አንቲሞኒ', atomicMass: 121.76, category: 'metalloid', group: 15, period: 5, block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p³', electronegativity: 2.05, meltingPoint: 630.63, boilingPoint: 1587, density: 6.685, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 52, symbol: 'Te', nameEn: 'Tellurium', nameAm: 'ቴሉሪየም', atomicMass: 127.60, category: 'metalloid', group: 16, period: 5, block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴', electronegativity: 2.1, meltingPoint: 449.51, boilingPoint: 988, density: 6.232, discoveredBy: 'Franz-Joseph Müller von Reichenstein', yearDiscovered: 1782 },
  { atomicNumber: 53, symbol: 'I', nameEn: 'Iodine', nameAm: 'አዮዲን', atomicMass: 126.90, category: 'halogen', group: 17, period: 5, block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegativity: 2.66, meltingPoint: 113.7, boilingPoint: 184.3, density: 4.93, discoveredBy: 'Bernard Courtois', yearDiscovered: 1811 },
  { atomicNumber: 54, symbol: 'Xe', nameEn: 'Xenon', nameAm: 'ዚኖን', atomicMass: 131.29, category: 'noble-gas', group: 18, period: 5, block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶', electronegativity: 2.6, meltingPoint: -111.8, boilingPoint: -108.12, density: 0.005887, discoveredBy: 'William Ramsay', yearDiscovered: 1898 },
  
  // Period 6
  { atomicNumber: 55, symbol: 'Cs', nameEn: 'Cesium', nameAm: 'ሲዚየም', atomicMass: 132.91, category: 'alkali-metal', group: 1, period: 6, block: 's', electronConfig: '[Xe] 6s¹', electronegativity: 0.79, meltingPoint: 28.44, boilingPoint: 671, density: 1.873, discoveredBy: 'Robert Bunsen', yearDiscovered: 1860 },
  { atomicNumber: 56, symbol: 'Ba', nameEn: 'Barium', nameAm: 'ባሪየም', atomicMass: 137.33, category: 'alkaline-earth', group: 2, period: 6, block: 's', electronConfig: '[Xe] 6s²', electronegativity: 0.89, meltingPoint: 727, boilingPoint: 1897, density: 3.594, discoveredBy: 'Carl Wilhelm Scheele', yearDiscovered: 1772 },
  
  // Lanthanides (57-71)
  { atomicNumber: 57, symbol: 'La', nameEn: 'Lanthanum', nameAm: 'ላንታኒየም', atomicMass: 138.91, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 5d¹ 6s²', electronegativity: 1.1, meltingPoint: 920, boilingPoint: 3464, density: 6.145, discoveredBy: 'Carl Gustaf Mosander', yearDiscovered: 1839 },
  { atomicNumber: 58, symbol: 'Ce', nameEn: 'Cerium', nameAm: 'ሲሪየም', atomicMass: 140.12, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f¹ 5d¹ 6s²', electronegativity: 1.12, meltingPoint: 798, boilingPoint: 3443, density: 6.77, discoveredBy: 'Martin Heinrich Klaproth', yearDiscovered: 1803 },
  { atomicNumber: 59, symbol: 'Pr', nameEn: 'Praseodymium', nameAm: 'ፕራሲዮዲሚየም', atomicMass: 140.91, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f³ 6s²', electronegativity: 1.13, meltingPoint: 931, boilingPoint: 3520, density: 6.773, discoveredBy: 'Carl Auer von Welsbach', yearDiscovered: 1885 },
  { atomicNumber: 60, symbol: 'Nd', nameEn: 'Neodymium', nameAm: 'ኒዮዲሚየም', atomicMass: 144.24, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f⁴ 6s²', electronegativity: 1.14, meltingPoint: 1021, boilingPoint: 3074, density: 7.007, discoveredBy: 'Carl Auer von Welsbach', yearDiscovered: 1885 },
  { atomicNumber: 61, symbol: 'Pm', nameEn: 'Promethium', nameAm: 'ፕሮሜቲየም', atomicMass: 145, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f⁵ 6s²', electronegativity: 1.13, meltingPoint: 1042, boilingPoint: 3000, density: 7.26, discoveredBy: 'Chien Shiung Wu', yearDiscovered: 1945 },
  { atomicNumber: 62, symbol: 'Sm', nameEn: 'Samarium', nameAm: 'ሳማሪየም', atomicMass: 150.36, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f⁶ 6s²', electronegativity: 1.17, meltingPoint: 1074, boilingPoint: 1794, density: 7.52, discoveredBy: 'Paul Émile Lecoq de Boisbaudran', yearDiscovered: 1879 },
  { atomicNumber: 63, symbol: 'Eu', nameEn: 'Europium', nameAm: 'ዩሮፒየም', atomicMass: 151.96, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f⁷ 6s²', electronegativity: 1.2, meltingPoint: 822, boilingPoint: 1529, density: 5.243, discoveredBy: 'Eugène-Anatole Demarçay', yearDiscovered: 1901 },
  { atomicNumber: 64, symbol: 'Gd', nameEn: 'Gadolinium', nameAm: 'ጋዶሊኒየም', atomicMass: 157.25, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f⁷ 5d¹ 6s²', electronegativity: 1.2, meltingPoint: 1313, boilingPoint: 3273, density: 7.895, discoveredBy: 'Jean Charles Galissard de Marignac', yearDiscovered: 1880 },
  { atomicNumber: 65, symbol: 'Tb', nameEn: 'Terbium', nameAm: 'ተርቢየም', atomicMass: 158.93, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f⁹ 6s²', electronegativity: 1.2, meltingPoint: 1356, boilingPoint: 3230, density: 8.229, discoveredBy: 'Carl Gustaf Mosander', yearDiscovered: 1843 },
  { atomicNumber: 66, symbol: 'Dy', nameEn: 'Dysprosium', nameAm: 'ዳይስፕሮሲየም', atomicMass: 162.50, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f¹⁰ 6s²', electronegativity: 1.22, meltingPoint: 1412, boilingPoint: 2567, density: 8.55, discoveredBy: 'Paul Émile Lecoq de Boisbaudran', yearDiscovered: 1886 },
  { atomicNumber: 67, symbol: 'Ho', nameEn: 'Holmium', nameAm: 'ሆልሚየም', atomicMass: 164.93, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f¹¹ 6s²', electronegativity: 1.23, meltingPoint: 1474, boilingPoint: 2700, density: 8.795, discoveredBy: 'Marc Delafontaine', yearDiscovered: 1878 },
  { atomicNumber: 68, symbol: 'Er', nameEn: 'Erbium', nameAm: 'ኤርቢየም', atomicMass: 167.26, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f¹² 6s²', electronegativity: 1.24, meltingPoint: 1529, boilingPoint: 2868, density: 9.066, discoveredBy: 'Carl Gustaf Mosander', yearDiscovered: 1843 },
  { atomicNumber: 69, symbol: 'Tm', nameEn: 'Thulium', nameAm: 'ቱሊየም', atomicMass: 168.93, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f¹³ 6s²', electronegativity: 1.25, meltingPoint: 1545, boilingPoint: 1950, density: 9.321, discoveredBy: 'Per Teodor Cleve', yearDiscovered: 1879 },
  { atomicNumber: 70, symbol: 'Yb', nameEn: 'Ytterbium', nameAm: 'ይተርቢየም', atomicMass: 173.05, category: 'lanthanide', group: null, period: 6, block: 'f', electronConfig: '[Xe] 4f¹⁴ 6s²', electronegativity: 1.1, meltingPoint: 819, boilingPoint: 1196, density: 6.965, discoveredBy: 'Jean Charles Galissard de Marignac', yearDiscovered: 1878 },
  { atomicNumber: 71, symbol: 'Lu', nameEn: 'Lutetium', nameAm: 'ሉቴቲየም', atomicMass: 174.97, category: 'lanthanide', group: null, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²', electronegativity: 1.27, meltingPoint: 1663, boilingPoint: 3402, density: 9.84, discoveredBy: 'Georges Urbain', yearDiscovered: 1907 },
  
  // Period 6 continued
  { atomicNumber: 72, symbol: 'Hf', nameEn: 'Hafnium', nameAm: 'ሃፍኒየም', atomicMass: 178.49, category: 'transition-metal', group: 4, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d² 6s²', electronegativity: 1.3, meltingPoint: 2233, boilingPoint: 4603, density: 13.31, discoveredBy: 'Dirk Coster', yearDiscovered: 1923 },
  { atomicNumber: 73, symbol: 'Ta', nameEn: 'Tantalum', nameAm: 'ታንታለም', atomicMass: 180.95, category: 'transition-metal', group: 5, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²', electronegativity: 1.5, meltingPoint: 3017, boilingPoint: 5458, density: 16.654, discoveredBy: 'Anders Gustaf Ekeberg', yearDiscovered: 1802 },
  { atomicNumber: 74, symbol: 'W', nameEn: 'Tungsten', nameAm: 'ታንግስተን', atomicMass: 183.84, category: 'transition-metal', group: 6, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronegativity: 2.36, meltingPoint: 3422, boilingPoint: 5555, density: 19.25, discoveredBy: 'Carl Wilhelm Scheele', yearDiscovered: 1781 },
  { atomicNumber: 75, symbol: 'Re', nameEn: 'Rhenium', nameAm: 'ሬኒየም', atomicMass: 186.21, category: 'transition-metal', group: 7, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronegativity: 1.9, meltingPoint: 3186, boilingPoint: 5596, density: 21.02, discoveredBy: 'Masataka Ogawa', yearDiscovered: 1925 },
  { atomicNumber: 76, symbol: 'Os', nameEn: 'Osmium', nameAm: 'ኦስሚየም', atomicMass: 190.23, category: 'transition-metal', group: 8, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronegativity: 2.2, meltingPoint: 3033, boilingPoint: 5012, density: 22.59, discoveredBy: 'Smithson Tennant', yearDiscovered: 1803 },
  { atomicNumber: 77, symbol: 'Ir', nameEn: 'Iridium', nameAm: 'ኢሪዲየም', atomicMass: 192.22, category: 'transition-metal', group: 9, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronegativity: 2.2, meltingPoint: 2466, boilingPoint: 4428, density: 22.56, discoveredBy: 'Smithson Tennant', yearDiscovered: 1803 },
  { atomicNumber: 78, symbol: 'Pt', nameEn: 'Platinum', nameAm: 'ፕላቲኒየም', atomicMass: 195.08, category: 'transition-metal', group: 10, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronegativity: 2.28, meltingPoint: 1768.3, boilingPoint: 3825, density: 21.46, discoveredBy: 'Antonio de Ulloa', yearDiscovered: 1735 },
  { atomicNumber: 79, symbol: 'Au', nameEn: 'Gold', nameAm: 'ወርቅ', atomicMass: 196.97, category: 'transition-metal', group: 11, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegativity: 2.54, meltingPoint: 1064.18, boilingPoint: 2856, density: 19.282, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 80, symbol: 'Hg', nameEn: 'Mercury', nameAm: 'ሜርኩሪ', atomicMass: 200.59, category: 'transition-metal', group: 12, period: 6, block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronegativity: 2.0, meltingPoint: -38.83, boilingPoint: 356.73, density: 13.5336, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 81, symbol: 'Tl', nameEn: 'Thallium', nameAm: 'ታሊየም', atomicMass: 204.38, category: 'post-transition-metal', group: 13, period: 6, block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronegativity: 1.62, meltingPoint: 304, boilingPoint: 1473, density: 11.85, discoveredBy: 'William Crookes', yearDiscovered: 1861 },
  { atomicNumber: 82, symbol: 'Pb', nameEn: 'Lead', nameAm: 'እርሳስ', atomicMass: 207.2, category: 'post-transition-metal', group: 14, period: 6, block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronegativity: 2.33, meltingPoint: 327.46, boilingPoint: 1749, density: 11.342, discoveredBy: 'Ancient', yearDiscovered: null },
  { atomicNumber: 83, symbol: 'Bi', nameEn: 'Bismuth', nameAm: 'ቢስሙዝ', atomicMass: 208.98, category: 'post-transition-metal', group: 15, period: 6, block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronegativity: 2.02, meltingPoint: 271.3, boilingPoint: 1564, density: 9.807, discoveredBy: 'Claude François Geoffroy', yearDiscovered: 1753 },
  { atomicNumber: 84, symbol: 'Po', nameEn: 'Polonium', nameAm: 'ፖሎኒየም', atomicMass: 209, category: 'metalloid', group: 16, period: 6, block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronegativity: 2.0, meltingPoint: 254, boilingPoint: 962, density: 9.32, discoveredBy: 'Pierre Curie', yearDiscovered: 1898 },
  { atomicNumber: 85, symbol: 'At', nameEn: 'Astatine', nameAm: 'አስታቲን', atomicMass: 210, category: 'halogen', group: 17, period: 6, block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronegativity: 2.2, meltingPoint: 302, boilingPoint: 337, density: 7, discoveredBy: 'Dale R. Corson', yearDiscovered: 1940 },
  { atomicNumber: 86, symbol: 'Rn', nameEn: 'Radon', nameAm: 'ራዶን', atomicMass: 222, category: 'noble-gas', group: 18, period: 6, block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', electronegativity: null, meltingPoint: -71, boilingPoint: -61.7, density: 0.00973, discoveredBy: 'Friedrich Ernst Dorn', yearDiscovered: 1900 },
  
  // Period 7
  { atomicNumber: 87, symbol: 'Fr', nameEn: 'Francium', nameAm: 'ፍራንሲየም', atomicMass: 223, category: 'alkali-metal', group: 1, period: 7, block: 's', electronConfig: '[Rn] 7s¹', electronegativity: 0.7, meltingPoint: 27, boilingPoint: 677, density: 1.87, discoveredBy: 'Marguerite Perey', yearDiscovered: 1939 },
  { atomicNumber: 88, symbol: 'Ra', nameEn: 'Radium', nameAm: 'ራዲየም', atomicMass: 226, category: 'alkaline-earth', group: 2, period: 7, block: 's', electronConfig: '[Rn] 7s²', electronegativity: 0.9, meltingPoint: 700, boilingPoint: 1737, density: 5.5, discoveredBy: 'Pierre Curie', yearDiscovered: 1898 },
  
  // Actinides (89-103)
  { atomicNumber: 89, symbol: 'Ac', nameEn: 'Actinium', nameAm: 'አክቲኒየም', atomicMass: 227, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 6d¹ 7s²', electronegativity: 1.1, meltingPoint: 1050, boilingPoint: 3200, density: 10.07, discoveredBy: 'Friedrich Oskar Giesel', yearDiscovered: 1899 },
  { atomicNumber: 90, symbol: 'Th', nameEn: 'Thorium', nameAm: 'ቶሪየም', atomicMass: 232.04, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 6d² 7s²', electronegativity: 1.3, meltingPoint: 1750, boilingPoint: 4788, density: 11.72, discoveredBy: 'Jöns Jacob Berzelius', yearDiscovered: 1829 },
  { atomicNumber: 91, symbol: 'Pa', nameEn: 'Protactinium', nameAm: 'ፕሮታክቲኒየም', atomicMass: 231.04, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f² 6d¹ 7s²', electronegativity: 1.5, meltingPoint: 1572, boilingPoint: 4027, density: 15.37, discoveredBy: 'Kasimir Fajans', yearDiscovered: 1913 },
  { atomicNumber: 92, symbol: 'U', nameEn: 'Uranium', nameAm: 'ዩራኒየም', atomicMass: 238.03, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f³ 6d¹ 7s²', electronegativity: 1.38, meltingPoint: 1135, boilingPoint: 4131, density: 18.95, discoveredBy: 'Martin Heinrich Klaproth', yearDiscovered: 1789 },
  { atomicNumber: 93, symbol: 'Np', nameEn: 'Neptunium', nameAm: 'ኔፕቱኒየም', atomicMass: 237, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f⁴ 6d¹ 7s²', electronegativity: 1.36, meltingPoint: 644, boilingPoint: 3902, density: 20.45, discoveredBy: 'Edwin McMillan', yearDiscovered: 1940 },
  { atomicNumber: 94, symbol: 'Pu', nameEn: 'Plutonium', nameAm: 'ፕሉቶኒየም', atomicMass: 244, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f⁶ 7s²', electronegativity: 1.28, meltingPoint: 639.4, boilingPoint: 3228, density: 19.84, discoveredBy: 'Glenn T. Seaborg', yearDiscovered: 1940 },
  { atomicNumber: 95, symbol: 'Am', nameEn: 'Americium', nameAm: 'አሜሪሲየም', atomicMass: 243, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f⁷ 7s²', electronegativity: 1.3, meltingPoint: 1176, boilingPoint: 2011, density: 13.69, discoveredBy: 'Glenn T. Seaborg', yearDiscovered: 1944 },
  { atomicNumber: 96, symbol: 'Cm', nameEn: 'Curium', nameAm: 'ኩሪየም', atomicMass: 247, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f⁷ 6d¹ 7s²', electronegativity: 1.3, meltingPoint: 1345, boilingPoint: 3110, density: 13.51, discoveredBy: 'Glenn T. Seaborg', yearDiscovered: 1944 },
  { atomicNumber: 97, symbol: 'Bk', nameEn: 'Berkelium', nameAm: 'በርኬሊየም', atomicMass: 247, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f⁹ 7s²', electronegativity: 1.3, meltingPoint: 986, boilingPoint: 2627, density: 14.79, discoveredBy: 'Glenn T. Seaborg', yearDiscovered: 1949 },
  { atomicNumber: 98, symbol: 'Cf', nameEn: 'Californium', nameAm: 'ካሊፎርኒየም', atomicMass: 251, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f¹⁰ 7s²', electronegativity: 1.3, meltingPoint: 900, boilingPoint: 1470, density: 15.1, discoveredBy: 'Glenn T. Seaborg', yearDiscovered: 1950 },
  { atomicNumber: 99, symbol: 'Es', nameEn: 'Einsteinium', nameAm: 'አይንስታይኒየም', atomicMass: 252, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f¹¹ 7s²', electronegativity: 1.3, meltingPoint: 860, boilingPoint: 996, density: 8.84, discoveredBy: 'Albert Ghiorso', yearDiscovered: 1952 },
  { atomicNumber: 100, symbol: 'Fm', nameEn: 'Fermium', nameAm: 'ፈርሚየም', atomicMass: 257, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f¹² 7s²', electronegativity: 1.3, meltingPoint: 1527, boilingPoint: null, density: null, discoveredBy: 'Albert Ghiorso', yearDiscovered: 1952 },
  { atomicNumber: 101, symbol: 'Md', nameEn: 'Mendelevium', nameAm: 'መንደሌቪየም', atomicMass: 258, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f¹³ 7s²', electronegativity: 1.3, meltingPoint: 827, boilingPoint: null, density: null, discoveredBy: 'Albert Ghiorso', yearDiscovered: 1955 },
  { atomicNumber: 102, symbol: 'No', nameEn: 'Nobelium', nameAm: 'ኖቤሊየም', atomicMass: 259, category: 'actinide', group: null, period: 7, block: 'f', electronConfig: '[Rn] 5f¹⁴ 7s²', electronegativity: 1.3, meltingPoint: 827, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 1958 },
  { atomicNumber: 103, symbol: 'Lr', nameEn: 'Lawrencium', nameAm: 'ሎረንሲየም', atomicMass: 262, category: 'actinide', group: null, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 7s² 7p¹', electronegativity: 1.3, meltingPoint: 1627, boilingPoint: null, density: null, discoveredBy: 'Albert Ghiorso', yearDiscovered: 1961 },
  
  // Period 7 continued
  { atomicNumber: 104, symbol: 'Rf', nameEn: 'Rutherfordium', nameAm: 'ራዘርፎርዲየም', atomicMass: 267, category: 'transition-metal', group: 4, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d² 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 1964 },
  { atomicNumber: 105, symbol: 'Db', nameEn: 'Dubnium', nameAm: 'ዱብኒየም', atomicMass: 268, category: 'transition-metal', group: 5, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 1967 },
  { atomicNumber: 106, symbol: 'Sg', nameEn: 'Seaborgium', nameAm: 'ሲቦርጊየም', atomicMass: 271, category: 'transition-metal', group: 6, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Albert Ghiorso', yearDiscovered: 1974 },
  { atomicNumber: 107, symbol: 'Bh', nameEn: 'Bohrium', nameAm: 'ቦሪየም', atomicMass: 270, category: 'transition-metal', group: 7, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Peter Armbruster', yearDiscovered: 1981 },
  { atomicNumber: 108, symbol: 'Hs', nameEn: 'Hassium', nameAm: 'ሃሲየም', atomicMass: 277, category: 'transition-metal', group: 8, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Peter Armbruster', yearDiscovered: 1984 },
  { atomicNumber: 109, symbol: 'Mt', nameEn: 'Meitnerium', nameAm: 'ማይትነሪየም', atomicMass: 276, category: 'transition-metal', group: 9, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Peter Armbruster', yearDiscovered: 1982 },
  { atomicNumber: 110, symbol: 'Ds', nameEn: 'Darmstadtium', nameAm: 'ዳርምስታዲየም', atomicMass: 281, category: 'transition-metal', group: 10, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Peter Armbruster', yearDiscovered: 1994 },
  { atomicNumber: 111, symbol: 'Rg', nameEn: 'Roentgenium', nameAm: 'ሮንትገኒየም', atomicMass: 280, category: 'transition-metal', group: 11, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d⁹ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Peter Armbruster', yearDiscovered: 1994 },
  { atomicNumber: 112, symbol: 'Cn', nameEn: 'Copernicium', nameAm: 'ኮፐርኒሲየም', atomicMass: 285, category: 'transition-metal', group: 12, period: 7, block: 'd', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Sigurd Hofmann', yearDiscovered: 1996 },
  { atomicNumber: 113, symbol: 'Nh', nameEn: 'Nihonium', nameAm: 'ኒሆኒየም', atomicMass: 284, category: 'post-transition-metal', group: 13, period: 7, block: 'p', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Kosuke Morita', yearDiscovered: 2004 },
  { atomicNumber: 114, symbol: 'Fl', nameEn: 'Flerovium', nameAm: 'ፍሌሮቪየም', atomicMass: 289, category: 'post-transition-metal', group: 14, period: 7, block: 'p', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 1998 },
  { atomicNumber: 115, symbol: 'Mc', nameEn: 'Moscovium', nameAm: 'ሞስኮቪየም', atomicMass: 288, category: 'post-transition-metal', group: 15, period: 7, block: 'p', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 2003 },
  { atomicNumber: 116, symbol: 'Lv', nameEn: 'Livermorium', nameAm: 'ሊቨርሞሪየም', atomicMass: 293, category: 'post-transition-metal', group: 16, period: 7, block: 'p', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 2000 },
  { atomicNumber: 117, symbol: 'Ts', nameEn: 'Tennessine', nameAm: 'ቴነሲን', atomicMass: 294, category: 'halogen', group: 17, period: 7, block: 'p', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 2010 },
  { atomicNumber: 118, symbol: 'Og', nameEn: 'Oganesson', nameAm: 'ኦጋኔሶን', atomicMass: 294, category: 'noble-gas', group: 18, period: 7, block: 'p', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', electronegativity: null, meltingPoint: null, boilingPoint: null, density: null, discoveredBy: 'Joint Institute for Nuclear Research', yearDiscovered: 2002 },
];

// Helper function to get element position in the periodic table grid
export function getElementPosition(element: Element): { row: number; col: number } {
  const { atomicNumber, group, period, category } = element;
  
  // Lanthanides (57-71) go in a separate row
  if (category === 'lanthanide') {
    return { row: 9, col: atomicNumber - 54 };
  }
  
  // Actinides (89-103) go in a separate row
  if (category === 'actinide') {
    return { row: 10, col: atomicNumber - 86 };
  }
  
  // Regular elements
  if (group !== null) {
    return { row: period, col: group };
  }
  
  // Fallback for elements without a group
  return { row: period, col: 3 };
}
