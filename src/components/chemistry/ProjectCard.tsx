import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChemistryProject, projectLevels, projectCategories } from '@/data/chemistryProjects';
import Lab3DEquipment from './Lab3DEquipment';
import { 
  Clock, 
  Shield, 
  Star, 
  ChevronRight,
  AlertTriangle,
  Beaker
} from 'lucide-react';

interface ProjectCardProps {
  project: ChemistryProject;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { language } = useLanguage();

  const getTitle = () => {
    if (language === 'am') return project.titleAm;
    if (language === 'or') return project.titleOr;
    return project.titleEn;
  };

  const getDescription = () => {
    if (language === 'am') return project.descriptionAm;
    if (language === 'or') return project.descriptionOr;
    return project.descriptionEn;
  };

  const getLevelName = () => {
    const levelData = projectLevels[project.level];
    if (language === 'am') return levelData.am;
    if (language === 'or') return levelData.or;
    return levelData.en;
  };

  const getCategoryName = () => {
    const categoryData = projectCategories[project.category];
    if (language === 'am') return categoryData.am;
    if (language === 'or') return categoryData.or;
    return categoryData.en;
  };

  const safetyColors = {
    low: 'bg-safety-green/20 text-safety-green border-safety-green/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-danger/20 text-danger border-danger/30'
  };

  const levelColors = {
    beginner: 'bg-green-500/20 text-green-600 border-green-500/30',
    intermediate: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
    advanced: 'bg-purple-500/20 text-purple-600 border-purple-500/30'
  };

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 border-2 border-transparent hover:border-primary/30"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* 3D Equipment Preview */}
      <div className="relative h-40 bg-gradient-to-b from-muted/50 to-muted/20 flex items-center justify-center overflow-hidden">
        <Lab3DEquipment type={project.animation3D} size="md" />
        
        {/* Project icon overlay */}
        <div className="absolute top-3 right-3 text-3xl opacity-80 group-hover:scale-125 transition-transform duration-300">
          {project.icon}
        </div>

        {/* Category badge */}
        <Badge 
          variant="secondary" 
          className="absolute bottom-3 left-3 flex items-center gap-1"
        >
          <span>{projectCategories[project.category].icon}</span>
          {getCategoryName()}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {getTitle()}
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2">
          {getDescription()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={levelColors[project.level]}>
            {getLevelName()}
          </Badge>
          <Badge variant="outline" className={safetyColors[project.safetyLevel]}>
            <Shield className="w-3 h-3 mr-1" />
            {project.safetyLevel === 'low' ? (language === 'am' ? 'ዝቅተኛ' : language === 'or' ? 'Gadi' : 'Low') :
             project.safetyLevel === 'medium' ? (language === 'am' ? 'መካከለኛ' : language === 'or' ? 'Giddugaleessa' : 'Medium') :
             (language === 'am' ? 'ከፍተኛ' : language === 'or' ? 'Ol\'aanaa' : 'High')}
          </Badge>
        </div>

        {/* Info row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {project.duration}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < project.difficulty ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Chemistry topics */}
        <div className="flex flex-wrap gap-1">
          {project.chemistryTopics.slice(0, 3).map((topic, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full">
              {topic}
            </span>
          ))}
          {project.chemistryTopics.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
              +{project.chemistryTopics.length - 3}
            </span>
          )}
        </div>

        {/* Action button */}
        <Button 
          variant="ghost" 
          className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            {language === 'am' ? 'ፕሮጀክቱን ይመልከቱ' : language === 'or' ? 'Piroojektii Ilaali' : 'View Project'}
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
