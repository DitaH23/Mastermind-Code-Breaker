import React from 'react';
import { COLORS, COLOR_NAMES } from '../constants';
import { ColorState } from '../types';

interface ThinkingPadProps {
  colorStates: Record<string, ColorState>;
  onColorStateChange: (color: string) => void;
}

const ThinkingPad: React.FC<ThinkingPadProps> = ({ colorStates, onColorStateChange }) => {
  const instructionText = "Click to cycle: Neutral → Out ❌ → In ✅";

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl">
      <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Scratchpad</h3>
      <p className="text-xs text-gray-500 text-center mb-4">{instructionText}</p>
      <div className="grid grid-cols-4 gap-3 justify-items-center">
        {COLOR_NAMES.map(color => {
          const state = colorStates[color];
          const colorClass = COLORS[color];

          // Applying opacity for the 'out' state
          const opacityClass = state === 'out' ? 'opacity-40' : '';

          return (
            <button
              key={color}
              onClick={() => onColorStateChange(color)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-opacity duration-200 ${colorClass} ${opacityClass}`}
              aria-label={`Mark color ${color} as ${state}`}
            >
              {state === 'in' && (
                <svg
                  className="w-7 h-7 text-white"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }} // Shadow for better visibility
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}

              {state === 'out' && (
                 <svg
                    className="w-6 h-6 text-white"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }} // Shadow for better visibility
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThinkingPad;