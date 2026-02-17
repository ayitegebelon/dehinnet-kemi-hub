import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IntegrityBannerProps {
  integrityScore: number;
  warnings: string[];
  language: string;
}

const IntegrityBanner: React.FC<IntegrityBannerProps> = ({ integrityScore, warnings, language }) => {
  const isAm = language === 'am';

  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
        <Shield className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">
          {isAm ? '🛡️ የፈተና ታማኝነት ጠባቂ ንቁ ነው' : '🛡️ Quiz integrity monitor is active'}
        </span>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {integrityScore}%
        </Badge>
      </div>
    );
  }

  const isHigh = integrityScore < 60;

  return (
    <div className={`p-3 rounded-lg border text-sm space-y-2 ${
      isHigh 
        ? 'bg-red-500/10 border-red-500/20' 
        : 'bg-amber-500/10 border-amber-500/20'
    }`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${isHigh ? 'text-red-400' : 'text-amber-400'}`} />
        <span className={`flex-1 font-medium ${isHigh ? 'text-red-400' : 'text-amber-400'}`}>
          {isAm 
            ? '⚠️ ያልተለመደ እንቅስቃሴ ተገኝቷል' 
            : '⚠️ Unusual activity detected'}
        </span>
        <Badge variant="outline" className={`text-xs ${
          isHigh ? 'border-red-500/30 text-red-400' : 'border-amber-500/30 text-amber-400'
        }`}>
          {integrityScore}%
        </Badge>
      </div>
      <ul className="text-xs text-muted-foreground space-y-1 pl-6">
        {warnings.map((w, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IntegrityBanner;
