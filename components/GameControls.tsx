
import React, { useState } from 'react';

interface GameControlsProps {
  onSave: () => void;
  onLoad: () => void;
  hasSaveData: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onSave, onLoad, hasSaveData }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loaded'>('idle');

  const handleSaveClick = () => {
    onSave();
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleLoadClick = () => {
    onLoad();
    setLoadStatus('loaded');
    setTimeout(() => setLoadStatus('idle'), 2000);
  };

  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        onClick={handleSaveClick}
        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 border-b-4 border-blue-800 active:border-b-2 active:mt-0.5"
        aria-label="Save current game progress"
      >
        {saveStatus === 'saved' ? 'Game Saved!' : 'Save Game'}
      </button>
      <button
        onClick={handleLoadClick}
        disabled={!hasSaveData || loadStatus === 'loaded'}
        className="bg-purple-600 text-white font-bold py-2 px-6 rounded-md hover:bg-purple-700 transition-colors duration-200 border-b-4 border-purple-800 active:border-b-2 active:mt-0.5 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:border-gray-700"
        aria-label="Load saved game progress"
      >
        {loadStatus === 'loaded' ? 'Game Loaded!' : 'Load Game'}
      </button>
    </div>
  );
};

export default GameControls;
