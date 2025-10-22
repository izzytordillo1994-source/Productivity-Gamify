
import React, { useState } from 'react';

interface LoginModalProps {
  users: Array<{ name: string }>;
  onLogin: (name: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ users, onLogin }) => {
  const [selectedName, setSelectedName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedName) {
      onLogin(selectedName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-2 border-yellow-400 rounded-lg shadow-2xl p-8 text-center text-white max-w-md w-full animate-fade-in-up">
        <h2 className="font-display text-3xl text-yellow-300 mb-6">
          Before you enter the gates, say your name.
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="user-select" className="sr-only">Select your name</label>
            <select
              id="user-select"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" disabled>-- Select Your Name --</option>
              {users.map(user => (
                <option key={user.name} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedName}
            className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-200 border-b-4 border-blue-800 active:border-b-2 active:mt-0.5 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:border-b-4 disabled:border-gray-700"
          >
            Enter the Gates
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
