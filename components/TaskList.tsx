
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onAttackTask: (taskId: number) => void;
  activeFight: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAttackTask, activeFight }) => {
  return (
    <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg mb-8">
      <h2 className="font-display text-2xl text-center border-b-2 border-slate-600 pb-2 mb-4 text-yellow-300">
        ATTACK SESSION
      </h2>
      {tasks.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onAttack={onAttackTask} 
              disabled={activeFight}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">The fields are quiet...</p>
          <p>Post a new task to hunt some monsters!</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
