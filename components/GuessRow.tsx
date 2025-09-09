import React from 'react';
import { COLORS, CODE_LENGTH } from '../constants';

interface GuessRowProps {
  pegs: (string | null)[];
  onPegClick?: (index: number) => void;
  isCurrent?: boolean;
  selectedPegIndex?: number | null;
}

const Peg: React.FC<{ color: string | null; onClick?: () => void; isCurrent?: boolean; isSelected?: boolean; }> = ({ color, onClick, isCurrent, isSelected }) => {
  const baseClasses = "w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200";
  const colorClass = color ? COLORS[color] : 'bg-gray-300';
  const borderClass = 'border-gray-400';
  const cursorClass = isCurrent ? 'cursor-pointer' : '';
  const hoverClass = isCurrent ? 'hover:border-gray-900' : '';
  const selectedClass = isSelected ? 'ring-4 ring-offset-2 ring-indigo-500 border-indigo-500' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${colorClass} ${borderClass} ${cursorClass} ${hoverClass} ${selectedClass}`}
      aria-label={isCurrent ? `Select color for this peg` : `Color: ${color || 'empty'}`}
    >
      {!color && isCurrent && !isSelected && (
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
      )}
    </div>
  );
};

const GuessRow: React.FC<GuessRowProps> = ({ pegs, onPegClick, isCurrent = false, selectedPegIndex }) => {
  const displayPegs = Array(CODE_LENGTH).fill(null).map((_, i) => pegs[i] || null);

  return (
    <div className="flex gap-2 md:gap-3">
      {displayPegs.map((color, index) => (
        <div key={index}>
          <Peg 
            color={color} 
            onClick={onPegClick ? () => onPegClick(index) : undefined}
            isCurrent={isCurrent}
            isSelected={isCurrent && selectedPegIndex === index}
          />
        </div>
      ))}
    </div>
  );
};

export default GuessRow;