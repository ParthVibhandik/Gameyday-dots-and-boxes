import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { GameSettings, GameState, Line, Box, Player, BoardSize, PlayerType } from "../types";
import { getComputerMove } from "../utils/computerPlayer";

// Default game settings
const defaultSettings: GameSettings = {
  playerCount: 2,
  difficulty: "medium",
  boardSize: "5x4",
  theme: "default",
  soundEffects: true,
  highQuality: true,
};

// Parse board size from string format "5x4" to {rows: 5, cols: 4}
const parseBoardSize = (size: string): BoardSize => {
  const [rows, cols] = size.split("x").map(Number);
  return { rows, cols };
};

// Initialize game board with dots and lines
const initializeBoard = (boardSizeStr: string): { lines: Line[]; boxes: Box[] } => {
  const { rows, cols } = parseBoardSize(boardSizeStr);
  
  const lines: Line[] = [];
  const boxes: Box[] = [];

  // Create horizontal lines
  for (let r = 0; r < rows + 1; r++) {
    for (let c = 0; c < cols; c++) {
      lines.push({
        id: `h-${r}-${c}`,
        row: r,
        col: c,
        isHorizontal: true,
        drawn: false,
      });
    }
  }

  // Create vertical lines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols + 1; c++) {
      lines.push({
        id: `v-${r}-${c}`,
        row: r,
        col: c,
        isHorizontal: false,
        drawn: false,
      });
    }
  }

  // Create boxes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      boxes.push({
        id: `b-${r}-${c}`,
        row: r,
        col: c,
        completed: false,
      });
    }
  }

  return { lines, boxes };
};

// Create players based on player count
const createPlayers = (count: number, types?: PlayerType[]): Player[] => {
  const colors = ["#f87171", "#3b82f6", "#10b981", "#f59e0b"];
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    type: types?.[i] || (i === 0 ? "human" : "computer"),
    color: colors[i % colors.length],
    score: 0,
  }));
};

