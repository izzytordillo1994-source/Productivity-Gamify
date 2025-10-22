import React, { useState } from 'react';
import { Task } from '../types';
import DragHandleIcon from './DragHandleIcon';

interface ArchiveProps {
  archivedTasks: Task[];
}

const Archive: React.FC<ArchiveProps> = ({ archivedTasks }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const formatDate = (isoString: string | undefined) => {
    if (!isoString) return 'Unknown';
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
      <div
        className={`flex justify-between items-center cursor-pointer ${!isCollapsed ? 'border-b-2 border-slate-600 pb-2 mb-4' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="archive-content"
      >
        <div className="flex items-center gap-2 cursor-move">
            <DragHandleIcon />
            <h2 className="font-display text-2xl text-yellow-300">
            Task Archive
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
        <div id="archive-content" className="max-h-96 overflow-y-auto pr-2 mt-4 space-y-3">
          {archivedTasks.length > 0 ? (
            archivedTasks.map(task => (
              <div key={task.id} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-bold text-gray-300 flex-grow">{task.name}</h3>
                  <span className="text-sm text-gray-400 font-mono flex-shrink-0">{formatDate(task.completedAt)}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                <div className="flex justify-between items-baseline mt-2">
                  <p className="text-xs text-gray-400">
                    <strong>Completed by:</strong> {task.assignees.join(', ')}
                  </p>
                  <p className="text-blue-300 font-mono text-sm">EXP: {task.exp}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks completed yet. Go fight some monsters!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Archive;