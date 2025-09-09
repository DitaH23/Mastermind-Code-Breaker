import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, Guess, Feedback } from './types';
import { CODE_LENGTH, MAX_ATTEMPTS, COLOR_NAMES } from './constants';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Modal from './components/Modal';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETTINGS);
  const [secretCode, setSecretCode] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<(string | null)[]>(Array(CODE_LENGTH).fill(null));
  const [selectedPegIndex, setSelectedPegIndex] = useState<number | null>(null);
  
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
    setSelectedPegIndex(0); // Select the first peg automatically
  }, [generateSecretCode]);

  const handleResetGame = useCallback(() => {
    setGameState(GameState.SETTINGS);
    setSelectedPegIndex(null);
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
    setSelectedPegIndex(0); // Select first peg of the new row

    if (feedback.black === CODE_LENGTH) {
      setGameState(GameState.WON);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameState(GameState.LOST);
    }
  }, [currentGuess, secretCode, guesses, calculateFeedback]);

  const handlePegClick = useCallback((index: number) => {
    if (guesses.length >= MAX_ATTEMPTS) return;
    setSelectedPegIndex(index);
  }, [guesses.length]);

  const handleColorPaletteSelect = useCallback((color: string) => {
    if (selectedPegIndex === null || gameState !== GameState.PLAYING) return;

    const newGuess = [...currentGuess];
    newGuess[selectedPegIndex] = color;
    setCurrentGuess(newGuess);

    // Advance to the next peg automatically
    if (selectedPegIndex < CODE_LENGTH - 1) {
      setSelectedPegIndex(selectedPegIndex + 1);
    } else {
      setSelectedPegIndex(null); // Deselect after filling the last peg
    }
  }, [currentGuess, selectedPegIndex, gameState]);
  
  useEffect(() => {
    // Ensure a peg is selected if the row is incomplete and no peg is currently selected
    if (gameState === GameState.PLAYING && selectedPegIndex === null && currentGuess.some(c => c === null)) {
      const firstEmpty = currentGuess.findIndex(c => c === null);
      setSelectedPegIndex(firstEmpty !== -1 ? firstEmpty : 0);
    }
  }, [currentGuess, selectedPegIndex, gameState]);

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
                selectedPegIndex={selectedPegIndex}
                onPegClick={handlePegClick}
                gameState={gameState}
              />
            </div>
          </div>
          
          {/* Right Column: Controls */}
          <div className="w-full md:w-64 flex-shrink-0">
            <GameControls
              onSubmit={handleSubmitGuess}
              onReset={handleResetGame}
              isSubmitDisabled={isSubmitDisabled}
              onColorSelect={handleColorPaletteSelect}
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