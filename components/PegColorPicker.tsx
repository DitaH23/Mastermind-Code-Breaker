import React from 'react';
import { COLORS } from '../constants';

interface PegColorPickerProps {
  onColorSelect: (color: string) => void;
  availableColors: string[];
}

const PegColorPicker: React.FC<PegColorPickerProps> = ({ onColorSelect, availableColors }) => {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-white p-2 rounded-lg shadow-lg border border-gray-200 grid grid-cols-4 gap-2 z-10"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the picker
    >
      {availableColors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${COLORS[color]}`}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};

export default PegColorPicker;