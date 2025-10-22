import React, { useState } from 'react';
import { Warrior, CeoTask, CeoTaskStatus } from '../types';

interface AddCeoTaskModalProps {
  warriors: Warrior[];
  onClose: () => void;
  onAddTask: (task: Omit<CeoTask, 'id'>) => void;
}

const AddCeoTaskModal: React.FC<AddCeoTaskModalProps> = ({ warriors, onClose, onAddTask }) => {
  
  const getCurrentWeek = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const [pic, setPic] = useState<string>(warriors[0]?.name || '');
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState<CeoTaskStatus>('Pending');
  const [week, setWeek] = useState<number>(getCurrentWeek());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pic || !taskDescription.trim()) {
      alert('Please select a person and enter a task description.');
      return;
    }
    onAddTask({
      pic,
      taskDescription,
      status,
      week,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border-2 border-yellow-400 rounded-lg shadow-2xl p-6 text-white max-w-lg w-full animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-display text-2xl text-yellow-300">Add CEO Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pic-select" className="block text-lg font-bold mb-1 text-gray-300">PIC</label>
            <select
              id="pic-select"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" disabled>Select a Warrior</option>
              {warriors.map(w => (
                <option key={w.name} value={w.name}>{w.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="task-description" className="block text-lg font-bold mb-1 text-gray-300">Task Description</label>
            <textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status-select" className="block text-lg font-bold mb-1 text-gray-300">Status</label>
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as CeoTaskStatus)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="week-input" className="block text-lg font-bold mb-1 text-gray-300">Week</label>
              <input
                id="week-input"
                type="number"
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AddCeoTaskModal;
