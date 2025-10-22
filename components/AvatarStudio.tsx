import React, { useState } from 'react';
import { predefinedAvatars } from '../data/avatarAssets';

interface AvatarStudioProps {
    onSave: (base64String: string) => void;
}

const AvatarStudio: React.FC<AvatarStudioProps> = ({ onSave }) => {
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!selectedAvatar) return;
        setIsSaving(true);
        onSave(selectedAvatar);
        // Add a small delay to give feedback to the user
        setTimeout(() => {
           setIsSaving(false);
        }, 500);
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-lg">
            <h3 className="font-display text-xl text-yellow-200 mb-4 text-center">Choose Your Form</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {predefinedAvatars.map((avatarSrc, index) => (
                    <button 
                        key={index}
                        onClick={() => setSelectedAvatar(avatarSrc)}
                        className={`bg-slate-800 p-2 rounded-md border-4 hover:border-yellow-400 transition-colors ${selectedAvatar === avatarSrc ? 'border-yellow-400' : 'border-slate-700'}`}
                        aria-label={`Select avatar ${index + 1}`}
                    >
                        <img src={avatarSrc} alt={`Avatar option ${index + 1}`} className="w-full h-full object-cover aspect-square rounded-sm"/>
                    </button>
                ))}
            </div>
            <button
                onClick={handleSave}
                disabled={!selectedAvatar || isSaving}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed border-b-4 border-green-800 active:border-b-2 active:mt-0.5"
            >
                {isSaving ? 'Form Assumed!' : 'Set as Profile Picture'}
            </button>
        </div>
    );
};

export default AvatarStudio;