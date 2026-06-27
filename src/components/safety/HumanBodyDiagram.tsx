import React from 'react';

type Route = 'skin' | 'eyes' | 'inhalation' | 'ingestion';

interface Props {
  route: Route;
  severity?: 'low' | 'moderate' | 'high' | 'extreme';
}

/**
 * Anatomical front-view human body diagram (SVG).
 * Highlights the affected system based on exposure route.
 * No cartoon/character look — proportional medical illustration style.
 */
const HumanBodyDiagram: React.FC<Props> = ({ route, severity = 'high' }) => {
  const severityColor = {
    low: '#facc15',
    moderate: '#f97316',
    high: '#ef4444',
    extreme: '#dc2626',
  }[severity];

  const isSkin = route === 'skin';
  const isEyes = route === 'eyes';
  const isInhale = route === 'inhalation';
  const isIngest = route === 'ingestion';

  return (
    <div className="relative w-full flex justify-center">
      <svg
        viewBox="0 0 220 520"
        className="w-full max-w-[260px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5d6b3" />
            <stop offset="100%" stopColor="#e0b48a" />
          </linearGradient>
          <radialGradient id="dangerPulse">
            <stop offset="0%" stopColor={severityColor} stopOpacity="0.9" />
            <stop offset="70%" stopColor={severityColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={severityColor} stopOpacity="0" />
          </radialGradient>
          <filter id="bodyShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Full body silhouette (anatomical proportions) */}
        <g filter="url(#bodyShadow)" stroke="#8a6a4a" strokeWidth="1" fill="url(#skinGrad)">
          {/* Head */}
          <ellipse cx="110" cy="42" rx="26" ry="32" />
          {/* Neck */}
          <path d="M98 70 L98 88 Q110 94 122 88 L122 70 Z" />
          {/* Torso */}
          <path d="M70 90 Q60 100 62 130 L60 200 Q58 240 66 270 L78 290 Q110 296 142 290 L154 270 Q162 240 160 200 L158 130 Q160 100 150 90 Q130 84 110 84 Q90 84 70 90 Z" />
          {/* Left arm */}
          <path d="M62 110 Q48 130 46 170 L44 220 Q44 250 50 270 L58 272 Q60 250 60 220 L64 170 Q66 140 72 122 Z" />
          {/* Right arm */}
          <path d="M158 110 Q172 130 174 170 L176 220 Q176 250 170 270 L162 272 Q160 250 160 220 L156 170 Q154 140 148 122 Z" />
          {/* Hands */}
          <ellipse cx="54" cy="282" rx="10" ry="14" />
          <ellipse cx="166" cy="282" rx="10" ry="14" />
          {/* Hips */}
          <path d="M70 286 Q66 310 72 330 L100 336 Q110 338 120 336 L148 330 Q154 310 150 286 Z" />
          {/* Left leg */}
          <path d="M76 332 Q72 380 78 430 L86 480 Q92 490 96 488 L100 470 Q104 420 104 380 L102 336 Z" />
          {/* Right leg */}
          <path d="M144 332 Q148 380 142 430 L134 480 Q128 490 124 488 L120 470 Q116 420 116 380 L118 336 Z" />
          {/* Feet */}
          <ellipse cx="89" cy="495" rx="14" ry="7" />
          <ellipse cx="131" cy="495" rx="14" ry="7" />
        </g>

        {/* Facial features */}
        <g fill="#5a3a22">
          {/* Eyes */}
          <ellipse cx="100" cy="40" rx="3.5" ry="2" fill={isEyes ? severityColor : '#3a2818'} />
          <ellipse cx="120" cy="40" rx="3.5" ry="2" fill={isEyes ? severityColor : '#3a2818'} />
          {/* Nose */}
          <path d="M110 44 Q108 52 106 56 Q110 58 114 56 Q112 52 110 44 Z" fill="none" stroke="#8a6a4a" strokeWidth="0.8" />
          {/* Mouth */}
          <path d="M104 64 Q110 67 116 64" fill="none" stroke="#8a6a4a" strokeWidth="1.2" />
        </g>

        {/* Internal anatomy overlay — shown only when relevant */}
        {isInhale && (
          <g opacity="0.85">
            {/* Lungs */}
            <path
              d="M88 120 Q72 130 72 160 Q72 195 88 210 Q98 212 100 200 L100 130 Q96 118 88 120 Z"
              fill={severityColor}
              fillOpacity="0.55"
              stroke={severityColor}
              strokeWidth="1.5"
            />
            <path
              d="M132 120 Q148 130 148 160 Q148 195 132 210 Q122 212 120 200 L120 130 Q124 118 132 120 Z"
              fill={severityColor}
              fillOpacity="0.55"
              stroke={severityColor}
              strokeWidth="1.5"
            />
            {/* Trachea */}
            <rect x="106" y="92" width="8" height="32" rx="3" fill={severityColor} fillOpacity="0.7" />
            <circle cx="110" cy="118" r="22" fill="url(#dangerPulse)">
              <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {isIngest && (
          <g opacity="0.85">
            {/* Esophagus */}
            <rect x="107" y="78" width="6" height="60" rx="2" fill={severityColor} fillOpacity="0.7" />
            {/* Stomach */}
            <path
              d="M96 150 Q86 160 88 180 Q92 200 110 200 Q132 200 134 178 Q136 158 124 150 Q110 146 96 150 Z"
              fill={severityColor}
              fillOpacity="0.6"
              stroke={severityColor}
              strokeWidth="1.5"
            />
            {/* Intestines */}
            <path
              d="M90 210 Q86 230 100 240 Q116 248 120 232 Q124 218 110 214 Q98 212 90 230 Q86 250 108 258 Q132 262 134 240"
              fill="none"
              stroke={severityColor}
              strokeWidth="3"
              strokeLinecap="round"
              fillOpacity="0.5"
            />
            <circle cx="110" cy="180" r="22" fill="url(#dangerPulse)">
              <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {isEyes && (
          <g>
            <circle cx="100" cy="40" r="10" fill="url(#dangerPulse)">
              <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="40" r="10" fill="url(#dangerPulse)">
              <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {isSkin && (
          <g opacity="0.8">
            {/* Random burn/irritation spots across skin */}
            {[
              [110, 130, 14], [72, 160, 10], [148, 160, 10],
              [54, 282, 8], [166, 282, 8], [100, 250, 11],
              [120, 250, 11], [90, 400, 12], [130, 400, 12],
            ].map(([cx, cy, r], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={severityColor}
                fillOpacity="0.55"
              >
                <animate attributeName="fill-opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
              </circle>
            ))}
          </g>
        )}

        {/* Route label arrow */}
        <g fontFamily="ui-sans-serif, system-ui" fontSize="10" fill={severityColor} fontWeight="600">
          {isEyes && (<><line x1="155" y1="40" x2="135" y2="40" stroke={severityColor} strokeWidth="1.5" /><text x="158" y="44">Eyes</text></>)}
          {isInhale && (<><line x1="170" y1="165" x2="150" y2="165" stroke={severityColor} strokeWidth="1.5" /><text x="173" y="169">Lungs</text></>)}
          {isIngest && (<><line x1="170" y1="180" x2="138" y2="180" stroke={severityColor} strokeWidth="1.5" /><text x="173" y="184">Stomach</text></>)}
          {isSkin && (<><line x1="180" y1="160" x2="158" y2="160" stroke={severityColor} strokeWidth="1.5" /><text x="183" y="164">Skin</text></>)}
        </g>
      </svg>
    </div>
  );
};

export default HumanBodyDiagram;
