import React, { useState } from 'react';
import { CeoTask, Warrior, CeoTaskStatus } from '../types';
import DragHandleIcon from './DragHandleIcon';
import AddCeoTaskModal from './AddCeoTaskModal';

interface CeoTaskListProps {
  tasks: CeoTask[];
  warriors: Warrior[];
  onAddTask: (task: Omit<CeoTask, 'id'>) => void;
  onUpdateTask: (taskId: number, updates: Partial<Omit<CeoTask, 'id'>>) => void;
}

const statusColorMap: { [key in CeoTaskStatus]: string } = {
    'Pending': 'bg-gray-500 text-gray-100',
    'In Progress': 'bg-blue-600 text-white',
    'Completed': 'bg-green-600 text-white',
};

const CeoTaskList: React.FC<CeoTaskListProps> = ({ tasks, warriors, onAddTask, onUpdateTask }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ taskId: number; field: keyof Omit<CeoTask, 'id'> } | null>(null);

  const getWarriorAvatar = (name: string) => {
    const warrior = warriors.find(w => w.name === name);
    return warrior ? warrior.avatar : '❓';
  };

  const handleUpdate = (taskId: number, field: keyof Omit<CeoTask, 'id'>, value: string | number) => {
    const finalValue = field === 'week' ? Number(value) : value;
    onUpdateTask(taskId, { [field]: finalValue });
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>, taskId: number, field: keyof Omit<CeoTask, 'id'>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Allow shift+enter for new lines in textarea
      const target = e.target as HTMLTextAreaElement | HTMLInputElement;
      target.blur(); // Trigger blur to save
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, taskId: number, field: keyof Omit<CeoTask, 'id'>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    handleUpdate(taskId, field, target.value);
  };

  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
      <div
        className={`flex justify-between items-center ${!isCollapsed ? 'border-b-2 border-slate-600 pb-2 mb-4' : ''}`}
        
      >
        <div className="flex items-center gap-2 cursor-move">
            <DragHandleIcon />
            <h2 className="font-display text-2xl text-yellow-300 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
            Weekly CEO Assign List
            </h2>
        </div>
        <div className="flex items-center gap-4">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
                className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-700 transition-colors text-2xl font-bold flex-shrink-0"
                aria-label="Add new CEO task"
            >
             +
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
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
      </div>
      {!isCollapsed && (
        <>
            <div id="ceo-task-list-content" className="overflow-auto max-h-80">
            <table className="w-full text-left table-auto">
                <thead className="text-sm text-yellow-200 uppercase tracking-wider">
                <tr>
                    <th className="p-3 w-1/4">PIC</th>
                    <th className="p-3 w-1/2">Task</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Week</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map(task => {
                    const avatar = getWarriorAvatar(task.pic);
                    return (
                    <tr key={task.id} className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors">
                        <td className="p-3 align-middle">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setEditingCell({ taskId: task.id, field: 'pic' })}>
                                {editingCell?.taskId === task.id && editingCell?.field === 'pic' ? (
                                    <select
                                        defaultValue={task.pic}
                                        onBlur={(e) => handleBlur(e, task.id, 'pic')}
                                        onChange={(e) => handleBlur(e, task.id, 'pic')}
                                        onKeyDown={(e) => { if (e.key === 'Escape') setEditingCell(null); }}
                                        autoFocus
                                        className="w-full bg-slate-700 border border-slate-500 rounded-md p-1 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                    >
                                        {warriors.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                                    </select>
                                ) : (
                                    <>
                                        {avatar.startsWith('data:image') ? (
                                        <img src={avatar} alt={`${task.pic} avatar`} className="w-10 h-10 object-cover rounded-full border-2 border-slate-500" />
                                        ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500 shrink-0">
                                            <span className="text-xl" role="img" aria-label={`${task.pic} emoji`}>{avatar}</span>
                                        </div>
                                        )}
                                        <span className="font-bold">{task.pic}</span>
                                    </>
                                )}
                            </div>
                        </td>
                        <td className="p-3 align-middle text-gray-300 cursor-pointer" onClick={() => setEditingCell({ taskId: task.id, field: 'taskDescription' })}>
                             {editingCell?.taskId === task.id && editingCell?.field === 'taskDescription' ? (
                                <textarea
                                    defaultValue={task.taskDescription}
                                    onBlur={(e) => handleBlur(e, task.id, 'taskDescription')}
                                    onKeyDown={(e) => handleKeyDown(e, task.id, 'taskDescription')}
                                    autoFocus
                                    rows={2}
                                    className="w-full bg-slate-700 border border-slate-500 rounded-md p-1 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                />
                            ) : (
                                task.taskDescription
                            )}
                        </td>
                        <td className="p-3 align-middle text-center">
                            <div className="inline-block cursor-pointer" onClick={() => setEditingCell({ taskId: task.id, field: 'status' })}>
                                {editingCell?.taskId === task.id && editingCell?.field === 'status' ? (
                                    <select
                                        defaultValue={task.status}
                                        onBlur={(e) => handleBlur(e, task.id, 'status')}
                                        onChange={(e) => handleBlur(e, task.id, 'status')}
                                        onKeyDown={(e) => { if (e.key === 'Escape') setEditingCell(null); }}
                                        autoFocus
                                        className="bg-slate-700 border border-slate-500 rounded-md p-1 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                ) : (
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColorMap[task.status]}`}>
                                        {task.status}
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="p-3 align-middle text-center font-mono cursor-pointer" onClick={() => setEditingCell({ taskId: task.id, field: 'week' })}>
                            {editingCell?.taskId === task.id && editingCell?.field === 'week' ? (
                                <input
                                    type="number"
                                    defaultValue={task.week}
                                    onBlur={(e) => handleBlur(e, task.id, 'week')}
                                    onKeyDown={(e) => handleKeyDown(e, task.id, 'week')}
                                    autoFocus
                                    className="w-20 bg-slate-700 border border-slate-500 rounded-md p-1 text-white text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                />
                            ) : (
                                task.week
                            )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
             {isModalOpen && (
                <AddCeoTaskModal 
                    warriors={warriors}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={(task) => {
                        onAddTask(task);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
      )}
    </div>
  );
};

export default CeoTaskList;