interface GameContextType {
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  gameState: GameState | null;
  startGame: (types?: PlayerType[]) => void;
  drawLine: (lineId: string) => void;
  resetGame: () => void;
  exitToMainMenu: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  inGame: boolean;
  playerTypes: PlayerType[];
  setPlayerTypes: (types: PlayerType[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [inGame, setInGame] = useState(false);

  // Save playerTypes in context for options selection
  const [playerTypes, setPlayerTypes] = useState<PlayerType[]>(
    Array(defaultSettings.playerCount)
      .fill("human")
      .map((t, i) => (i === 0 ? "human" : "computer"))
  );

  // Will be set to true in drawLine if computer needs to move next
  const aiMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current);
      }
    };
  }, []);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Main start game function to accept playerTypes
  const startGame = (types?: PlayerType[]) => {
    const { lines, boxes } = initializeBoard(settings.boardSize);
    const players = createPlayers(settings.playerCount, types || playerTypes);
    setGameState({
      players,
      currentPlayerId: 0,
      lines,
      boxes,
      boardSize: parseBoardSize(settings.boardSize),
      gameOver: false,
    });
    setInGame(true);
  };

  const checkBoxCompletion = (
    lineId: string, 
    lines: Line[], 
    boxes: Box[], 
    playerId: number
  ): { updatedBoxes: Box[], boxCompleted: boolean } => {
    const updatedBoxes = [...boxes];
    const line = lines.find((l) => l.id === lineId);
    if (!line) return { updatedBoxes, boxCompleted: false };
    let boxCompleted = false;
    if (line.isHorizontal) {
      if (line.row > 0) {
        const boxAbove = updatedBoxes.find(
          (b) => b.row === line.row - 1 && b.col === line.col
        );
        if (boxAbove && !boxAbove.completed) {
          const topLine = lines.find(
            (l) => l.isHorizontal && l.row === line.row - 1 && l.col === line.col
          );
          const leftLine = lines.find(
            (l) => !l.isHorizontal && l.row === line.row - 1 && l.col === line.col
          );
          const rightLine = lines.find(
            (l) => !l.isHorizontal && l.row === line.row - 1 && l.col === line.col + 1
          );
          if (
            topLine?.drawn &&
            leftLine?.drawn &&
            rightLine?.drawn
          ) {
            boxAbove.completed = true;
            boxAbove.ownerId = playerId;
            boxCompleted = true;
          }
        }
      }
      const boxBelow = updatedBoxes.find(
        (b) => b.row === line.row && b.col === line.col
      );
      if (boxBelow && !boxBelow.completed) {
        const bottomLine = lines.find(
          (l) => l.isHorizontal && l.row === line.row + 1 && l.col === line.col
        );
        const leftLine = lines.find(
          (l) => !l.isHorizontal && l.row === line.row && l.col === line.col
        );
        const rightLine = lines.find(
          (l) => !l.isHorizontal && l.row === line.row && l.col === line.col + 1
        );
        if (
          bottomLine?.drawn &&
          leftLine?.drawn &&
          rightLine?.drawn
        ) {
          boxBelow.completed = true;
          boxBelow.ownerId = playerId;
          boxCompleted = true;
        }
      }
    } else {
      if (line.col > 0) {
        const boxLeft = updatedBoxes.find(
          (b) => b.row === line.row && b.col === line.col - 1
        );
        if (boxLeft && !boxLeft.completed) {
          const topLine = lines.find(
            (l) => l.isHorizontal && l.row === line.row && l.col === line.col - 1
          );
          const bottomLine = lines.find(
            (l) => l.isHorizontal && l.row === line.row + 1 && l.col === line.col - 1
          );
          const leftLine = lines.find(
            (l) => !l.isHorizontal && l.row === line.row && l.col === line.col - 1
          );
          if (
            topLine?.drawn &&
            bottomLine?.drawn &&
            leftLine?.drawn
          ) {
            boxLeft.completed = true;
            boxLeft.ownerId = playerId;
            boxCompleted = true;
          }
        }
      }
      const boxRight = updatedBoxes.find(
        (b) => b.row === line.row && b.col === line.col
      );
      if (boxRight && !boxRight.completed) {
        const topLine = lines.find(
          (l) => l.isHorizontal && l.row === line.row && l.col === line.col
        );
        const bottomLine = lines.find(
          (l) => l.isHorizontal && l.row === line.row + 1 && l.col === line.col
        );
        const rightLine = lines.find(
          (l) => !l.isHorizontal && l.row === line.row && l.col === line.col + 1
        );
        if (
          topLine?.drawn &&
          bottomLine?.drawn &&
          rightLine?.drawn
        ) {
          boxRight.completed = true;
          boxRight.ownerId = playerId;
          boxCompleted = true;
        }
      }
    }
    return { updatedBoxes, boxCompleted };
  };

  // Helper called after every move to maybe trigger AI move(s)
  useEffect(() => {
    if (!gameState || gameState.gameOver) return;

    const currentPlayer = gameState.players[gameState.currentPlayerId];
    if (currentPlayer.type === "computer") {
      // Delay for realism
      aiMoveTimeoutRef.current = setTimeout(() => {
        const move = getComputerMove(gameState, settings.difficulty);
        if (move) {
          drawLine(move, true); // Pass a flag so it doesn't recurse
        }
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]); // re-run after every change

  /**
   * Draw a line, and after state is updated, if next player is computer,
   * the useEffect above auto-triggers their move.
   */
  const drawLine = (lineId: string, skipAI?: boolean) => {
    if (!gameState || gameState.gameOver) return;
    const currentPlayerId = gameState.currentPlayerId;
    const updatedLines = gameState.lines.map((line) =>
      line.id === lineId ? { ...line, drawn: true, playerId: currentPlayerId } : line
    );
    const result = checkBoxCompletion(
      lineId, 
      updatedLines, 
      gameState.boxes,
      currentPlayerId
    );
    // Update player scores
    const updatedPlayers = gameState.players.map((player) => {
      if (player.id === currentPlayerId) {
        const score = result.updatedBoxes.filter((b) => b.ownerId === player.id).length;
        return { ...player, score };
      }
      return player;
    });
    // Check if game is over
    const allBoxesCompleted = result.updatedBoxes.every((box) => box.completed);
    let winner;
    if (allBoxesCompleted) {
      winner = [...updatedPlayers].sort((a, b) => b.score - a.score)[0];
    }
    // Determine next player (current player gets another turn if they completed a box)
    const nextPlayerId = result.boxCompleted 
      ? currentPlayerId 
      : (currentPlayerId + 1) % gameState.players.length;

    setGameState({
      ...gameState,
      lines: updatedLines,
      boxes: result.updatedBoxes,
      players: updatedPlayers,
      currentPlayerId: nextPlayerId,
      gameOver: allBoxesCompleted,
      winner: winner,
    });
  };

  const resetGame = () => {
    startGame(playerTypes);
    setShowMenu(false);
  };

  const exitToMainMenu = () => {
    setGameState(null);
    setInGame(false);
    setShowMenu(false);
  };

  return (
    <GameContext.Provider
      value={{
        settings,
        updateSettings,
        gameState,
        startGame,
        drawLine,
        resetGame,
        exitToMainMenu,
        showSettings,
        setShowSettings,
        showMenu,
        setShowMenu,
        inGame,
        playerTypes,
        setPlayerTypes,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
