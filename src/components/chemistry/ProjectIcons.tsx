import React from 'react';
import { 
  Zap, 
  Palette, 
  Fuel, 
  Pill, 
  Sun, 
  FlaskConical, 
  Droplets, 
  Cloud, 
  Sparkles, 
  Battery,
  Flame,
  Flower2,
  Milk,
  Package,
  Filter,
  Wine,
  Egg,
  Leaf,
  Beaker,
  Mountain,
  TestTube,
  Atom,
  Microscope,
  Layers,
  Shield,
  LucideIcon
} from 'lucide-react';

// Map of project icon types to Lucide icons
export const projectIcons: Record<string, LucideIcon> = {
  electroplating: Zap,
  'ph-indicator': Palette,
  biodiesel: Fuel,
  aspirin: Pill,
  photochromic: Sun,
  'schiff-base': FlaskConical,
  hydrogel: Droplets,
  aerogel: Cloud,
  nanoparticles: Sparkles,
  'fuel-cell': Battery,
  'wood-ash-soap': Flame,
  'natural-dyes': Flower2,
  'casein-plastic': Milk,
  'biodegradable-film': Package,
  'water-filtration': Filter,
  bioethanol: Wine,
  'calcium-citrate': Egg,
  'natural-pesticide': Leaf,
  'aloe-gel': Beaker,
  'iron-oxide': Mountain,
  default: TestTube,
};

// Get icon component for a project
export const getProjectIcon = (projectId: string): LucideIcon => {
  return projectIcons[projectId] || projectIcons.default;
};

// Animated Icon Wrapper Component
interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  animate?: 'pulse' | 'spin' | 'bounce' | 'glow' | 'float' | 'none';
  color?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  icon: Icon, 
  className = '', 
  size = 24,
  animate = 'none',
  color
}) => {
  const animationClasses: Record<string, string> = {
    pulse: 'animate-pulse',
    spin: 'animate-spin-slow',
    bounce: 'animate-bounce-subtle',
    glow: 'animate-glow-pulse drop-shadow-[0_0_8px_currentColor]',
    float: 'animate-float',
    none: '',
  };

  return (
    <Icon 
      size={size} 
      className={`${animationClasses[animate]} ${className}`}
      style={color ? { color } : undefined}
    />
  );
};

// Category Icons with colors
export const categoryIconConfig = {
  electrochemistry: { 
    icon: Zap, 
    color: 'hsl(210, 100%, 52%)', 
    bgColor: 'hsl(210, 100%, 52%, 0.15)',
    label: 'Electrochemistry'
  },
  organic: { 
    icon: FlaskConical, 
    color: 'hsl(152, 76%, 42%)', 
    bgColor: 'hsl(152, 76%, 42%, 0.15)',
    label: 'Organic Chemistry'
  },
  materials: { 
    icon: Layers, 
    color: 'hsl(280, 65%, 55%)', 
    bgColor: 'hsl(280, 65%, 55%, 0.15)',
    label: 'Materials Science'
  },
  'green-chemistry': { 
    icon: Leaf, 
    color: 'hsl(142, 70%, 45%)', 
    bgColor: 'hsl(142, 70%, 45%, 0.15)',
    label: 'Green Chemistry'
  },
  'local-materials': { 
    icon: Mountain, 
    color: 'hsl(42, 100%, 55%)', 
    bgColor: 'hsl(42, 100%, 55%, 0.15)',
    label: 'Local Materials'
  },
  biochemistry: { 
    icon: Microscope, 
    color: 'hsl(340, 75%, 55%)', 
    bgColor: 'hsl(340, 75%, 55%, 0.15)',
    label: 'Biochemistry'
  },
};

// Level Icons with colors
export const levelIconConfig = {
  beginner: { 
    icon: Shield, 
    color: 'hsl(142, 70%, 45%)', 
    bgColor: 'hsl(142, 70%, 45%, 0.15)',
    label: 'Beginner'
  },
  intermediate: { 
    icon: Atom, 
    color: 'hsl(42, 100%, 55%)', 
    bgColor: 'hsl(42, 100%, 55%, 0.15)',
    label: 'Intermediate'
  },
  advanced: { 
    icon: Sparkles, 
    color: 'hsl(280, 65%, 55%)', 
    bgColor: 'hsl(280, 65%, 55%, 0.15)',
    label: 'Advanced'
  },
};

// Safety Level Icons
export const safetyIconConfig = {
  low: { 
    color: 'hsl(152, 76%, 42%)', 
    bgColor: 'hsl(152, 76%, 42%, 0.15)',
    label: 'Low Risk'
  },
  medium: { 
    color: 'hsl(42, 100%, 55%)', 
    bgColor: 'hsl(42, 100%, 55%, 0.15)',
    label: 'Medium Risk'
  },
  high: { 
    color: 'hsl(0, 90%, 55%)', 
    bgColor: 'hsl(0, 90%, 55%, 0.15)',
    label: 'High Risk'
  },
};

export default AnimatedIcon;
