import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Character, Task, Warrior, Admin, CeoTask } from './types';
import { EXP_FOR_NEXT_LEVEL, DIFFICULTY_MULTIPLIERS } from './constants';
import CharacterStatus from './components/CharacterStatus';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import LevelUpModal from './components/LevelUpModal';
import WarriorDetailModal from './components/WarriorDetailModal';
import { generateLevelUpMessage } from './services/geminiService';
import LoginModal from './components/LoginModal';
import WarriorTaskCard from './components/WarriorTaskCard';
import MyActivityTabs from './components/MyActivityTabs';
import Arena from './components/Arena';
import CeoTaskList from './components/CeoTaskList';
import VictorySplash from './components/VictorySplash';
import Archive from './components/Archive';
import TeamView from './components/TeamView';
import DragHandleIcon from './components/DragHandleIcon';
import DynamicBackground from './components/DynamicBackground';

const initialWarriors: Warrior[] = [
    { name: 'Francis', avatar: '🧝‍♀️', level: 1, team: 'Ads/ Creatives', skills: ['Fireball', 'Teleport', 'Arcane Shield'] },
    { name: 'Jerlyn', avatar: '🏹', level: 1, team: 'Funnels & SEO', skills: ['Shield Bash', 'Taunt', 'Guardian Aura'] },
    { name: 'Rex', avatar: '🛡️', level: 1, team: 'DTC & Funnels', skills: ['Power Strike', 'Charge', 'Last Stand'] },
    { name: 'Jai', avatar: '⚔️', level: 1, team: 'Ads/ Creatives', skills: ['Dual Wield', 'Stealth', 'Venom Strike'] },
    { name: 'Anthony', avatar: '🧚', level: 1, team: 'DTC', skills: ['Heal', 'Fairy Dust', 'Nature\'s Grasp'] },
    { name: 'Abigail', avatar: '🕵️‍♂️', level: 1, team: 'Funnels & SEO', skills: ['Disarm Trap', 'Shadow Cloak', 'Precise Shot'] },
    { name: 'Jean', avatar: '🙏', level: 1, team: 'Content & SEO', skills: ['Soothing Melody', 'Battle Hymn', 'Dissonance'] },
    { name: 'Izzy', avatar: '🧑‍🔬', level: 1, team: 'Ads/ Creatives & Email', skills: ['Alchemical Bomb', 'Potion Mastery', 'Construct Turret'] },
    { name: 'Carl', avatar: '🥷', level: 1, team: 'Ads/ Creatives', skills: ['Shuriken Toss', 'Smoke Bomb', 'Shadow Step'] }
];

const boss: Admin = { name: 'Colin', avatar: '👑', level: 100, role: 'Owner/CEO', skills: ['Strategic Vision', 'Final Verdict', 'Resource Allocation'] };

const execs: Admin[] = [
    { name: 'Jasper', avatar: '👨‍💼', level: 30, role: 'Team Management', skills: ['Team Synergy', 'Project Scoping', 'Conflict Resolution'] },
    { name: 'Jasmin', avatar: '👩‍💼', level: 10, role: 'Operations', skills: ['Process Optimization', 'Logistics Mastery', 'System Efficiency'] },
    { name: 'Pavlo', avatar: '👨‍💼', level: 20, role: 'Finance', skills: ['Budgeting', 'Forecasting', 'Risk Assessment'] },
    { name: 'Caro', avatar: '👩‍💼', level: 25, role: 'Marketing', skills: ['Brand Strategy', 'Campaign Management', 'Market Analysis'] },
];

const allLoginableUsers = [...initialWarriors, boss, ...execs];
const adminUsers = [boss.name, ...execs.map(e => e.name)];

const initialCeoTasks: CeoTask[] = [
  { id: 1, pic: 'Francis', taskDescription: 'Finalize Q3 creative strategy.', status: 'In Progress', week: 28 },
  { id: 2, pic: 'Jerlyn', taskDescription: 'Complete SEO audit for new client.', status: 'Completed', week: 28 },
  { id: 3, pic: 'Rex', taskDescription: 'Launch the new DTC funnel for Project X.', status: 'Pending', week: 29 },
  { id: 4, pic: 'Jean', taskDescription: 'Prepare content calendar for August.', status: 'In Progress', week: 28 },
];

