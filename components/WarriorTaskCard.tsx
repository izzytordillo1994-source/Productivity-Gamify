import React from 'react';
import { Warrior, Task, TaskDifficulty } from '../types';

const difficultyColorMap: { [key in TaskDifficulty]: string } = {
    'Easy': 'text-green-400 border-green-400',
    'Medium': 'text-yellow-400 border-yellow-400',
    'Hard': 'text-orange-400 border-orange-400',
    'Collab': 'text-red-500 border-red-500',
}

interface WarriorTaskCardProps {
  warrior: Warrior;
  tasks: Task[];
}

const WarriorTaskCard: React.FC<WarriorTaskCardProps> = ({ warrior, tasks }) => {
  return (
    <div className="bg-slate-900/70 p-4 border border-slate-700 rounded-lg shadow-md flex flex-col h-full">
      <header className="flex items-center gap-4 mb-4 border-b border-slate-700 pb-3">
        {warrior.avatar.startsWith('data:image') ? (
          <img src={warrior.avatar} alt={`${warrior.name} avatar`} className="w-16 h-16 object-cover rounded-full border-2 border-slate-500" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500 shrink-0">
            <span className="text-4xl" role="img" aria-label={`${warrior.name} emoji`}>{warrior.avatar}</span>
          </div>
        )}
        <div className="flex-grow">
          <h3 className="font-display text-xl text-yellow-200">{warrior.name}</h3>
          <p className="text-sm text-gray-300">Lvl: {warrior.level} | {warrior.team}</p>
        </div>
      </header>

      <div className="mb-4">
        <h4 className="font-bold text-gray-400 mb-2 text-xs uppercase tracking-wider">Skills</h4>
        <div className="flex flex-wrap gap-2">
            {warrior.skills.map(skill => (
                <span key={skill} className="bg-slate-700 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {skill}
                </span>
            ))}
        </div>
      </div>

      <div className="flex-grow">
        <h4 className="font-bold text-gray-400 mb-2 text-sm uppercase tracking-wider">Current Bounties</h4>
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="bg-slate-800/50 p-2 rounded-md border-l-4 border-slate-600">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-100 flex-grow pr-2">{task.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${difficultyColorMap[task.difficulty]}`}>{task.difficulty}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                <p className="text-blue-300 font-mono text-xs mt-1">EXP: {task.exp}</p>
                 {task.difficulty === 'Collab' && (
                    <p className="text-xs text-gray-400 mt-1">
                        <strong>Collaborators:</strong> {task.assignees.join(', ')}
                    </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500 italic">
            <p>Awaiting assignment...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarriorTaskCard;