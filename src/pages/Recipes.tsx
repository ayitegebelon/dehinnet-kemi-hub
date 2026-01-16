import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Search,
  FlaskConical,
  Clock,
  Star,
  Crown,
  Lock,
  CheckCircle,
  AlertTriangle,
  Beaker,
  Sparkles,
  Shield,
  Play,
  BookOpen
} from 'lucide-react';

interface Recipe {
  id: string;
  name_en: string;
  name_am: string;
  description_en: string | null;
  description_am: string | null;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_premium: boolean;
  estimated_time_minutes: number | null;
  success_rate_percent: number | null;
  ingredients: any;
  steps: any;
  safety_requirements: any;
  image_url: string | null;
}

const defaultRecipes: Partial<Recipe>[] = [
  {
    id: 'default-1',
    name_en: 'Basic Cold Process Soap',
    name_am: 'መሰረታዊ ቀዝቃዛ ሳሙና',
    description_en: 'A simple cold process soap recipe perfect for beginners. Uses olive oil and coconut oil for a moisturizing bar.',
    description_am: 'ለጀማሪዎች ተስማሚ ቀላል ቀዝቃዛ ሂደት ሳሙና ሪሰፒ። ለእርጥበት ባር የወይራ ዘይት እና የኮኮናት ዘይት ይጠቀማል።',
    category: 'soap',
    difficulty: 'beginner',
    is_premium: false,
    estimated_time_minutes: 60,
    success_rate_percent: 95,
    ingredients: [{ name: 'Olive Oil', amount: '300g' }, { name: 'Coconut Oil', amount: '200g' }, { name: 'NaOH', amount: '68g' }, { name: 'Water', amount: '150ml' }],
    steps: [{ step: 1, instruction: 'Weigh all ingredients carefully' }, { step: 2, instruction: 'Mix lye with water slowly' }, { step: 3, instruction: 'Heat oils to 40°C' }],
    safety_requirements: ['Goggles', 'Gloves', 'Ventilation'],
  },
  {
    id: 'default-2',
    name_en: 'Laundry Detergent Powder',
    name_am: 'የልብስ ማጠቢያ ዱቄት',
    description_en: 'Eco-friendly laundry detergent powder that cleans effectively while being gentle on fabrics.',
    description_am: 'በጨርቅ ላይ ለስላሳ ሆኖ በውጤታማነት የሚያጸዳ ለአካባቢ ተስማሚ የልብስ ማጠቢያ ዱቄት።',
    category: 'detergent',
    difficulty: 'beginner',
    is_premium: false,
    estimated_time_minutes: 30,
    success_rate_percent: 98,
    ingredients: [{ name: 'Soda Ash', amount: '350g' }, { name: 'Borax', amount: '200g' }, { name: 'Soap Flakes', amount: '150g' }],
    steps: [{ step: 1, instruction: 'Grate soap into fine flakes' }, { step: 2, instruction: 'Mix all dry ingredients' }],
    safety_requirements: ['Gloves', 'Dust Mask'],
  },
  {
    id: 'default-3',
    name_en: 'Luxury Shea Butter Soap',
    name_am: 'የሺያ ቅቤ ሳሙና',
    description_en: 'Premium moisturizing soap with shea butter for extra skin nourishment.',
    description_am: 'ለተጨማሪ የቆዳ መመገብ ከሺያ ቅቤ ጋር የፕሪሚየም እርጥበት ሳሙና።',
    category: 'soap',
    difficulty: 'intermediate',
    is_premium: true,
    estimated_time_minutes: 90,
    success_rate_percent: 90,
    ingredients: [{ name: 'Shea Butter', amount: '200g' }, { name: 'Olive Oil', amount: '300g' }, { name: 'Essential Oils', amount: '20ml' }],
    steps: [{ step: 1, instruction: 'Melt shea butter slowly' }],
    safety_requirements: ['Goggles', 'Gloves', 'Ventilation'],
  },
  {
    id: 'default-4',
    name_en: 'Liquid Dish Soap',
    name_am: 'ፈሳሽ የእቃ ማጠቢያ ሳሙና',
    description_en: 'Effective liquid dish soap that cuts through grease while being gentle on hands.',
    description_am: 'በእጆች ላይ ለስላሳ ሆኖ ቅባትን የሚያስወግድ ውጤታማ ፈሳሽ የእቃ ማጠቢያ ሳሙና።',
    category: 'detergent',
    difficulty: 'intermediate',
    is_premium: true,
    estimated_time_minutes: 45,
    success_rate_percent: 92,
    ingredients: [{ name: 'Castile Soap', amount: '250ml' }, { name: 'Washing Soda', amount: '50g' }],
    steps: [{ step: 1, instruction: 'Heat water to dissolve washing soda' }],
    safety_requirements: ['Gloves'],
  },
];

