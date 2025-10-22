import React from 'react';
import { Warrior, Admin } from '../types';

interface WarriorDetailModalProps {
  warrior: Warrior | Admin;
  onClose: () => void;
}

const WarriorDetailModal: React.FC<WarriorDetailModalProps> = ({ warrior, onClose }) => {
  // Stop propagation to prevent closing the modal when clicking inside the content
  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();
  const isWarrior = 'team' in warrior;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 border-2 border-yellow-400 rounded-lg shadow-2xl p-6 text-white max-w-lg w-full animate-fade-in-up"
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-display text-3xl text-yellow-300">{warrior.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-1 flex flex-col items-center">
             {warrior.avatar.startsWith('data:image') ? (
                <img src={warrior.avatar} alt={`${warrior.name} avatar`} className="w-32 h-32 object-cover rounded-full border-2 border-slate-500" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                  <span className="text-7xl" role="img" aria-label={`${warrior.name} emoji`}>{warrior.avatar}</span>
                </div>
              )}
          </div>
          <div className="sm:col-span-2 space-y-3">
             <div className="bg-slate-900 p-3 rounded-md border border-slate-600">
                <p className="text-lg"><span className="font-bold text-gray-300">Level:</span> <span className="font-mono text-yellow-300">{warrior.level}</span></p>
                <p className="text-lg">
                    <span className="font-bold text-gray-300">{isWarrior ? 'Team' : 'Role'}:</span> 
                    <span className="font-mono text-yellow-300">{isWarrior ? warrior.team : warrior.role}</span>
                </p>
            </div>
            <div className="bg-slate-900 p-3 rounded-md border border-slate-600">
                <h3 className="text-lg font-bold text-gray-300 mb-2">Skills:</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-300">
                    {warrior.skills.map(skill => (
                        <li key={skill}>{skill}</li>
                    ))}
                </ul>
            </div>
          </div>
        </div>

      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WarriorDetailModal;