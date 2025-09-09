import React from 'react';
import { GameState } from '../types';
import GuessRow from './GuessRow';

interface ModalProps {
  gameState: GameState.WON | GameState.LOST;
  secretCode: string[];
  onPlayAgain: () => void;
  attempts: number;
}

const Modal: React.FC<ModalProps> = ({ gameState, secretCode, onPlayAgain, attempts }) => {
  const isWin = gameState === GameState.WON;
  const title = isWin ? 'Congratulations!' : 'Game Over';
  const message = isWin ? `You cracked the code in ${attempts} attempts!` : 'You ran out of attempts. Better luck next time!';
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

        <button
          onClick={onPlayAgain}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Modal;