import React from 'react';
import { COLORS, COLOR_NAMES } from '../constants';

interface GameControlsProps {
  onColorSelect: (color: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitDisabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onColorSelect, onSubmit, onReset, isSubmitDisabled }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl h-full flex flex-col justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Color Palette</h3>
        <div className="grid grid-cols-4 gap-3">
          {COLOR_NAMES.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`w-10 h-10 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${COLORS[color]}`}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-40 mt-6">
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