import React from 'react';
import { Task, Warrior } from '../types';

interface ArenaProps {
  fightingTask: Task | null;
  warriorAvatar: string;
  currentUser: string | null;
  warriors: Warrior[];
  onClaimVictory: (task: Task) => void;
}

const SwordIcon: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`}>
      <g transform="rotate(45 50 50)">
        <path d="M 50,5 L 55,60 L 50,65 L 45,60 Z" fill="#E0E0E0" stroke="#4A5568" strokeWidth="2" />
        <rect x="40" y="65" width="20" height="8" rx="2" fill="#8B4513" stroke="#4A5568" strokeWidth="2" />
        <rect x="47" y="73" width="6" height="18" fill="#A0522D" stroke="#4A5568" strokeWidth="2" />
        <circle cx="50" y="94" r="4" fill="#FFD700" stroke="#4A5568" strokeWidth="2" />
      </g>
    </svg>
);


const Arena: React.FC<ArenaProps> = ({ fightingTask, warriorAvatar, currentUser, warriors, onClaimVictory }) => {
  const collaborators = fightingTask?.difficulty === 'Collab' 
    ? warriors.filter(w => fightingTask.assignees.includes(w.name) && w.name !== currentUser) 
    : [];

  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg text-white overflow-hidden">
      <h2 className="font-display text-2xl text-center border-b-2 border-slate-600 pb-2 mb-4 text-yellow-300">
        ARENA
      </h2>
      
      {fightingTask ? (
        <div className="animate-fade-in">
          <div className="flex justify-around items-center mb-4 relative h-32">
            {/* Warrior */}
            <div className="flex flex-col items-center animate-breathing z-10">
              {warriorAvatar.startsWith('data:image') ? (
                  <img src={warriorAvatar} alt="Warrior avatar" className="w-20 h-20 object-cover rounded-full border-2 border-blue-400" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center border-2 border-blue-400">
                    <span className="text-4xl" role="img" aria-label="warrior emoji">{warriorAvatar}</span>
                  </div>
                )}
                 <span className="font-bold text-lg mt-2 text-blue-300">YOU</span>
            </div>

            {/* Battle Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 relative">
                    <SwordIcon className="absolute top-0 left-0 sword-slash-left"/>
                    <SwordIcon className="absolute top-0 left-0 sword-slash-right scale-x-[-1]"/>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 clash-spark"></div>
                </div>
            </div>

            {/* Monster */}
             <div className="flex flex-col items-center animate-breathing monster-hit z-10">
                <div className="w-20 h-20 rounded-full bg-red-900/50 flex items-center justify-center border-2 border-red-500">
                    <span className="text-4xl" role="img" aria-label="monster emoji">👹</span>
                </div>
                <span className="font-bold text-lg mt-2 text-red-400 truncate max-w-[100px]">{fightingTask.name}</span>
            </div>
          </div>

          {collaborators.length > 0 && (
            <div className="text-center -mt-2 mb-4 animate-fade-in-slow">
              <p className="text-sm text-gray-400 font-bold mb-2">With Allies:</p>
              <div className="flex justify-center items-center gap-2">
                {collaborators.map(c => (
                   <div key={c.name} title={c.name}>
                     {c.avatar.startsWith('data:image') ? (
                       <img src={c.avatar} alt={`${c.name} avatar`} className="w-10 h-10 object-cover rounded-full border-2 border-slate-500 opacity-80" />
                     ) : (
                       <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                         <span className="text-xl" role="img" aria-label={`${c.name} emoji`}>{c.avatar}</span>
                       </div>
                     )}
                   </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center bg-slate-900/50 p-3 rounded-md border border-slate-700">
            <p className="font-bold">Fighting: <span className="text-yellow-200">{fightingTask.name}</span></p>
            <p className="text-sm text-gray-400">{fightingTask.description}</p>
          </div>
           <button
            onClick={() => onClaimVictory(fightingTask)}
            className="mt-4 w-full bg-yellow-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center border-b-4 border-yellow-700 active:border-b-2 active:mt-0.5"
          >
            Complete Task
          </button>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">The Arena is silent.</p>
          <p>Select a monster from the Attack Session to begin.</p>
        </div>
      )}
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-slow { animation: fade-in 1s 0.3s ease-out forwards; opacity: 0; animation-fill-mode: forwards; }

        @keyframes breathing-effect {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        .animate-breathing { animation: breathing-effect 3s ease-in-out infinite; }

        @keyframes monster-hit-effect {
          0%, 100% { transform: translateX(0); }
          10%, 50% { transform: translateX(-5px); }
          30%, 70% { transform: translateX(5px); }
          90% { transform: translateX(-2px); }
        }
        .monster-hit { animation: monster-hit-effect 0.5s cubic-bezier(.36,.07,.19,.97) 1.2s 2; }
        
        @keyframes sword-slash-left-anim {
          0% { transform: translateX(-150px) rotate(-45deg); opacity: 0; }
          40% { transform: translateX(0) rotate(0deg); opacity: 1; }
          60% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-150px) rotate(-45deg); opacity: 0; }
        }
        .sword-slash-left {
          animation: sword-slash-left-anim 2.5s ease-in-out infinite;
          transform-origin: bottom right;
        }

        @keyframes sword-slash-right-anim {
          0% { transform: translateX(150px) rotate(45deg); opacity: 0; }
          40% { transform: translateX(0) rotate(0deg); opacity: 1; }
          60% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(150px) rotate(45deg); opacity: 0; }
        }
        .sword-slash-right {
          animation: sword-slash-right-anim 2.5s ease-in-out infinite;
          transform-origin: bottom left;
        }
        
        @keyframes clash-spark-anim {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { opacity: 1; }
          51% { transform: scale(1.5); }
        }
        .clash-spark {
          width: 80px;
          height: 80px;
          background-image: 
            radial-gradient(circle, white 5%, yellow 25%, orange 50%, transparent 70%);
          border-radius: 50%;
          animation: clash-spark-anim 2.5s ease-out infinite;
          animation-delay: -0.05s;
        }
      `}</style>
    </div>
  );
};

export default Arena;