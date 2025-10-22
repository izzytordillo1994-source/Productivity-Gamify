export interface Character {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  exp: number;
  expToNextLevel: number;
}

export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Collab';

export interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: TaskDifficulty;
  exp: number;
  assignees: string[];
  completedAt?: string;
}

export interface Warrior {
    name: string;
    avatar: string;
    level: number;
    team: string;
    skills: string[];
}

export interface Admin {
    name: string;
    avatar: string;
    level: number;
    role: string;
    skills: string[];
}

export type CeoTaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface CeoTask {
  id: number;
  pic: string; // Name of the warrior
  taskDescription: string;
  status: CeoTaskStatus;
  week: number;
}