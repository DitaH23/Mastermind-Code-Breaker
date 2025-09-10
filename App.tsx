import React, { useState, useCallback, useMemo } from 'react';
import { GameState, Guess, Feedback } from './types';
import { CODE_LENGTH, MAX_ATTEMPTS, COLOR_NAMES } from './constants';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Modal from './components/Modal';
import Settings from './components/Settings';
import ThinkingPad from './components/ThinkingPad';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETTINGS);
  const [secretCode, setSecretCode] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<(string | null)[]>(Array(CODE_LENGTH).fill(null));
  
  const generateSecretCode = useCallback((allowRepeats: boolean) => {
    const code: string[] = [];
    const availableColors = [...COLOR_NAMES];
    for (let i = 0; i < CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      const color = availableColors[randomIndex];
      code.push(color);
      if (!allowRepeats) {
        availableColors.splice(randomIndex, 1);
      }
    }
    return code;
  }, []);

  const handleStartGame = useCallback((allowRepeats: boolean) => {
    const newSecretCode = generateSecretCode(allowRepeats);
    setSecretCode(newSecretCode);
    setGameState(GameState.PLAYING);
    setGuesses([]);
    setCurrentGuess(Array(CODE_LENGTH).fill(null));
  }, [generateSecretCode]);

  const handleResetGame = useCallback(() => {
    setGameState(GameState.SETTINGS);
  }, []);

  const calculateFeedback = useCallback((guess: string[], code: string[]): Feedback => {
    let black = 0;
    let white = 0;

    const codeColorCounts: { [color: string]: number } = {};
    for (const color of code) {
      codeColorCounts[color] = (codeColorCounts[color] || 0) + 1;
    }

    const tempGuess = [...guess];

    // First pass for black pegs (correct color and position)
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (tempGuess[i] === code[i]) {
        black++;
        const color = tempGuess[i]!;
        codeColorCounts[color]--;
        tempGuess[i] = ''; // Mark as checked
      }
    }

    // Second pass for white pegs (correct color, wrong position)
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (tempGuess[i] !== '') { // If not already counted as a black peg
        const color = tempGuess[i]!;
        if (codeColorCounts[color] > 0) {
          white++;
          codeColorCounts[color]--;
        }
      }
    }
    return { black, white };
  }, []);

  const handleSubmitGuess = useCallback(() => {
    if (currentGuess.some(peg => peg === null)) {
      alert("Please fill all slots before submitting.");
      return;
    }

    const submittedGuess = currentGuess as string[];
    const feedback = calculateFeedback(submittedGuess, secretCode);
    const newGuesses = [...guesses, { pegs: submittedGuess, feedback }];
    setGuesses(newGuesses);
    setCurrentGuess(Array(CODE_LENGTH).fill(null));

    if (feedback.black === CODE_LENGTH) {
      setGameState(GameState.WON);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameState(GameState.LOST);
    }
  }, [currentGuess, secretCode, guesses, calculateFeedback]);

  const handlePegColorChange = useCallback((pegIndex: number, color: string) => {
    if (gameState !== GameState.PLAYING) return;
    const newGuess = [...currentGuess];
    newGuess[pegIndex] = color;
    setCurrentGuess(newGuess);
  }, [currentGuess, gameState]);
  
  const attemptNumber = useMemo(() => guesses.length + 1, [guesses]);
  const isSubmitDisabled = useMemo(() => currentGuess.some(peg => peg === null) || gameState !== GameState.PLAYING, [currentGuess, gameState]);

  if (gameState === GameState.SETTINGS) {
    return <Settings onStartGame={handleStartGame} />;
  }

  return (
    <div className="h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-4 font-sans overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
        <header className="text-center mb-6 flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-gray-900">Mastermind</h1>
          <p className="text-gray-600">
            {gameState === GameState.PLAYING ? `Attempt ${attemptNumber} of ${MAX_ATTEMPTS}` : 'Game Finished'}
          </p>
        </header>

        <main className="flex flex-col md:flex-row gap-8 flex-grow min-h-0">
          {/* Left Column: Game Board */}
          <div className="flex-grow flex flex-col min-h-0">
            <div className="w-full bg-white p-4 rounded-lg shadow-2xl flex-grow overflow-y-auto">
              <GameBoard 
                guesses={guesses}
                currentGuess={currentGuess}
                activeRowIndex={guesses.length}
                onPegColorChange={handlePegColorChange}
                gameState={gameState}
              />
            </div>
          </div>
          
          {/* Right Column: Controls & Scratchpad */}
          <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-8">
            <ThinkingPad />
            <GameControls
              onSubmit={handleSubmitGuess}
              onReset={handleResetGame}
              isSubmitDisabled={isSubmitDisabled}
            />
          </div>
        </main>
      </div>

      {(gameState === GameState.WON || gameState === GameState.LOST) && (
        <Modal
          gameState={gameState}
          secretCode={secretCode}
          onPlayAgain={handleResetGame}
          attempts={guesses.length}
        />
      )}
    </div>
  );
};

export default App;