const Recipes: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isAmharic = language === 'am';
  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'institution';

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setRecipes(data as Recipe[]);
      } else {
        setRecipes(defaultRecipes as Recipe[]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes(defaultRecipes as Recipe[]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    if (recipe.is_premium && !isPremium) {
      toast.error(isAmharic ? 'ይህ ሪሰፒ ፕሪሚየም ብቻ ነው' : 'This recipe is premium only');
      navigate('/subscription');
      return;
    }
    setSelectedRecipe(recipe);
    setIsDetailOpen(true);
  };

  const handleStartExperiment = () => {
    navigate('/safety');
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = (recipe.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.name_am?.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'soap', 'detergent', 'cleaner', 'cosmetic'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-danger text-danger-foreground';
      default: return 'bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'soap': return <FlaskConical className="w-4 h-4" />;
      case 'detergent': return <Sparkles className="w-4 h-4" />;
      case 'cleaner': return <Beaker className="w-4 h-4" />;
      default: return <FlaskConical className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-science flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('nav.recipes')}</h1>
              <p className="text-muted-foreground">
                {isAmharic ? 'ከ50+ ሪሰፕቶች ይምረጡ' : 'Choose from 50+ recipes'}
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('periodic.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-lg">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat === 'all' ? (isAmharic ? 'ሁሉም' : 'All') : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id}
                className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer relative"
                onClick={() => handleViewRecipe(recipe)}
              >
                {recipe.is_premium && !isPremium && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-ethiopian-gold" />
                      <p className="font-medium">{isAmharic ? 'ፕሪሚየም ብቻ' : 'Premium Only'}</p>
                      <Button size="sm" className="mt-2 bg-ethiopian-gold text-black hover:bg-ethiopian-gold/90">
                        <Crown className="w-4 h-4 mr-1" />
                        {isAmharic ? 'አሳድግ' : 'Upgrade'}
                      </Button>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getCategoryIcon(recipe.category)}
                      {recipe.category}
                    </Badge>
                    {recipe.is_premium && (
                      <Crown className="w-5 h-5 text-ethiopian-gold" />
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {isAmharic ? recipe.name_am : recipe.name_en}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {isAmharic ? recipe.description_am : recipe.description_en}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {t(`recipe.${recipe.difficulty}`)}
                    </Badge>
                    {recipe.estimated_time_minutes && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.estimated_time_minutes} min
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-ethiopian-gold fill-ethiopian-gold" />
                    <span>{recipe.success_rate_percent || 95}% success</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Recipe Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{selectedRecipe.category}</Badge>
                    <Badge className={getDifficultyColor(selectedRecipe.difficulty)}>
                      {t(`recipe.${selectedRecipe.difficulty}`)}
                    </Badge>
                    {selectedRecipe.is_premium && (
                      <Badge className="bg-ethiopian-gold text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <DialogTitle className="text-2xl">
                    {isAmharic ? selectedRecipe.name_am : selectedRecipe.name_en}
                  </DialogTitle>
                  <DialogDescription>
                    {isAmharic ? selectedRecipe.description_am : selectedRecipe.description_en}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="font-medium">{selectedRecipe.estimated_time_minutes || 60} min</p>
                      <p className="text-xs text-muted-foreground">{isAmharic ? 'ጊዜ' : 'Time'}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Star className="w-5 h-5 mx-auto mb-1 text-ethiopian-gold" />
                      <p className="font-medium">{selectedRecipe.success_rate_percent || 95}%</p>
                      <p className="text-xs text-muted-foreground">{isAmharic ? 'ስኬት' : 'Success'}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Shield className="w-5 h-5 mx-auto mb-1 text-success" />
                      <p className="font-medium">{Array.isArray(selectedRecipe.safety_requirements) ? selectedRecipe.safety_requirements.length : 3}</p>
                      <p className="text-xs text-muted-foreground">{isAmharic ? 'ደህንነት' : 'Safety'}</p>
                    </div>
                  </div>

                  {/* Safety Requirements */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      {isAmharic ? 'የደህንነት መስፈርቶች' : 'Safety Requirements'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedRecipe.safety_requirements) 
                        ? selectedRecipe.safety_requirements 
                        : ['Goggles', 'Gloves', 'Ventilation']
                      ).map((req: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-warning text-warning">
                          <Shield className="w-3 h-3 mr-1" />
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Beaker className="w-4 h-4 text-primary" />
                      {t('recipe.ingredients')}
                    </h4>
                    <ul className="space-y-2">
                      {(Array.isArray(selectedRecipe.ingredients) 
                        ? selectedRecipe.ingredients 
                        : []
                      ).map((ing: any, idx: number) => (
                        <li key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span>{ing.name}</span>
                          <Badge variant="secondary">{ing.amount}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {t('recipe.steps')}
                    </h4>
                    <ol className="space-y-3">
                      {(Array.isArray(selectedRecipe.steps) 
                        ? selectedRecipe.steps 
                        : []
                      ).map((step: any, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {step.step || idx + 1}
                          </span>
                          <span className="pt-0.5">{step.instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1">
                    {t('common.back')}
                  </Button>
                  <Button onClick={handleStartExperiment} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    {isAmharic ? 'ሙከራ ጀምር' : 'Start Experiment'}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Recipes;
