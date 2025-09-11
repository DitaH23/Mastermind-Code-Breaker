import React, { useState, useMemo } from 'react';
import { GameResult } from '../types';
import GuessRow from './GuessRow';

interface SettingsProps {
  onStartGame: (allowRepeats: boolean) => void;
  history: GameResult[];
  onClearHistory: () => void;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const HistoryDisplay: React.FC<{ history: GameResult[], onClearHistory: () => void }> = ({ history, onClearHistory }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('all');

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => b.id - a.id);
  }, [history]);

  const playerNames = useMemo(() => {
    return [...new Set(sortedHistory.map(r => r.playerName))].sort();
  }, [sortedHistory]);

  const filteredHistory = useMemo(() => {
    if (selectedPlayer === 'all') {
      return sortedHistory;
    }
    return sortedHistory.filter(r => r.playerName === selectedPlayer);
  }, [selectedPlayer, sortedHistory]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Game History</h2>
        {history.length > 0 && (
          <button onClick={onClearHistory} className="text-sm text-red-500 hover:text-red-700">Clear History</button>
        )}
      </div>

      {history.length > 0 && (
        <div className="mb-4">
          <label htmlFor="playerFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Player:</label>
          <select
            id="playerFilter"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Players</option>
            {playerNames.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {filteredHistory.length > 0 ? filteredHistory.map(result => (
          <div key={result.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${result.outcome === 'WON' ? 'filter grayscale-0' : 'filter grayscale'}`}>{result.outcome === 'WON' ? '🏆' : '💔'}</span>
                <div>
                  <p className="font-bold text-gray-800">{result.playerName}</p>
                  <p className="text-sm text-gray-500">
                    {result.outcome === 'WON' ? `Won in ${result.attempts} moves` : `Lost after ${result.attempts} moves`}
                    <span className="mx-2">·</span>
                    {formatTime(result.time)}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <GuessRow pegs={result.secretCode} />
            </div>
          </div>
        )) : (
          <p className="text-gray-500 text-center py-8">No results to display.</p>
        )}
      </div>
    </div>
  );
};


const Settings: React.FC<SettingsProps> = ({ onStartGame, history, onClearHistory }) => {
  const [allowRepeats, setAllowRepeats] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-start p-4 font-sans space-y-8 py-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Mastermind</h1>
        <p className="text-gray-600 mb-8">Configure your game and start breaking the code.</p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <label htmlFor="allowRepeats" className="text-lg text-gray-700">Allow Repeating Colors?</label>
          <div 
            onClick={() => setAllowRepeats(!allowRepeats)}
            className={`relative inline-block w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ${allowRepeats ? 'bg-indigo-600' : 'bg-gray-300'}`}
          >
            <span 
              className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${allowRepeats ? 'transform translate-x-6' : ''}`}
            ></span>
          </div>
        </div>

        <button
          onClick={() => onStartGame(allowRepeats)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Start Game
        </button>
      </div>

      <HistoryDisplay history={history} onClearHistory={onClearHistory} />
    </div>
  );
};

export default Settings;
