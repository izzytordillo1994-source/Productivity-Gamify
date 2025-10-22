import React, { useState, useEffect } from 'react';
import { Warrior, Task, Character } from '../types';
import WarriorTaskCard from './WarriorTaskCard';
import CharacterStatus from './CharacterStatus';

interface MyActivityTabsProps {
    warrior: Warrior;
    character: Character;
    tasks: Task[];
    onUpdateProfile: (warriorName: string, newTeam: string, newSkills: string[]) => void;
}

type ActiveTab = 'quest' | 'profile';

// Internal component for Profile Tab
const ProfileTab: React.FC<{ warrior: Warrior; character: Character; onUpdateProfile: MyActivityTabsProps['onUpdateProfile'] }> = ({ warrior, character, onUpdateProfile }) => {
    const [team, setTeam] = useState(warrior.team);
    const [skills, setSkills] = useState([...warrior.skills]);
    const [newSkillInput, setNewSkillInput] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

    useEffect(() => {
        setTeam(warrior.team);
        setSkills([...warrior.skills]);
    }, [warrior]);

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(currentSkills => currentSkills.filter(s => s !== skillToRemove));
    };

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSkill = newSkillInput.trim();
        if (trimmedSkill && !skills.includes(trimmedSkill)) {
            setSkills(currentSkills => [...currentSkills, trimmedSkill]);
            setNewSkillInput('');
        }
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(warrior.name, team, skills);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 flex flex-col items-center">
                 {warrior.avatar.startsWith('data:image') ? (
                    <img src={warrior.avatar} alt={`${warrior.name} avatar`} className="w-40 h-40 object-cover rounded-full border-4 border-slate-500 shadow-lg" />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-500 shadow-lg">
                      <span className="text-8xl" role="img" aria-label={`${warrior.name} emoji`}>{warrior.avatar}</span>
                    </div>
                  )}
                  <h3 className="font-display text-3xl text-yellow-200 mt-4">{warrior.name}</h3>
                  <div className="w-full mt-4">
                    <CharacterStatus character={character} />
                  </div>
            </div>
            <form onSubmit={handleProfileSave} className="md:col-span-2 space-y-6">
                <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
                    <label htmlFor="team-name" className="block text-lg font-bold text-gray-300 mb-2">Team</label>
                    <input
                        id="team-name"
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white font-mono text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
                <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
                    <h4 className="text-lg font-bold text-gray-300 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map(skill => (
                            <span key={skill} className="flex items-center bg-slate-700 text-blue-300 text-sm font-semibold pl-3 pr-2 py-1.5 rounded-full">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="ml-2 text-red-400 hover:text-red-300 font-bold"
                                    aria-label={`Remove skill ${skill}`}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2" onSubmit={handleAddSkill}>
                        <input
                            type="text"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            placeholder="Add a new skill"
                            className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
                 <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center disabled:bg-gray-500 border-b-4 border-green-800 active:border-b-2 active:mt-0.5"
                >
                    {saveStatus === 'saved' ? 'Profile Updated!' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}


const MyActivityTabs: React.FC<MyActivityTabsProps> = ({ warrior, character, tasks, onUpdateProfile }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('quest');

    const tabClasses = (tabName: ActiveTab) => 
        `py-2 px-4 font-display text-lg transition-colors duration-200 border-b-2 ${
            activeTab === tabName 
            ? 'border-yellow-400 text-yellow-300' 
            : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-white'
        }`;

    return (
        <div>
            <div className="flex border-b border-slate-700 -mx-4 px-2">
                <button className={tabClasses('quest')} onClick={() => setActiveTab('quest')}>
                    Quest Board
                </button>
                <button className={tabClasses('profile')} onClick={() => setActiveTab('profile')}>
                    Profile
                </button>
            </div>

            <div className="mt-4">
                {activeTab === 'quest' && <WarriorTaskCard warrior={warrior} tasks={tasks} />}
                {activeTab === 'profile' && <ProfileTab warrior={warrior} character={character} onUpdateProfile={onUpdateProfile} />}
            </div>
        </div>
    );
};

export default MyActivityTabs;