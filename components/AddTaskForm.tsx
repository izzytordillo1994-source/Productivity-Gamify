import React, { useState, useEffect } from 'react';
import { Task, TaskDifficulty, Admin, Warrior } from '../types';
import { DIFFICULTY_MULTIPLIERS } from '../constants';
import { generateTaskDescription } from '../services/geminiService';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'assignees'>, assignees: string[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  title: string;
  currentUser: string | null;
  boss: Admin;
  execs: Admin[];
  warriors: Warrior[];
}

const UserGroupSelector: React.FC<{
    title: string;
    users: Array<{name: string, avatar: string}>;
    selectedAssignees: string[];
    onToggle: (name: string) => void;
}> = ({ title, users, selectedAssignees, onToggle }) => (
    <div className="mb-3">
        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2">{title}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {users.map(user => {
                const isSelected = selectedAssignees.includes(user.name);
                return (
                    <button
                        key={user.name}
                        type="button"
                        onClick={() => onToggle(user.name)}
                        className={`flex items-center gap-2 p-1.5 rounded-md border-2 transition-all duration-200 text-left ${
                            isSelected
                                ? 'bg-yellow-400/20 border-yellow-400 text-white'
                                : 'bg-slate-700 border-slate-600 hover:border-slate-500 text-gray-300'
                        }`}
                        aria-pressed={isSelected}
                    >
                        {user.avatar.startsWith('data:image') ? (
                            <img src={user.avatar} alt={`${user.name} avatar`} className="w-8 h-8 object-cover rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                <span className="text-lg" role="img" aria-label={`${user.name} emoji`}>{user.avatar}</span>
                            </div>
                        )}
                        <span className="text-sm font-bold truncate">{user.name}</span>
                    </button>
                )
            })}
        </div>
    </div>
);


const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isLoading, setIsLoading, title, currentUser, boss, execs, warriors }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Easy');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  useEffect(() => {
    // Reset assignees when difficulty changes from Collab to something else
    if (difficulty !== 'Collab') {
      setSelectedAssignees([]);
    }
  }, [difficulty]);

  const handleAssigneeToggle = (name: string) => {
    setSelectedAssignees(prev => 
        prev.includes(name) 
            ? prev.filter(n => n !== name) 
            : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const assignees = difficulty === 'Collab' ? selectedAssignees : (currentUser ? [currentUser] : []);
    
    if (difficulty === 'Collab' && assignees.length === 0) {
        alert('A Collab task requires at least one team member to be assigned. Please select them.');
        return;
    }
    if (assignees.length === 0) {
        console.error("No user to assign the task to.");
        return;
    }

    setIsLoading(true);
    try {
      const { description } = await generateTaskDescription(taskTitle, difficulty);
      const exp = DIFFICULTY_MULTIPLIERS[difficulty].exp;

      onAddTask({
        name: taskTitle,
        description,
        difficulty,
        exp
      }, assignees);

      setTaskTitle('');
      setDifficulty('Easy');
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
      <h2 className="font-display text-2xl text-center border-b-2 border-slate-600 pb-2 mb-4 text-yellow-300">
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`task-title-${title}`} className="block text-lg font-bold mb-1 text-gray-300">
            Task / Bounty
          </label>
          <input
            id={`task-title-${title}`}
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g., 'Finish Q3 report'"
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-bold mb-1 text-gray-300">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DIFFICULTY_MULTIPLIERS) as TaskDifficulty[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-md font-bold transition-all ${
                  difficulty === d 
                    ? 'bg-yellow-400 text-slate-900 ring-2 ring-offset-2 ring-offset-slate-800 ring-yellow-400' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {difficulty === 'Collab' && (
          <div className="pt-2">
              <label className="block text-lg font-bold mb-2 text-gray-300">Assign To (Multiple)</label>
              <div className="space-y-3 max-h-48 overflow-y-auto bg-slate-900 border border-slate-600 rounded-md p-3 custom-scrollbar">
                  <UserGroupSelector title="CEO" users={[boss]} selectedAssignees={selectedAssignees} onToggle={handleAssigneeToggle} />
                  <UserGroupSelector title="Execs" users={execs} selectedAssignees={selectedAssignees} onToggle={handleAssigneeToggle} />
                  <UserGroupSelector title="Warriors" users={warriors} selectedAssignees={selectedAssignees} onToggle={handleAssigneeToggle} />
              </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed border-b-4 border-green-800 active:border-b-2 active:mt-0.5"
        >
          {isLoading ? (
            <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Summoning Monster...
            </>
          ) : (
            'Create Monster'
          )}
        </button>
      </form>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; /* slate-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; /* slate-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; /* slate-500 */
        }
      `}</style>
    </div>
  );
};

export default AddTaskForm;