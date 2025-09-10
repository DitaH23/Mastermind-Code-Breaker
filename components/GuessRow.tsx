import React, { useState } from 'react';
import { COLORS, CODE_LENGTH } from '../constants';
import PegColorPicker from './PegColorPicker';

interface GuessRowProps {
  pegs: (string | null)[];
  onPegColorChange?: (index: number, color: string) => void;
  isCurrent?: boolean;
}

const Peg: React.FC<{ color: string | null; onClick?: () => void; isCurrent?: boolean; }> = ({ color, onClick, isCurrent }) => {
  const baseClasses = "w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200";
  const colorClass = color ? COLORS[color] : 'bg-gray-300';
  const borderClass = 'border-gray-400';
  const cursorClass = isCurrent ? 'cursor-pointer' : '';
  const hoverClass = isCurrent ? 'hover:border-gray-900' : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${colorClass} ${borderClass} ${cursorClass} ${hoverClass}`}
      aria-label={isCurrent ? `Select color for this peg` : `Color: ${color || 'empty'}`}
    >
       {!color && isCurrent && (
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
      )}
    </div>
  );
};

const GuessRow: React.FC<GuessRowProps> = ({ pegs, onPegColorChange, isCurrent = false }) => {
  const [pickerForPeg, setPickerForPeg] = useState<number | null>(null);
  
  const displayPegs = Array(CODE_LENGTH).fill(null).map((_, i) => pegs[i] || null);

  return (
    <div className="flex gap-2 md:gap-3">
      {displayPegs.map((color, index) => (
        <div key={index} className="relative">
          <Peg 
            color={color} 
            onClick={onPegColorChange ? () => setPickerForPeg(pickerForPeg === index ? null : index) : undefined}
            isCurrent={isCurrent}
          />
          {pickerForPeg === index && onPegColorChange && (
            <PegColorPicker onColorSelect={(selectedColor) => {
              onPegColorChange(index, selectedColor);
              setPickerForPeg(null);
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default GuessRow;