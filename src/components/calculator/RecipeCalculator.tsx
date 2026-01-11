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
  Info
} from 'lucide-react';

// Saponification values for common oils (NaOH)
const SAP_VALUES: Record<string, { sapValue: number; nameEn: string; nameAm: string; pricePerKg: number }> = {
  olive: { sapValue: 0.134, nameEn: 'Olive Oil', nameAm: 'የወይራ ዘይት', pricePerKg: 800 },
  coconut: { sapValue: 0.183, nameEn: 'Coconut Oil', nameAm: 'የኮኮና ዘይት', pricePerKg: 450 },
  palm: { sapValue: 0.141, nameEn: 'Palm Oil', nameAm: 'የዘንባባ ዘይት', pricePerKg: 300 },
  castor: { sapValue: 0.128, nameEn: 'Castor Oil', nameAm: 'የሽማግሌ ዘይት', pricePerKg: 600 },
  shea: { sapValue: 0.128, nameEn: 'Shea Butter', nameAm: 'ሺያ ቅቤ', pricePerKg: 700 },
  sunflower: { sapValue: 0.134, nameEn: 'Sunflower Oil', nameAm: 'የሱፍ ዘይት', pricePerKg: 350 },
};

// Detergent ingredients
const DETERGENT_INGREDIENTS: Record<string, { nameEn: string; nameAm: string; pricePerKg: number }> = {
  sodaAsh: { nameEn: 'Soda Ash (Na₂CO₃)', nameAm: 'ሶዳ አሽ', pricePerKg: 150 },
  borax: { nameEn: 'Borax', nameAm: 'ቦራክስ', pricePerKg: 200 },
  citricAcid: { nameEn: 'Citric Acid', nameAm: 'ሲትሪክ አሲድ', pricePerKg: 350 },
  surfactant: { nameEn: 'Surfactant (SLES)', nameAm: 'ሰርፋክታንት', pricePerKg: 400 },
};

interface SoapRecipe {
  oilWeight: number;
  lyeWeight: number;
  waterWeight: number;
  superfat: number;
  totalWeight: number;
  costETB: number;
  cureTime: string;
}

interface DetergentRecipe {
  sodaAsh: number;
  borax: number;
  citricAcid: number;
  surfactant: number;
  water: number;
  totalWeight: number;
  costETB: number;
}

const RecipeCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  
  // Soap calculator state
  const [selectedOil, setSelectedOil] = useState('coconut');
  const [oilAmount, setOilAmount] = useState(500);
  const [superfat, setSuperfat] = useState(5);
  const [lyeConcentration, setLyeConcentration] = useState(30);
  
  // Detergent calculator state
  const [detergentAmount, setDetergentAmount] = useState(1000);
  const [detergentType, setDetergentType] = useState<'powder' | 'liquid'>('powder');
  
  // Calculate soap recipe
  const soapRecipe: SoapRecipe = useMemo(() => {
    const oil = SAP_VALUES[selectedOil];
    const lyeWeight = oilAmount * oil.sapValue * (1 - superfat / 100);
    const waterWeight = lyeWeight / (lyeConcentration / 100);
    const totalWeight = oilAmount + lyeWeight + waterWeight;
    const costETB = (oilAmount / 1000) * oil.pricePerKg + (lyeWeight / 1000) * 150; // NaOH cost
    
    return {
      oilWeight: oilAmount,
      lyeWeight: Math.round(lyeWeight * 10) / 10,
      waterWeight: Math.round(waterWeight * 10) / 10,
      superfat,
      totalWeight: Math.round(totalWeight * 10) / 10,
      costETB: Math.round(costETB),
      cureTime: '4-6 weeks',
    };
  }, [selectedOil, oilAmount, superfat, lyeConcentration]);
  
  // Calculate detergent recipe
  const detergentRecipe: DetergentRecipe = useMemo(() => {
    const baseAmount = detergentAmount;
    let recipe: DetergentRecipe;
    
    if (detergentType === 'powder') {
      recipe = {
        sodaAsh: baseAmount * 0.35,
        borax: baseAmount * 0.20,
        citricAcid: baseAmount * 0.10,
        surfactant: baseAmount * 0.25,
        water: 0,
        totalWeight: baseAmount,
        costETB: 0,
      };
    } else {
      recipe = {
        sodaAsh: baseAmount * 0.10,
        borax: baseAmount * 0.05,
        citricAcid: baseAmount * 0.03,
        surfactant: baseAmount * 0.15,
        water: baseAmount * 0.67,
        totalWeight: baseAmount,
        costETB: 0,
      };
    }
    
    recipe.costETB = Math.round(
      (recipe.sodaAsh / 1000) * DETERGENT_INGREDIENTS.sodaAsh.pricePerKg +
      (recipe.borax / 1000) * DETERGENT_INGREDIENTS.borax.pricePerKg +
      (recipe.citricAcid / 1000) * DETERGENT_INGREDIENTS.citricAcid.pricePerKg +
      (recipe.surfactant / 1000) * DETERGENT_INGREDIENTS.surfactant.pricePerKg
    );
    
    return recipe;
  }, [detergentAmount, detergentType]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {isAmharic ? 'የሪሰፒ ካልኩሌተር' : 'Recipe Calculator'}
          </h2>
          <p className="text-muted-foreground">
            {isAmharic ? 'ትክክለኛ መለኪያዎች ለደህንነት' : 'Precise measurements for safety'}
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
            ? 'ኬሚካሎችን ሲይዙ ሁልጊዜ PPE ይልበሱ። NaOH በጣም ጎጂ ነው!'
            : 'Always wear PPE when handling chemicals. NaOH is highly caustic!'}
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="soap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="soap" className="flex items-center gap-2">
            <Droplet className="w-4 h-4" />
            {isAmharic ? 'ሳሙና' : 'Soap'}
          </TabsTrigger>
          <TabsTrigger value="detergent" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {isAmharic ? 'መዶሻ' : 'Detergent'}
          </TabsTrigger>
        </TabsList>
        
        {/* Soap Calculator */}
        <TabsContent value="soap" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  {isAmharic ? 'ግብዓቶች' : 'Inputs'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የሳሙና ዓይነትና መጠን ይምረጡ' : 'Select soap type and quantity'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{isAmharic ? 'የዘይት ዓይነት' : 'Oil Type'}</Label>
                  <Select value={selectedOil} onValueChange={setSelectedOil}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SAP_VALUES).map(([key, oil]) => (
                        <SelectItem key={key} value={key}>
                          {isAmharic ? oil.nameAm : oil.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{isAmharic ? 'የዘይት መጠን (ግራም)' : 'Oil Amount (grams)'}</Label>
                  <Input
                    type="number"
                    value={oilAmount}
                    onChange={(e) => setOilAmount(Math.max(100, parseInt(e.target.value) || 100))}
                    min={100}
                    max={10000}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>{isAmharic ? 'ሱፐርፋት' : 'Superfat'}</Label>
                    <span className="text-sm font-medium">{superfat}%</span>
                  </div>
                  <Slider
                    value={[superfat]}
                    onValueChange={([v]) => setSuperfat(v)}
                    min={0}
                    max={15}
                    step={1}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {isAmharic 
                      ? 'ከፍ ያለ ሱፐርፋት = የበለጠ እርጥብ ሳሙና'
                      : 'Higher superfat = more moisturizing soap'}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>{isAmharic ? 'የላይ ክምችት' : 'Lye Concentration'}</Label>
                    <span className="text-sm font-medium">{lyeConcentration}%</span>
                  </div>
                  <Slider
                    value={[lyeConcentration]}
                    onValueChange={([v]) => setLyeConcentration(v)}
                    min={25}
                    max={40}
                    step={1}
                    className="py-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Results Panel */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-primary" />
                  {isAmharic ? 'ውጤት' : 'Results'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የተሰላ ሪሰፒ' : 'Calculated recipe'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? SAP_VALUES[selectedOil].nameAm : SAP_VALUES[selectedOil].nameEn}
                    </p>
                    <p className="text-2xl font-bold">{soapRecipe.oilWeight}g</p>
                  </div>
                  
                  <div className="stat-card bg-danger/10">
                    <p className="text-sm text-danger flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      NaOH ({isAmharic ? 'ሶዳ' : 'Lye'})
                    </p>
                    <p className="text-2xl font-bold text-danger">{soapRecipe.lyeWeight}g</p>
                  </div>
                  
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? 'ውሃ' : 'Water'}
                    </p>
                    <p className="text-2xl font-bold">{soapRecipe.waterWeight}g</p>
                  </div>
                  
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? 'ጠቅላላ' : 'Total'}
                    </p>
                    <p className="text-2xl font-bold">{soapRecipe.totalWeight}g</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {isAmharic ? 'ማድረቅ' : 'Cure'}: {soapRecipe.cureTime}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {isAmharic ? 'ዋጋ' : 'Cost'}: {soapRecipe.costETB} ETB
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    {isAmharic ? 'የደህንነት መመሪያ' : 'Safety Instructions'}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      isAmharic ? 'ቧንቧ እና ጓንት ይልበሱ' : 'Wear goggles and gloves',
                      isAmharic ? 'NaOH ወደ ውሃ ይጨምሩ፣ በተቃራኒው አይደለም!' : 'Add NaOH to water, never the reverse!',
                      isAmharic ? 'በደንብ አየር በሚያስገባ ቦታ ይሥሩ' : 'Work in a well-ventilated area',
                      isAmharic ? 'ድንገተኛ ውሃ ዝግጁ ይኑር' : 'Keep emergency water ready',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Detergent Calculator */}
        <TabsContent value="detergent" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {isAmharic ? 'ግብዓቶች' : 'Inputs'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የመዶሻ ዓይነትና መጠን ይምረጡ' : 'Select detergent type and quantity'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{isAmharic ? 'የመዶሻ ዓይነት' : 'Detergent Type'}</Label>
                  <Select value={detergentType} onValueChange={(v) => setDetergentType(v as 'powder' | 'liquid')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="powder">{isAmharic ? 'ዱቄት' : 'Powder'}</SelectItem>
                      <SelectItem value="liquid">{isAmharic ? 'ፈሳሽ' : 'Liquid'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{isAmharic ? 'ጠቅላላ መጠን (ግራም)' : 'Total Amount (grams)'}</Label>
                  <Input
                    type="number"
                    value={detergentAmount}
                    onChange={(e) => setDetergentAmount(Math.max(100, parseInt(e.target.value) || 100))}
                    min={100}
                    max={10000}
                  />
                </div>
                
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertTitle>{isAmharic ? 'ምክር' : 'Tip'}</AlertTitle>
                  <AlertDescription className="text-sm">
                    {isAmharic 
                      ? 'ለበለጠ ውጤታማነት ሙቅ ውሃ ይጠቀሙ'
                      : 'Use warm water for better effectiveness'}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            {/* Results Panel */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-primary" />
                  {isAmharic ? 'ውጤት' : 'Results'}
                </CardTitle>
                <CardDescription>
                  {isAmharic ? 'የተሰላ ሪሰፒ' : 'Calculated recipe'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? DETERGENT_INGREDIENTS.sodaAsh.nameAm : DETERGENT_INGREDIENTS.sodaAsh.nameEn}
                    </p>
                    <p className="text-2xl font-bold">{Math.round(detergentRecipe.sodaAsh)}g</p>
                  </div>
                  
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? DETERGENT_INGREDIENTS.borax.nameAm : DETERGENT_INGREDIENTS.borax.nameEn}
                    </p>
                    <p className="text-2xl font-bold">{Math.round(detergentRecipe.borax)}g</p>
                  </div>
                  
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? DETERGENT_INGREDIENTS.citricAcid.nameAm : DETERGENT_INGREDIENTS.citricAcid.nameEn}
                    </p>
                    <p className="text-2xl font-bold">{Math.round(detergentRecipe.citricAcid)}g</p>
                  </div>
                  
                  <div className="stat-card">
                    <p className="text-sm text-muted-foreground">
                      {isAmharic ? DETERGENT_INGREDIENTS.surfactant.nameAm : DETERGENT_INGREDIENTS.surfactant.nameEn}
                    </p>
                    <p className="text-2xl font-bold">{Math.round(detergentRecipe.surfactant)}g</p>
                  </div>
                  
                  {detergentType === 'liquid' && (
                    <div className="stat-card col-span-2">
                      <p className="text-sm text-muted-foreground">
                        {isAmharic ? 'ውሃ' : 'Water'}
                      </p>
                      <p className="text-2xl font-bold">{Math.round(detergentRecipe.water)}ml</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {isAmharic ? 'ዋጋ' : 'Cost'}: {detergentRecipe.costETB} ETB
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary" />
                    {isAmharic ? 'የመሥራት ደረጃዎች' : 'Preparation Steps'}
                  </h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    {detergentType === 'powder' ? (
                      <>
                        <li>{isAmharic ? 'ሁሉንም ዱቄት ንጥረ ነገሮች ቀላቅሉ' : 'Mix all dry ingredients'}</li>
                        <li>{isAmharic ? 'በደንብ አስቀላቅሉ' : 'Blend thoroughly'}</li>
                        <li>{isAmharic ? 'በደረቅ ቦታ ያስቀምጡ' : 'Store in dry container'}</li>
                      </>
                    ) : (
                      <>
                        <li>{isAmharic ? 'ውሃውን ያሞቁ' : 'Heat the water'}</li>
                        <li>{isAmharic ? 'ሶዳ አሽ ይጨምሩ እና ያቀላቅሉ' : 'Add soda ash and dissolve'}</li>
                        <li>{isAmharic ? 'ቀሪውን ንጥረ ነገሮች ይጨምሩ' : 'Add remaining ingredients'}</li>
                        <li>{isAmharic ? 'እስኪቀዘቅዝ ድረስ ያቀላቅሉ' : 'Stir until cooled'}</li>
                      </>
                    )}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeCalculator;
