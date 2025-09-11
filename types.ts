
export interface Feedback {
  black: number;
  white: number;
}

export interface Guess {
  pegs: (string | null)[];
  feedback: Feedback | null;
}

export enum GameState {
  SETTINGS = 'SETTINGS',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
}

export interface GameResult {
  id: number;
  playerName: string;
  outcome: 'WON' | 'LOST';
  attempts: number;
  time: number;
  secretCode: string[];
  date: string;
}
