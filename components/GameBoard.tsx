import React from 'react';
import { Guess, GameState } from '../types';
import GuessRow from './GuessRow';
import FeedbackPegs from './FeedbackPegs';
import { MAX_ATTEMPTS } from '../constants';

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: (string | null)[];
  activeRowIndex: number;
  selectedPegIndex: number | null;
  onPegClick: (pegIndex: number) => void;
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  guesses, 
  currentGuess, 
  activeRowIndex, 
  selectedPegIndex, 
  onPegClick, 
  gameState
}) => {
  
  const allRows = Array(MAX_ATTEMPTS).fill(null).map((_, rowIndex) => {
    const attemptNumber = rowIndex + 1;
    const isRowActive = rowIndex === activeRowIndex && gameState === GameState.PLAYING;

    if (rowIndex < activeRowIndex) {
      // Past guess
      const guess = guesses[rowIndex];
      return (
        <div key={rowIndex} className="flex items-center justify-between gap-4 bg-gray-200 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500 w-6 text-center">{attemptNumber}</span>
            <GuessRow pegs={guess.pegs} />
          </div>
          {guess.feedback && <FeedbackPegs feedback={guess.feedback} />}
        </div>
      );
    }
    
    // Current active guess row OR future empty row
    const rowPegs = isRowActive ? currentGuess : [];
    const rowClasses = isRowActive
      ? "bg-indigo-100 border-2 border-indigo-300"
      : "bg-gray-100";
    const numberClasses = isRowActive ? "text-indigo-500" : "text-gray-400";
    
    return (
      <div key={rowIndex} className={`flex items-center justify-between gap-4 p-2 rounded-md transition-colors duration-300 ${rowClasses}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold w-6 text-center ${numberClasses}`}>{attemptNumber}</span>
          <GuessRow
            pegs={rowPegs}
            isCurrent={isRowActive}
            selectedPegIndex={isRowActive ? selectedPegIndex : null}
            onPegClick={isRowActive ? onPegClick : undefined}
          />
        </div>
        {/* Placeholder for feedback alignment */}
        <div className="w-12 h-12 flex-shrink-0"></div>
      </div>
    );
  });

  return (
    <div className="space-y-3">
      {allRows}
    </div>
  );
};

export default GameBoard;