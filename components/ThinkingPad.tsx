import React, { useState } from 'react';
import { COLORS, COLOR_NAMES } from '../constants';

type ColorState = 'neutral' | 'in' | 'out';

const ThinkingPad: React.FC = () => {
  const [colorStates, setColorStates] = useState<Record<string, ColorState>>(() => {
    const initialState: Record<string, ColorState> = {};
    COLOR_NAMES.forEach(color => {
      initialState[color] = 'neutral';
    });
    return initialState;
  });

  const handleColorClick = (color: string) => {
    setColorStates(prevStates => {
      const currentState = prevStates[color];
      let nextState: ColorState;
      if (currentState === 'neutral') {
        nextState = 'out'; // Neutral -> Out
      } else if (currentState === 'out') {
        nextState = 'in'; // Out -> In
      } else {
        nextState = 'neutral'; // In -> Neutral
      }
      return { ...prevStates, [color]: nextState };
    });
  };

  const getPegClasses = (color: string) => {
    const state = colorStates[color];
    const baseClasses = `w-10 h-10 rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500`;
    const colorClass = COLORS[color];
    
    switch (state) {
      case 'in':
        return `${baseClasses} ${colorClass} ring-2 ring-green-500`;
      case 'out':
        return `${baseClasses} ${colorClass} opacity-30`;
      case 'neutral':
      default:
        // Using a transparent ring to prevent layout shift when ring is added/removed
        return `${baseClasses} ${colorClass} ring-2 ring-transparent`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl">
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Scratchpad</h3>
      <div className="grid grid-cols-4 gap-3 justify-items-center">
        {COLOR_NAMES.map(color => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            className={getPegClasses(color)}
            aria-label={`Mark color ${color} as ${colorStates[color]}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThinkingPad;