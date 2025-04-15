
// Define game types

export type PlayerType = "human" | "computer";

export type Player = {
  id: number;
  type: PlayerType;
  color: string;
  score: number;
};

export interface GameSettings {
  playerCount: 2 | 3 | 4;
  difficulty: "easy" | "medium" | "hard" | "expert";
  boardSize: "3x2" | "5x4" | "8x6" | "11x9";
  theme: "default" | string;
  soundEffects: boolean;
  highQuality: boolean;
}

export interface Line {
  id: string;
  row: number;
  col: number;
  isHorizontal: boolean;
  drawn: boolean;
  playerId?: number;
}

export interface Box {
  id: string;
  row: number;
  col: number;
  ownerId?: number;
  completed: boolean;
}

export type BoardSize = {
  rows: number;
  cols: number;
};

export interface GameState {
  players: Player[];
  currentPlayerId: number;
  lines: Line[];
  boxes: Box[];
  boardSize: BoardSize;
  gameOver: boolean;
  winner?: Player;
}
