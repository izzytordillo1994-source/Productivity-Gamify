
import React from 'react';

interface LevelUpModalProps {
  level: number;
  message: string;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-2 border-yellow-400 rounded-lg shadow-2xl p-8 text-center text-white max-w-md w-full animate-fade-in-up">
        <h2 className="font-display text-4xl text-yellow-300 mb-2">LEVEL UP!</h2>
        <p className="text-2xl mb-6">You have reached Level {level}!</p>
        
        <div className="bg-slate-900 p-4 rounded-md border border-slate-600 mb-8">
            <p className="text-lg italic text-gray-300">"{message}"</p>
        </div>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-200 border-b-4 border-blue-800 active:border-b-2 active:mt-0.5"
        >
          Continue
        </button>
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

export default LevelUpModal;
