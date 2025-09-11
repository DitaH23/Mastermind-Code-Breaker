import React, { useMemo } from 'react';
import { GameResult } from '../types';

interface GameStatsProps {
  history: GameResult[];
}

const formatTime = (totalSeconds: number) => {
    if (totalSeconds === -1 || isNaN(totalSeconds)) {
        return 'N/A';
    }
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-100 p-4 rounded-lg text-center transform transition-transform hover:scale-105">
        <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
);

const GameStats: React.FC<GameStatsProps> = ({ history }) => {
  const stats = useMemo(() => {
    const totalGamesPlayed = history.length;
    const wins = history.filter(r => r.outcome === 'WON');
    const totalGamesWon = wins.length;
    
    const winPercentage = totalGamesPlayed > 0 ? (totalGamesWon / totalGamesPlayed) * 100 : 0;
    
    const averageAttempts = wins.length > 0 ? wins.reduce((sum, r) => sum + r.attempts, 0) / wins.length : 0;

    const bestTime = wins.length > 0 ? Math.min(...wins.map(r => r.time)) : -1;

    return {
      totalGamesPlayed,
      totalGamesWon,
      winPercentage,
      averageAttempts,
      bestTime
    };
  }, [history]);

  if (history.length === 0) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full text-center">
             <h2 className="text-3xl font-bold text-gray-800 mb-4">Overall Statistics</h2>
             <p className="text-gray-500 py-4">Play a game to see your stats!</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Overall Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Games Played" value={stats.totalGamesPlayed} />
        <StatCard label="Games Won" value={stats.totalGamesWon} />
        <StatCard label="Win Rate" value={`${stats.winPercentage.toFixed(1)}%`} />
        <StatCard label="Avg. Attempts" value={stats.averageAttempts > 0 ? stats.averageAttempts.toFixed(1) : 'N/A'} />
        <StatCard label="Best Time" value={formatTime(stats.bestTime)} />
      </div>
    </div>
  );
};

export default GameStats;
