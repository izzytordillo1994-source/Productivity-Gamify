
import React from 'react';
import { Character } from '../types';
import ProgressBar from './ProgressBar';

interface CharacterStatusProps {
  character: Character;
}

const StatRow: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`flex justify-between items-baseline text-lg ${className}`}>
        <span className="font-bold text-gray-300">{label}</span>
        <span className="font-mono text-yellow-300">{value}</span>
    </div>
);


const CharacterStatus: React.FC<CharacterStatusProps> = ({ character }) => {
  const expPercentage = (character.exp / character.expToNextLevel) * 100;
  
  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg text-white">
      <h2 className="font-display text-2xl text-center border-b-2 border-slate-600 pb-2 mb-4 text-yellow-300">
        {character.name}
      </h2>
      <div className="space-y-3">
        <StatRow label="Level" value={character.level} />
        <StatRow label="HP" value={`${character.hp} / ${character.maxHp}`} />
        <ProgressBar value={character.hp} max={character.maxHp} color="bg-red-500" />

        <div className="pt-2">
            <StatRow label="EXP" value={`${character.exp} / ${character.expToNextLevel}`} />
            <ProgressBar value={character.exp} max={character.expToNextLevel} color="bg-blue-500" />
            <p className="text-right text-sm text-gray-400 mt-1">{expPercentage.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterStatus;
