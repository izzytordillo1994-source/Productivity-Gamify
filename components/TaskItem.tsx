import React from 'react';
import { Task, TaskDifficulty } from '../types';

interface TaskItemProps {
  task: Task;
  onAttack: (taskId: number) => void;
  disabled: boolean;
}

const difficultyColorMap: { [key in TaskDifficulty]: string } = {
    'Easy': 'text-green-400',
    'Medium': 'text-yellow-400',
    'Hard': 'text-orange-400',
    'Collab': 'text-red-500',
}

const SwordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a.5.5 0 01.5.5v3.502l3.435 1.43a.5.5 0 01.19.606l-1.5 3a.5.5 0 01-.64.22l-3.37-1.348a.5.5 0 01-.115 0L5.13 13.758a.5.5 0 01-.64-.22l-1.5-3a.5.5 0 01.19.606L6.5 8.502V4a.5.5 0 01.5-.5H10z" />
        <path fillRule="evenodd" d="M3.501 14a.5.5 0 01.499.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm12.998 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z" clipRule="evenodd" />
        <path d="M6 14.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z" />
    </svg>
);


const TaskItem: React.FC<TaskItemProps> = ({ task, onAttack, disabled }) => {
  return (
    <div className="bg-slate-700 bg-opacity-50 p-3 rounded-md border border-slate-600 hover:border-yellow-400 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div className="flex-grow mb-3 sm:mb-0">
        <div className="flex items-baseline space-x-3">
            <h3 className="text-xl font-bold text-yellow-100">{task.name}</h3>
            <span className={`font-bold text-sm ${difficultyColorMap[task.difficulty]}`}>{task.difficulty}</span>
        </div>
        
        {task.difficulty === 'Collab' && task.assignees && task.assignees.length > 0 && (
            <div className="mt-2 text-xs text-gray-400">
                <strong className="text-gray-300 mr-2">Collaborators:</strong>
                <span>{task.assignees.join(', ')}</span>
            </div>
        )}

        <p className="text-gray-300 text-sm mt-1">{task.description}</p>
        <p className="text-blue-300 font-mono text-sm mt-2">EXP: {task.exp}</p>
      </div>
      <button
        onClick={() => onAttack(task.id)}
        disabled={disabled}
        className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto shadow-md border-b-4 border-red-800 active:border-b-2 active:mt-0.5 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:border-gray-700 disabled:border-b-4"
      >
        <SwordIcon />
        Attack
      </button>
    </div>
  );
};

export default TaskItem;