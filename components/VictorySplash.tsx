
import React from 'react';

interface VictorySplashProps {
  exp: number;
}

const VictorySplash: React.FC<VictorySplashProps> = ({ exp }) => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      aria-live="polite"
    >
      <div className="text-6xl font-display text-yellow-300 drop-shadow-lg animate-victory-splash">
        +{exp} EXP!
      </div>
      <style>{`
        @keyframes victory-splash-animation {
          0% {
            transform: scale(0.5) translateY(50px);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(-150px);
            opacity: 0;
          }
        }
        .animate-victory-splash {
          animation: victory-splash-animation 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default VictorySplash;