const initialSectionOrder = ['ceo', 'warriors', 'activity', 'archive', 'team'];

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character>({
    name: 'TOKENS',
    level: 1,
    hp: 100,
    maxHp: 100,
    exp: 0,
    expToNextLevel: EXP_FOR_NEXT_LEVEL[1],
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [ceoTasks, setCeoTasks] = useState<CeoTask[]>(initialCeoTasks);
  const [fightingTask, setFightingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ message: string; levelsGained: number } | null>(null);
  const [victoryExp, setVictoryExp] = useState<number | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  const [warriors, setWarriors] = useState(() => {
    try {
        const savedWarriorsJSON = localStorage.getItem('productivityRagnarokWarriors');
        if (savedWarriorsJSON) {
            const savedWarriors: Warrior[] = JSON.parse(savedWarriorsJSON);
            const savedAvatars: { [key: string]: string } = {};
            savedWarriors.forEach(w => {
                savedAvatars[w.name] = w.avatar;
            });
            
            const mergedWarriors = initialWarriors.map(warrior => ({
                ...warrior,
                avatar: savedAvatars[warrior.name] || warrior.avatar
            }));

            return mergedWarriors;
        }
    } catch (error) {
        console.error("Failed to load warriors from local storage", error);
    }
    return initialWarriors;
  });

  useEffect(() => {
    try {
        localStorage.setItem('productivityRagnarokWarriors', JSON.stringify(warriors));
    } catch (error) {
        console.error("Could not save warriors to localStorage", error);
    }
  }, [warriors]);

  const [selectedUser, setSelectedUser] = useState<Warrior | Admin | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [warriorsSectionCollapsed, setWarriorsSectionCollapsed] = useState(true);
  const [sectionOrder, setSectionOrder] = useState<string[]>(initialSectionOrder);

  // Refs for drag and drop
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  // Auto-load game state on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('productivityRagnarokUser');
    if (savedUser && allLoginableUsers.some(u => u.name === savedUser)) {
      setCurrentUser(savedUser);
    }
    
    try {
      const savedDataJSON = localStorage.getItem('productivityRagnarokSaveData');
      if (savedDataJSON) {
        const savedData = JSON.parse(savedDataJSON);
        if (savedData.character) setCharacter(savedData.character);
        if (savedData.tasks) setTasks(savedData.tasks);
        if (savedData.warriors) setWarriors(savedData.warriors);
        if (savedData.archivedTasks) setArchivedTasks(savedData.archivedTasks);
        if (savedData.sectionOrder) setSectionOrder(savedData.sectionOrder);
        if (savedData.ceoTasks) setCeoTasks(savedData.ceoTasks);
        setFightingTask(savedData.fightingTask || null);
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
    }
  }, []);

  // Auto-save game state with debounce
  useEffect(() => {
    if (!currentUser) return; // Don't save if no user is logged in

    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
        const gameState = {
            character,
            tasks,
            warriors,
            fightingTask,
            archivedTasks,
            sectionOrder,
            ceoTasks,
        };
        try {
            localStorage.setItem('productivityRagnarokSaveData', JSON.stringify(gameState));
        } catch (error) {
            console.error("Failed to auto-save game state:", error);
        }
    }, 1000);

    return () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };
  }, [character, tasks, warriors, fightingTask, currentUser, archivedTasks, sectionOrder, ceoTasks]);


  const handleLogin = (name: string) => {
    setCurrentUser(name);
    localStorage.setItem('productivityRagnarokUser', name);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>, warriorName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setWarriors(currentWarriors =>
        currentWarriors.map(w =>
          w.name === warriorName ? { ...w, avatar: base64String } : w
        )
      );
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  
  const handleUpdateWarriorProfile = useCallback((warriorName: string, newTeam: string, newSkills: string[]) => {
      setWarriors(currentWarriors =>
        currentWarriors.map(w =>
            w.name === warriorName ? { ...w, team: newTeam, skills: newSkills } : w
        )
      );
  }, []);

  const handleAddTask = useCallback((task: Omit<Task, 'id' | 'assignees'>, assignees: string[]) => {
    if (!assignees || assignees.length === 0) return;

    const newTask: Task = {
        ...task,
        id: Date.now() + Math.random(),
        assignees,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);
  
  const handleAddCeoTask = useCallback((task: Omit<CeoTask, 'id'>) => {
    const newTask: CeoTask = {
        ...task,
        id: Date.now() + Math.random(),
    };
    setCeoTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const handleUpdateCeoTask = useCallback((taskId: number, updates: Partial<Omit<CeoTask, 'id'>>) => {
    if (updates.status === 'Completed') {
        const taskToComplete = ceoTasks.find(task => task.id === taskId);
        if (taskToComplete) {
            const archivedVersion: Task = {
                id: taskToComplete.id + 2000000, // Use a large offset to avoid collisions
                name: taskToComplete.taskDescription,
                description: `[CEO Task] Completed from Week ${taskToComplete.week}.`,
                difficulty: 'Medium',
                exp: DIFFICULTY_MULTIPLIERS['Medium'].exp,
                assignees: [taskToComplete.pic],
                completedAt: new Date().toISOString(),
            };
            setArchivedTasks(prev => [archivedVersion, ...prev]);
            setCeoTasks(prev => prev.filter(task => task.id !== taskId));
        }
    } else {
        setCeoTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
            )
        );
    }
  }, [ceoTasks]);

  const checkForLevelUp = useCallback(async (currentXp: number, currentLevel: number) => {
    let newXp = currentXp;
    let newLevel = currentLevel;
    let levelsGained = 0;
    
    while (newXp >= EXP_FOR_NEXT_LEVEL[newLevel]) {
      newXp -= EXP_FOR_NEXT_LEVEL[newLevel];
      newLevel++;
      levelsGained++;
    }

    if (levelsGained > 0) {
      setCharacter(prev => ({
        ...prev,
        level: newLevel,
        exp: newXp,
        expToNextLevel: EXP_FOR_NEXT_LEVEL[newLevel] || EXP_FOR_NEXT_LEVEL[Object.keys(EXP_FOR_NEXT_LEVEL).length],
        maxHp: prev.maxHp + 10 * levelsGained,
        hp: prev.maxHp + 10 * levelsGained,
      }));
      
      setIsLoading(true);
      const message = await generateLevelUpMessage(newLevel);
      setLevelUpInfo({ message, levelsGained });
      setIsLoading(false);
    } else {
      setCharacter(prev => ({ ...prev, exp: newXp }));
    }
  }, []);

  const handleAttackTask = useCallback((taskId: number) => {
    const taskToAttack = tasks.find(t => t.id === taskId);
    if(taskToAttack) {
        setFightingTask(taskToAttack);
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    }
  }, [tasks]);

  const handleClaimVictory = useCallback((task: Task) => {
    if (!task) return;
    
    const completedTask = { ...task, completedAt: new Date().toISOString() };
    setArchivedTasks(prev => [completedTask, ...prev]);

    if (currentUser && !adminUsers.includes(currentUser)) {
        const newExp = character.exp + task.exp;
        checkForLevelUp(newExp, character.level);
        setVictoryExp(task.exp);
        setTimeout(() => setVictoryExp(null), 2000);
    }
    setFightingTask(null);
  }, [character, currentUser, checkForLevelUp]);
  
  useEffect(() => {
    if (tasks.length === 0 && initialWarriors.length > 0) {
      setTasks([
        {
          id: 1,
          name: 'Dustimp',
          description: 'A small creature born of neglected dust bunnies. Defeat it by tidying up your desk.',
          difficulty: 'Easy',
          exp: 15,
          assignees: [initialWarriors[0].name],
        }
      ]);
    }
  }, []);

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
    const list = document.querySelectorAll('.draggable-section');
    list.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('drag-over');
      } else {
        item.classList.remove('drag-over');
      }
    });
  };

  const handleDragEnd = () => {
    if (dragItemIndex.current !== null && dragOverItemIndex.current !== null) {
      const newSectionOrder = [...sectionOrder];
      const draggedItem = newSectionOrder.splice(dragItemIndex.current, 1)[0];
      newSectionOrder.splice(dragOverItemIndex.current, 0, draggedItem);
      setSectionOrder(newSectionOrder);
    }

    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    document.querySelectorAll('.draggable-section').forEach(item => {
      item.classList.remove('drag-over');
    });
  };

  const isCurrentUserAdmin = currentUser && adminUsers.includes(currentUser);
  const currentWarrior = isCurrentUserAdmin ? null : warriors.find(w => w.name === currentUser);
  const tasksForCurrentUser = isCurrentUserAdmin ? tasks : tasks.filter(task => currentUser && task.assignees.includes(currentUser));

  const sectionComponents: { [key: string]: React.ReactNode } = {
    ceo: (
        <CeoTaskList
            tasks={ceoTasks}
            warriors={warriors}
            onAddTask={handleAddCeoTask}
            onUpdateTask={handleUpdateCeoTask}
        />
    ),
    warriors: (
        <section>
            <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
                <div
                  className={`flex justify-between items-center cursor-pointer ${!warriorsSectionCollapsed ? 'border-b-2 border-slate-600 pb-2 mb-4' : ''}`}
                  onClick={() => setWarriorsSectionCollapsed(!warriorsSectionCollapsed)}
                  aria-expanded={!warriorsSectionCollapsed}
                  aria-controls="warriors-section-content"
                >
                    <div className="flex items-center gap-2 cursor-move">
                        <DragHandleIcon />
                        <h2 className="font-display text-2xl text-yellow-300">
                            Meet the Warriors
                        </h2>
                    </div>
                    <button
                        className="text-yellow-300 hover:text-yellow-200"
                        aria-label={warriorsSectionCollapsed ? 'Expand section' : 'Collapse section'}
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transition-transform duration-300 ${warriorsSectionCollapsed ? 'rotate-0' : 'rotate-180'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                </div>

                {!warriorsSectionCollapsed && (
                    <div id="warriors-section-content" className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-8 text-center justify-items-center pt-4">
                        {warriors.map(warrior => (
                            <div key={warrior.name} className="flex flex-col items-center">
                                <div className="relative group">
                                    <label htmlFor={`upload-${warrior.name}`} className="cursor-pointer" aria-label={`Upload avatar for ${warrior.name}`}>
                                      {warrior.avatar.startsWith('data:image') ? (
                                        <img src={warrior.avatar} alt={`${warrior.name} avatar`} className="w-24 h-24 object-cover rounded-full border-2 border-slate-500 group-hover:border-yellow-400 transition-colors" />
                                      ) : (
                                        <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500 group-hover:border-yellow-400 transition-colors">
                                          <span className="text-5xl" role="img" aria-label={`${warrior.name} emoji`}>{warrior.avatar}</span>
                                        </div>
                                      )}
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                      </div>
                                    </label>
                                    <input
                                      id={`upload-${warrior.name}`}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleAvatarChange(e, warrior.name)}
                                    />
                                </div>
                                <button
                                    onClick={() => setSelectedUser(warrior)}
                                    className="mt-3 text-md text-gray-200 font-bold hover:text-yellow-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                                    aria-label={`View details for ${warrior.name}`}
                                >
                                    {warrior.name}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    ),
    activity: (
         <section>
            <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 border-b-2 border-slate-600 pb-2 mb-4 cursor-move">
                    <DragHandleIcon />
                    <h2 className="font-display text-2xl text-yellow-300">
                        {isCurrentUserAdmin ? 'Warrior Activity' : 'My Activity'}
                    </h2>
                </div>
                 <div>
                    {currentUser && (() => {
                        if (isCurrentUserAdmin) {
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {warriors.map(warrior => {
                                        const warriorTasks = tasks.filter(task => task.assignees.includes(warrior.name));
                                        return (
                                            <WarriorTaskCard 
                                                key={warrior.name} 
                                                warrior={warrior} 
                                                tasks={warriorTasks}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        }

                        const warrior = warriors.find(w => w.name === currentUser);
                        if (!warrior) return null;
                        
                        const warriorTasks = tasks.filter(task => task.assignees.includes(warrior.name));

                        const pendingCeoTasksForWarrior = ceoTasks.filter(
                          ct => ct.pic === warrior.name && ct.status !== 'Completed'
                        );
        
                        const convertedCeoTasks: Task[] = pendingCeoTasksForWarrior.map(ct => ({
                          id: ct.id + 1000000, // Use a large offset to avoid ID collisions
                          name: ct.taskDescription,
                          description: `[CEO Task] Status: ${ct.status} | Week: ${ct.week}`,
                          difficulty: 'Medium', // Assign a default difficulty
                          exp: DIFFICULTY_MULTIPLIERS['Medium'].exp, // And corresponding EXP
                          assignees: [ct.pic],
                        }));
        
                        const allWarriorTasks = [...warriorTasks, ...convertedCeoTasks];

                        return (
                           <MyActivityTabs
                                warrior={warrior}
                                character={character}
                                tasks={allWarriorTasks}
                                onUpdateProfile={handleUpdateWarriorProfile}
                           />
                        );
                    })()}
                </div>
            </div>
        </section>
    ),
    archive: (
        <Archive archivedTasks={archivedTasks} />
    ),
    team: (
        <TeamView tasks={tasks} warriors={warriors} />
    ),
  };


  return (
    <div
      className="bg-transparent min-h-screen p-4 sm:p-8 text-white flex flex-col items-center"
    >
      <DynamicBackground />
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg w-full max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-display text-yellow-300 drop-shadow-lg">Productivity RPG</h1>
        </header>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
                <h2 className="font-display text-2xl text-center border-b-2 border-slate-600 pb-2 mb-4 text-yellow-300">
                    Meet the Boss
                </h2>
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                      <span className="text-7xl" role="img" aria-label="Boss emoji">{boss.avatar}</span>
                    </div>
                    <button
                        onClick={() => setSelectedUser(boss)}
                        className="mt-3 text-xl text-gray-200 font-bold hover:text-yellow-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                        aria-label={`View details for ${boss.name}`}
                    >
                        {boss.name}
                    </button>
                </div>
            </div>
            <div className="bg-slate-800 bg-opacity-80 p-4 border-2 border-slate-600 rounded-lg shadow-lg">
                <h2 className="font-display text-2xl text-center border-b-2 border-slate-600 pb-2 mb-4 text-yellow-300">
                    Meet the Execs
                </h2>
                <div className="grid grid-cols-4 gap-4 text-center justify-items-center">
                    {execs.map(exec => (
                        <div key={exec.name} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-500">
                                <span className="text-4xl" role="img" aria-label={`Exec ${exec.name} emoji`}>{exec.avatar}</span>
                            </div>
                             <button
                                onClick={() => setSelectedUser(exec)}
                                className="mt-2 text-md text-gray-200 font-bold hover:text-yellow-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                                aria-label={`View details for ${exec.name}`}
                            >
                                {exec.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <div className="space-y-8 mb-8">
          {sectionOrder.map((sectionKey, index) => (
            <div
              key={sectionKey}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="draggable-section"
            >
              {sectionComponents[sectionKey]}
            </div>
          ))}
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {!isCurrentUserAdmin && currentWarrior && (
            <div className="lg:col-span-1 space-y-8">
                <Arena 
                  fightingTask={fightingTask} 
                  warriorAvatar={currentWarrior.avatar}
                  currentUser={currentUser}
                  warriors={warriors}
                  onClaimVictory={handleClaimVictory}
                />
            </div>
          )}

          <div className={isCurrentUserAdmin ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <TaskList 
              tasks={tasksForCurrentUser} 
              onAttackTask={handleAttackTask} 
              activeFight={!!fightingTask}
            />
            {!isCurrentUserAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <AddTaskForm 
                        title="POST A SPRINT"
                        onAddTask={handleAddTask} 
                        isLoading={isLoading} 
                        setIsLoading={setIsLoading}
                        currentUser={currentUser}
                        boss={boss}
                        execs={execs}
                        warriors={warriors}
                    />
                    <AddTaskForm 
                        title="Post a Project"
                        onAddTask={handleAddTask} 
                        isLoading={isLoading} 
                        setIsLoading={setIsLoading}
                        currentUser={currentUser}
                        boss={boss}
                        execs={execs}
                        warriors={warriors}
                    />
                </div>
            )}
          </div>
        </main>
      </div>
      
      {levelUpInfo && (
        <LevelUpModal
          level={character.level}
          message={levelUpInfo.message}
          onClose={() => setLevelUpInfo(null)}
        />
      )}
      {selectedUser && (
        <WarriorDetailModal
            warrior={selectedUser}
            onClose={() => setSelectedUser(null)}
        />
      )}
      {!currentUser && (
        <LoginModal users={allLoginableUsers} onLogin={handleLogin} />
      )}
      {victoryExp !== null && <VictorySplash exp={victoryExp} />}
      <style>{`
        .draggable-section {
            transition: border 0.2s ease-in-out;
            border: 2px solid transparent;
            border-radius: 0.5rem; /* Match rounded-lg */
        }
        .drag-over {
            border: 2px dashed #facc15; /* yellow-400 */
        }
      `}</style>
    </div>
  );
};

export default App;