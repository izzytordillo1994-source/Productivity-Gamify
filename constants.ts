import { TaskDifficulty } from './types';

// EXP needed to get from level X to level X+1
export const EXP_FOR_NEXT_LEVEL: { [key: number]: number } = {
  1: 100,
  2: 150,
  3: 220,
  4: 310,
  5: 450,
  6: 600,
  7: 800,
  8: 1050,
  9: 1400,
  10: 2000,
  // ... and so on
};
for(let i=11; i<=100; i++){
    EXP_FOR_NEXT_LEVEL[i] = Math.floor(EXP_FOR_NEXT_LEVEL[i-1] * 1.2);
}

export const DIFFICULTY_MULTIPLIERS: { [key in TaskDifficulty]: { exp: number } } = {
  'Easy': { exp: 15 },
  'Medium': { exp: 40 },
  'Hard': { exp: 100 },
  'Collab': { exp: 300 }
};