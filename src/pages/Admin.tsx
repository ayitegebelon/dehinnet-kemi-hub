import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Users,
  FlaskConical,
  BarChart3,
  Settings,
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface User {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  skill_level: string;
  subscription_tier: string;
  safety_score: number;
  created_at: string;
}

interface Recipe {
  id: string;
  name_en: string;
  name_am: string;
  category: string;
  difficulty: string;
  is_premium: boolean;
  created_at: string;
}

const Admin: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');
  
  // Recipe form state
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [recipeForm, setRecipeForm] = useState({
    name_en: '',
    name_am: '',
    description_en: '',
    description_am: '',
    category: 'soap',
    difficulty: 'beginner',
    is_premium: false,
    ingredients: '[]',
    steps: '[]',
    safety_requirements: '[]',
  });

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [isAdmin, isSuperAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;
      setRecipes(recipesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: 'user' | 'admin') => {
    if (!isSuperAdmin) {
      toast.error('Only superadmins can change roles');
      return;
    }

    try {
      // First check if role exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
      }

      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleCreateRecipe = async () => {
    try {
      const recipeData = {
        name_en: recipeForm.name_en,
        name_am: recipeForm.name_am,
        description_en: recipeForm.description_en,
        description_am: recipeForm.description_am,
        category: recipeForm.category,
        difficulty: recipeForm.difficulty as 'beginner' | 'intermediate' | 'advanced',
        is_premium: recipeForm.is_premium,
        ingredients: JSON.parse(recipeForm.ingredients),
        steps: JSON.parse(recipeForm.steps),
        safety_requirements: JSON.parse(recipeForm.safety_requirements),
      };
      const { error } = await supabase
        .from('recipes')
        .insert(recipeData);

      if (error) throw error;
      
      toast.success('Recipe created successfully');
      setIsRecipeDialogOpen(false);
      fetchData();
      setRecipeForm({
        name_en: '',
        name_am: '',
        description_en: '',
        description_am: '',
        category: 'soap',
        difficulty: 'beginner',
        is_premium: false,
        ingredients: '[]',
        steps: '[]',
        safety_requirements: '[]',
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Recipe deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecipes = recipes.filter(r =>
    r.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name_am?.includes(searchTerm)
  );

  // Stats
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.subscription_tier === 'premium').length;
  const institutionUsers = users.filter(u => u.subscription_tier === 'institution').length;
  const avgSafetyScore = users.length > 0 
    ? Math.round(users.reduce((sum, u) => sum + (u.safety_score || 0), 0) / users.length)
    : 0;

  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
              <p className="text-muted-foreground">
                {isSuperAdmin ? '🔐 Superadmin Access' : '👤 Admin Access'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-muted-foreground">{t('admin.users')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-ethiopian-gold/10 to-ethiopian-gold/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-ethiopian-gold/20">
                  <Crown className="h-5 w-5 text-ethiopian-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{premiumUsers}</p>
                  <p className="text-sm text-muted-foreground">Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-science/10 to-science/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-science/20">
                  <FlaskConical className="h-5 w-5 text-science" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                  <p className="text-sm text-muted-foreground">{t('admin.recipes')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgSafetyScore}%</p>
                  <p className="text-sm text-muted-foreground">Avg Safety</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              {t('admin.recipes')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('admin.analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.users')}</CardTitle>
                <CardDescription>Manage platform users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Safety Score</TableHead>
                          {isSuperAdmin && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.full_name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{u.skill_level}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                u.subscription_tier === 'premium' ? 'bg-ethiopian-gold text-black' :
                                u.subscription_tier === 'institution' ? 'bg-science text-white' :
                                'bg-muted'
                              }>
                                {u.subscription_tier}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${u.safety_score || 0}%` }}
                                  />
                                </div>
                                <span className="text-sm">{u.safety_score || 0}%</span>
                              </div>
                            </TableCell>
                            {isSuperAdmin && (
                              <TableCell>
                                <Select
                                  defaultValue="user"
                                  onValueChange={(value) => handleUpdateUserRole(u.user_id, value as 'user' | 'admin')}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('admin.recipes')}</CardTitle>
                  <CardDescription>Manage chemistry recipes</CardDescription>
                </div>
                <Dialog open={isRecipeDialogOpen} onOpenChange={setIsRecipeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Recipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Recipe</DialogTitle>
                      <DialogDescription>Add a new chemistry recipe to the platform</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name (English)</Label>
                          <Input
                            value={recipeForm.name_en}
                            onChange={(e) => setRecipeForm({...recipeForm, name_en: e.target.value})}
                            placeholder="Soap Recipe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Name (Amharic)</Label>
                          <Input
                            value={recipeForm.name_am}
                            onChange={(e) => setRecipeForm({...recipeForm, name_am: e.target.value})}
                            placeholder="የሳሙና ሪሰፒ"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Description (English)</Label>
                          <Textarea
                            value={recipeForm.description_en}
                            onChange={(e) => setRecipeForm({...recipeForm, description_en: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description (Amharic)</Label>
                          <Textarea
                            value={recipeForm.description_am}
                            onChange={(e) => setRecipeForm({...recipeForm, description_am: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={recipeForm.category}
                            onValueChange={(value) => setRecipeForm({...recipeForm, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soap">Soap</SelectItem>
                              <SelectItem value="detergent">Detergent</SelectItem>
                              <SelectItem value="cleaner">Cleaner</SelectItem>
                              <SelectItem value="cosmetic">Cosmetic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <Select
                            value={recipeForm.difficulty}
                            onValueChange={(value) => setRecipeForm({...recipeForm, difficulty: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Premium Only</Label>
                          <div className="flex items-center h-10">
                            <Switch
                              checked={recipeForm.is_premium}
                              onCheckedChange={(checked) => setRecipeForm({...recipeForm, is_premium: checked})}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Ingredients (JSON array)</Label>
                        <Textarea
                          value={recipeForm.ingredients}
                          onChange={(e) => setRecipeForm({...recipeForm, ingredients: e.target.value})}
                          placeholder='[{"name": "Oil", "amount": "500g"}]'
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Steps (JSON array)</Label>
                        <Textarea
                          value={recipeForm.steps}
                          onChange={(e) => setRecipeForm({...recipeForm, steps: e.target.value})}
                          placeholder='[{"step": 1, "instruction": "Mix ingredients"}]'
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Safety Requirements (JSON array)</Label>
                        <Textarea
                          value={recipeForm.safety_requirements}
                          onChange={(e) => setRecipeForm({...recipeForm, safety_requirements: e.target.value})}
                          placeholder='["Wear gloves", "Use goggles"]'
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRecipeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRecipe}>Create Recipe</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Premium</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecipes.map((recipe) => (
                          <TableRow key={recipe.id}>
                            <TableCell className="font-medium">
                              {language === 'am' ? recipe.name_am : recipe.name_en}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{recipe.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                recipe.difficulty === 'advanced' ? 'bg-danger' :
                                recipe.difficulty === 'intermediate' ? 'bg-warning' :
                                'bg-success'
                              }>
                                {recipe.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {recipe.is_premium ? (
                                <Crown className="h-4 w-4 text-ethiopian-gold" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteRecipe(recipe.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Users</span>
                      <span className="text-2xl font-bold">{totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Premium Subscribers</span>
                      <span className="text-xl font-semibold text-ethiopian-gold">{premiumUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Institutions</span>
                      <span className="text-xl font-semibold text-science">{institutionUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="text-xl font-semibold">
                        {totalUsers > 0 ? Math.round(((premiumUsers + institutionUsers) / totalUsers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Safety Score</span>
                      <span className="text-2xl font-bold text-success">{avgSafetyScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Recipes</span>
                      <span className="text-xl font-semibold">{recipes.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Premium Recipes</span>
                      <span className="text-xl font-semibold">{recipes.filter(r => r.is_premium).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Free Recipes</span>
                      <span className="text-xl font-semibold">{recipes.filter(r => !r.is_premium).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Estimate</p>
                      <p className="text-3xl font-bold text-ethiopian-gold">
                        {(premiumUsers * 199 + institutionUsers * 999).toLocaleString()} ETB
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Premium Revenue</p>
                      <p className="text-3xl font-bold">
                        {(premiumUsers * 199).toLocaleString()} ETB
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Institution Revenue</p>
                      <p className="text-3xl font-bold">
                        {(institutionUsers * 999).toLocaleString()} ETB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
