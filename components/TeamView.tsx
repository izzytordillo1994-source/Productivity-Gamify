import React, { useState } from 'react';
import { Task, Warrior, TaskDifficulty } from '../types';
import DragHandleIcon from './DragHandleIcon';

interface TeamViewProps {
  tasks: Task[];
  warriors: Warrior[];
}

const difficultyColorMap: { [key in TaskDifficulty]: string } = {
    'Easy': 'text-green-400',
    'Medium': 'text-yellow-400',
    'Hard': 'text-orange-400',
    'Collab': 'text-red-500',
}

const TeamView: React.FC<TeamViewProps> = ({ tasks, warriors }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const getWarriorByName = (name: string) => warriors.find(w => w.name === name);

  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
      <div
        className={`flex justify-between items-center cursor-pointer ${!isCollapsed ? 'border-b-2 border-slate-600 pb-2 mb-4' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="team-view-content"
      >
        <div className="flex items-center gap-2 cursor-move">
            <DragHandleIcon />
            <h2 className="font-display text-2xl text-yellow-300">
            Team Quest Board
            </h2>
        </div>
        <button
          className="text-yellow-300 hover:text-yellow-200"
          aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      {!isCollapsed && (
        <div id="team-view-content" className="max-h-96 overflow-y-auto pr-2 mt-4 space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                <div className="flex items-baseline space-x-3">
                    <h3 className="text-xl font-bold text-yellow-100">{task.name}</h3>
                    <span className={`font-bold text-sm ${difficultyColorMap[task.difficulty]}`}>{task.difficulty}</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{task.description}</p>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold">Assigned:</span>
                    <div className="flex -space-x-2">
                      {task.assignees.map(assigneeName => {
                        const warrior = getWarriorByName(assigneeName);
                        if (!warrior) return null;
                        return (
                          <div key={assigneeName} title={assigneeName}>
                            {warrior.avatar.startsWith('data:image') ? (
                              <img src={warrior.avatar} alt={assigneeName} className="w-6 h-6 object-cover rounded-full border-2 border-slate-600" />
                            ) : (
                              <span className="w-6 h-6 text-sm rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600" role="img" aria-label={assigneeName}>{warrior.avatar}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-blue-300 font-mono text-sm">EXP: {task.exp}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No active tasks for any team member. Time to create some monsters!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamView;