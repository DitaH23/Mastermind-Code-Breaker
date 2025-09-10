import React from 'react';

interface GameControlsProps {
  onSubmit: () => void;
  onReset: () => void;
  isSubmitDisabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onSubmit, onReset, isSubmitDisabled }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl flex flex-col items-center">
      <div className="flex flex-col gap-4 w-40">
       <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 hover:bg-green-700 disabled:hover:bg-gray-300"
      >
        Submit Guess
      </button>
      <button
        onClick={onReset}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        New Game
      </button>
      </div>
    </div>
  );
};

export default GameControls;