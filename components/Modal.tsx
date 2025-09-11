import React, { useState } from 'react';
import { GameState } from '../types';
import GuessRow from './GuessRow';

interface ModalProps {
  gameState: GameState.WON | GameState.LOST;
  secretCode: string[];
  onPlayAgain: () => void;
  onSaveScore: (playerName: string) => void;
  attempts: number;
  time: number;
}

const Modal: React.FC<ModalProps> = ({ gameState, secretCode, onPlayAgain, onSaveScore, attempts, time }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  
  const isWin = gameState === GameState.WON;
  const title = isWin ? 'Congratulations!' : 'Game Over';

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSave = () => {
    if (playerName.trim() === '') {
      setError('Please enter your name to save the score.');
      return;
    }
    setError('');
    onSaveScore(playerName);
  };

  const message = isWin 
    ? `You cracked the code in ${attempts} attempts and ${formatTime(time)}!` 
    : 'You ran out of attempts. Better luck next time!';
  const titleColor = isWin ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border-2 border-gray-200">
        <h2 className={`text-4xl font-bold mb-4 ${titleColor}`}>{title}</h2>
        <p className="text-gray-700 text-lg mb-6">{message}</p>
        
        <div className="mb-6">
          <p className="text-gray-500 mb-2">The secret code was:</p>
          <div className="flex justify-center">
            <GuessRow pegs={secretCode} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your name to save score"
              className={`w-full p-3 border rounded-lg text-center ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              aria-label="Player name for score saving"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Save & Play Again
          </button>
          <button
            onClick={onPlayAgain}
            className="w-full text-sm text-gray-600 hover:text-indigo-600 py-2"
          >
            Play Again without Saving
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
