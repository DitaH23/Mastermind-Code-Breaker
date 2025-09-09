import React, { useState } from 'react';

interface SettingsProps {
  onStartGame: (allowRepeats: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ onStartGame }) => {
  const [allowRepeats, setAllowRepeats] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Mastermind</h1>
        <p className="text-gray-600 mb-8">Configure your game and start breaking the code.</p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <label htmlFor="allowRepeats" className="text-lg text-gray-700">Allow Repeating Colors?</label>
          <div 
            onClick={() => setAllowRepeats(!allowRepeats)}
            className={`relative inline-block w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ${allowRepeats ? 'bg-indigo-600' : 'bg-gray-300'}`}
          >
            <span 
              className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${allowRepeats ? 'transform translate-x-6' : ''}`}
            ></span>
          </div>
        </div>

        <button
          onClick={() => onStartGame(allowRepeats)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Settings;