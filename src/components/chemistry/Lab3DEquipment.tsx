import React from 'react';

interface Lab3DEquipmentProps {
  type: string;
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Lab3DEquipment: React.FC<Lab3DEquipmentProps> = ({ 
  type, 
  isAnimating = true,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56'
  };

  const renderEquipment = () => {
    switch (type) {
      case 'beaker':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Beaker body */}
            <div className="absolute inset-x-4 bottom-0 h-3/4 bg-gradient-to-b from-cyan-200/60 to-cyan-400/40 rounded-b-xl border-2 border-cyan-300/50 backdrop-blur-sm">
              {/* Liquid inside */}
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-blue-500/70 to-blue-300/50 rounded-b-lg animate-pulse">
                {/* Bubbles */}
                {isAnimating && (
                  <>
                    <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-bubble-rise" />
                    <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-bubble-rise delay-300" />
                    <div className="absolute bottom-1 right-1/4 w-2.5 h-2.5 bg-white/40 rounded-full animate-bubble-rise delay-500" />
                  </>
                )}
              </div>
            </div>
            {/* Beaker lip */}
            <div className="absolute inset-x-2 top-1/4 h-2 bg-cyan-200/80 rounded-t-lg border-t-2 border-cyan-300" />
            {/* Pour spout */}
            <div className="absolute right-0 top-1/4 w-4 h-4 bg-cyan-200/80 rounded-tr-xl" />
            {/* Measurement lines */}
            <div className="absolute left-6 bottom-8 w-4 h-px bg-cyan-600/50" />
            <div className="absolute left-6 bottom-12 w-3 h-px bg-cyan-600/50" />
            <div className="absolute left-6 bottom-16 w-4 h-px bg-cyan-600/50" />
          </div>
        );

      case 'flask':
      case 'round-bottom-flask':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Flask neck */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-1/3 bg-gradient-to-b from-gray-200/60 to-transparent rounded-t-full border-x-2 border-t-2 border-gray-300/50" />
            {/* Flask body (round bottom) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4/5 h-2/3 bg-gradient-to-b from-cyan-200/50 to-cyan-300/30 rounded-[50%] border-2 border-cyan-300/50">
              {/* Liquid */}
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-amber-500/60 to-amber-300/40 rounded-[50%]">
                {isAnimating && (
                  <div className="absolute inset-0 animate-pulse opacity-50" />
                )}
              </div>
            </div>
            {/* Stopper */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-8 h-4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-lg" />
          </div>
        );

      case 'test-tubes':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d flex justify-center items-end gap-2 ${isAnimating ? 'animate-float' : ''}`}>
            {[
              { color: 'from-red-400/70 to-red-500/50', delay: '0' },
              { color: 'from-green-400/70 to-green-500/50', delay: '150' },
              { color: 'from-blue-400/70 to-blue-500/50', delay: '300' },
              { color: 'from-purple-400/70 to-purple-500/50', delay: '450' },
            ].map((tube, i) => (
              <div key={i} className={`relative w-5 h-24 ${isAnimating ? 'animate-wiggle' : ''}`} style={{ animationDelay: `${tube.delay}ms` }}>
                {/* Tube body */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200/40 to-gray-300/30 rounded-b-full border border-gray-300/50">
                  {/* Liquid */}
                  <div className={`absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t ${tube.color} rounded-b-full`} />
                </div>
                {/* Tube rim */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gray-300/80 rounded-full" />
              </div>
            ))}
          </div>
        );

      case 'electrolytic-cell':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Container */}
            <div className="absolute inset-x-2 bottom-2 h-3/4 bg-gradient-to-b from-gray-200/40 to-gray-300/30 rounded-lg border-2 border-gray-400/50">
              {/* Electrolyte solution */}
              <div className="absolute bottom-0 inset-x-0 h-4/5 bg-gradient-to-t from-blue-500/50 to-blue-300/30 rounded-b-lg">
                {/* Cathode (left) */}
                <div className="absolute left-2 bottom-0 w-3 h-3/4 bg-gradient-to-r from-gray-600 to-gray-500 rounded-t" />
                {/* Anode (right) */}
                <div className="absolute right-2 bottom-0 w-3 h-3/4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-t" />
                {/* Bubbles at electrodes */}
                {isAnimating && (
                  <>
                    <div className="absolute left-3 bottom-8 w-1 h-1 bg-white/70 rounded-full animate-bubble-rise" />
                    <div className="absolute left-2 bottom-12 w-1.5 h-1.5 bg-white/60 rounded-full animate-bubble-rise delay-200" />
                    <div className="absolute right-3 bottom-10 w-1 h-1 bg-white/70 rounded-full animate-bubble-rise delay-100" />
                  </>
                )}
              </div>
            </div>
            {/* Wires */}
            <div className="absolute left-4 top-0 w-1 h-1/3 bg-red-500 rounded-full" />
            <div className="absolute right-4 top-0 w-1 h-1/3 bg-gray-800 rounded-full" />
            {/* Power source indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-400 rounded text-[8px] font-bold text-yellow-900">
              6V ⚡
            </div>
          </div>
        );

      case 'pot':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Pot body */}
            <div className="absolute inset-x-4 bottom-4 h-2/3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-xl border-2 border-gray-500">
              {/* Liquid inside */}
              <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-purple-600/80 to-purple-400/60 rounded-b-lg">
                {/* Steam */}
                {isAnimating && (
                  <>
                    <div className="absolute -top-4 left-1/4 w-2 h-8 bg-white/30 rounded-full blur-sm animate-steam" />
                    <div className="absolute -top-6 left-1/2 w-3 h-10 bg-white/25 rounded-full blur-md animate-steam delay-200" />
                    <div className="absolute -top-4 right-1/4 w-2 h-8 bg-white/30 rounded-full blur-sm animate-steam delay-400" />
                  </>
                )}
              </div>
            </div>
            {/* Pot handles */}
            <div className="absolute left-0 top-1/3 w-4 h-4 border-4 border-gray-500 rounded-full" />
            <div className="absolute right-0 top-1/3 w-4 h-4 border-4 border-gray-500 rounded-full" />
            {/* Lid */}
            <div className="absolute inset-x-2 top-1/4 h-3 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full border border-gray-500" />
            {/* Lid handle */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/4 -translate-y-1/2 w-4 h-3 bg-gray-600 rounded-full" />
          </div>
        );

      case 'separating-funnel':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Top bulb */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 w-20 h-16 bg-gradient-to-b from-gray-200/50 to-gray-300/30 rounded-full border-2 border-gray-300/50">
              {/* Top layer (lighter) */}
              <div className="absolute top-2 inset-x-2 h-1/2 bg-gradient-to-b from-yellow-400/60 to-yellow-500/50 rounded-t-full" />
              {/* Bottom layer (denser) */}
              <div className="absolute bottom-2 inset-x-2 h-1/3 bg-gradient-to-b from-amber-700/70 to-amber-800/60 rounded-b-full" />
            </div>
            {/* Neck */}
            <div className="absolute left-1/2 -translate-x-1/2 top-20 w-6 h-8 bg-gradient-to-b from-gray-200/40 to-gray-300/30 border-x-2 border-gray-300/50" />
            {/* Stopcock */}
            <div className="absolute left-1/2 -translate-x-1/2 top-28 w-8 h-3 bg-amber-700 rounded flex items-center justify-center">
              <div className="w-1 h-full bg-amber-900" />
            </div>
            {/* Bottom outlet */}
            <div className="absolute left-1/2 -translate-x-1/2 top-32 w-2 h-6 bg-gray-300/50 rounded-b-full" />
            {/* Drip */}
            {isAnimating && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-2 h-2 bg-amber-700/80 rounded-full animate-drip" />
            )}
          </div>
        );

      case 'spectrophotometer':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Main body */}
            <div className="absolute inset-4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl border border-gray-600">
              {/* Display screen */}
              <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-b from-green-900 to-green-950 rounded border border-green-700">
                <div className="flex items-center justify-center h-full">
                  <span className={`text-green-400 text-xs font-mono ${isAnimating ? 'animate-pulse' : ''}`}>
                    λ = 420nm
                  </span>
                </div>
              </div>
              {/* Sample holder */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-12 bg-gray-600 rounded">
                {/* Cuvette */}
                <div className="absolute inset-1 bg-gradient-to-b from-cyan-300/50 to-cyan-400/40 rounded">
                  <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-purple-500/70 to-purple-400/50" />
                </div>
              </div>
              {/* Light beam indicator */}
              {isAnimating && (
                <div className="absolute top-16 left-4 w-6 h-1 bg-gradient-to-r from-yellow-400 to-transparent animate-pulse" />
              )}
              {/* Buttons */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-around">
                <div className="w-4 h-4 bg-green-600 rounded-full" />
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
                <div className="w-4 h-4 bg-red-600 rounded-full" />
              </div>
            </div>
          </div>
        );

      case 'magnetic-stirrer':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Base plate */}
            <div className="absolute bottom-2 inset-x-4 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg border border-gray-500">
              {/* Control knob */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600" />
              {/* Power indicator */}
              <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${isAnimating ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
            </div>
            {/* Beaker on top */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-20 h-20 bg-gradient-to-b from-gray-200/40 to-gray-300/30 rounded-b-lg border-2 border-gray-300/50">
              {/* Liquid with vortex */}
              <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-blue-500/60 to-blue-300/40 rounded-b-lg overflow-hidden">
                {isAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 rounded-full animate-spin" />
                    <div className="absolute w-4 h-4 border-2 border-white/20 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                  </div>
                )}
              </div>
              {/* Stir bar */}
              <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-gray-800 rounded-full ${isAnimating ? 'animate-spin' : ''}`} />
            </div>
          </div>
        );

      case 'fuel-cell':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Cell stack */}
            <div className="absolute inset-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-lg border-2 border-gray-500">
              {/* Membrane layers */}
              <div className="absolute top-2 inset-x-2 h-4 bg-blue-400/50 rounded" />
              <div className="absolute top-8 inset-x-2 h-1 bg-yellow-400/70 rounded" />
              <div className="absolute top-11 inset-x-2 h-4 bg-blue-400/50 rounded" />
            </div>
            {/* H2 inlet */}
            <div className="absolute left-0 top-1/3 flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full text-[6px] text-white flex items-center justify-center font-bold">H₂</div>
              <div className="w-6 h-1 bg-blue-400" />
            </div>
            {/* O2 inlet */}
            <div className="absolute right-0 top-1/3 flex items-center">
              <div className="w-6 h-1 bg-red-400" />
              <div className="w-4 h-4 bg-red-500 rounded-full text-[6px] text-white flex items-center justify-center font-bold">O₂</div>
            </div>
            {/* Electrical output */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className={`text-yellow-400 text-xs font-bold ${isAnimating ? 'animate-pulse' : ''}`}>
                ⚡ 0.7V
              </div>
            </div>
            {/* Electron flow indicator */}
            {isAnimating && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-around">
                <span className="text-yellow-300 animate-bounce text-[8px]">e⁻</span>
                <span className="text-yellow-300 animate-bounce delay-100 text-[8px]">e⁻</span>
                <span className="text-yellow-300 animate-bounce delay-200 text-[8px]">e⁻</span>
              </div>
            )}
          </div>
        );

      case 'fermentation-jar':
        return (
          <div className={`${sizeClasses[size]} relative preserve-3d ${isAnimating ? 'animate-float' : ''}`}>
            {/* Jar body */}
            <div className="absolute inset-x-4 bottom-4 h-3/4 bg-gradient-to-b from-gray-200/40 to-gray-300/30 rounded-xl border-2 border-gray-300/50">
              {/* Fermenting liquid */}
              <div className="absolute bottom-0 inset-x-0 h-4/5 bg-gradient-to-t from-amber-600/70 to-amber-400/50 rounded-b-xl">
                {/* Fruit pieces */}
                <div className="absolute bottom-2 left-4 w-3 h-3 bg-orange-500 rounded-full opacity-70" />
                <div className="absolute bottom-4 right-6 w-2 h-2 bg-yellow-500 rounded-full opacity-60" />
                <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-orange-400 rounded-full opacity-70" />
                {/* Bubbles */}
                {isAnimating && (
                  <>
                    <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-bubble-rise" />
                    <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-white/40 rounded-full animate-bubble-rise delay-300" />
                    <div className="absolute bottom-6 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-bubble-rise delay-600" />
                  </>
                )}
              </div>
            </div>
            {/* Lid with airlock/balloon */}
            <div className="absolute inset-x-6 top-4 h-4 bg-gray-400 rounded-t-lg" />
            {/* Balloon */}
            <div className={`absolute left-1/2 -translate-x-1/2 -top-2 w-10 h-10 bg-gradient-to-b from-red-400 to-red-500 rounded-full ${isAnimating ? 'animate-pulse scale-110' : ''}`}>
              {/* Balloon tie */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-red-600 rounded-full" />
            </div>
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses[size]} flex items-center justify-center bg-muted/20 rounded-xl border-2 border-dashed border-muted-foreground/30`}>
            <span className="text-4xl">{type === 'key' ? '🔑' : '🧪'}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderEquipment()}
    </div>
  );
};

export default Lab3DEquipment;
