
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
