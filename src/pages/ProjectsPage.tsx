import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { chemistryProjects, projectLevels, projectCategories, ProjectLevel, ProjectCategory } from '@/data/chemistryProjects';
import ProjectCard from '@/components/chemistry/ProjectCard';
import ProjectDetailModal from '@/components/chemistry/ProjectDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Beaker, 
  X,
  Atom,
  FlaskConical,
  TestTube
} from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  const isOromo = language === 'or';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ProjectLevel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof chemistryProjects[0] | null>(null);

  const filteredProjects = useMemo(() => {
    return chemistryProjects.filter(project => {
      const matchesSearch = searchQuery === '' ||
        project.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.titleAm.includes(searchQuery) ||
        project.titleOr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.chemistryTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLevel = selectedLevel === null || project.level === selectedLevel;
      const matchesCategory = selectedCategory === null || project.category === selectedCategory;

      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchQuery, selectedLevel, selectedCategory]);

  const getText = (en: string, am: string, or: string) => {
    if (isAmharic) return am;
    if (isOromo) return or;
    return en;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLevel(null);
    setSelectedCategory(null);
  };

  const hasFilters = searchQuery || selectedLevel || selectedCategory;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center animate-float">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                {getText('Chemistry Projects', 'የኬሚስትሪ ፕሮጀክቶች', 'Pirojektoota Keemistririi')}
              </h1>
              <p className="text-muted-foreground">
                {getText(
                  `${chemistryProjects.length} hands-on experiments with 3D animations`,
                  `${chemistryProjects.length} በ3D አኒሜሽን ያሉ ተግባራዊ ሙከራዎች`,
                  `Muuxannoo harkaa ${chemistryProjects.length} animeshiinii 3D waliin`
                )}
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={getText('Search projects, topics...', 'ፕሮጀክቶችን ይፈልጉ...', 'Pirojektoota barbaadi...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-lg"
              />
            </div>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                {getText('Clear', 'አጥፋ', 'Haqi')}
              </Button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground mr-2 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              {getText('Level:', 'ደረጃ:', 'Sadarkaa:')}
            </span>
            {(Object.keys(projectLevels) as ProjectLevel[]).map(level => (
              <Badge
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedLevel === level ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-primary/10'
                }`}
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
              >
                {getText(projectLevels[level].en, projectLevels[level].am, projectLevels[level].or)}
              </Badge>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-sm text-muted-foreground mr-2 flex items-center">
              <Beaker className="w-4 h-4 mr-1" />
              {getText('Category:', 'ምድብ:', 'Gosa:')}
            </span>
            {(Object.keys(projectCategories) as ProjectCategory[]).map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedCategory === cat ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-primary/10'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              >
                <span className="mr-1">{projectCategories[cat].icon}</span>
                {getText(projectCategories[cat].en, projectCategories[cat].am, projectCategories[cat].or)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {getText(
              `Showing ${filteredProjects.length} of ${chemistryProjects.length} projects`,
              `ከ${chemistryProjects.length} ${filteredProjects.length} ፕሮጀክቶችን በማሳየት ላይ`,
              `Pirojektoota ${chemistryProjects.length} keessaa ${filteredProjects.length} agarsiisaa`
            )}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {getText('No projects found', 'ፕሮጀክቶች አልተገኙም', 'Pirojektiin hin argamne')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {getText(
                'Try adjusting your filters or search terms',
                'ማጣሪያዎችን ወይም የፍለጋ ቃላትን ይለውጡ',
                'Filteera ykn jecha barbaacha sirreessi'
              )}
            </p>
            <Button onClick={clearFilters} variant="outline">
              {getText('Clear all filters', 'ሁሉንም ማጣሪያዎች አጥፋ', 'Filteera hunda haqi')}
            </Button>
          </div>
        )}

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </Layout>
  );
};

export default ProjectsPage;