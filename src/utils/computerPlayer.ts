import { Line, GameState } from "../types";

// Basic AI for the computer player
export const getComputerMove = (gameState: GameState, difficulty: string): string => {
  const availableLines = gameState.lines.filter(line => !line.drawn);
  
  if (availableLines.length === 0) return "";
  
  // Check if we can complete a box
  const completingMove = findCompletingMove(gameState, availableLines);
  if (completingMove && Math.random() < getDifficultyFactor(difficulty)) {
    return completingMove;
  }
  
  // Check if we should block the opponent
  const blockingMove = findBlockingMove(gameState, availableLines);
  if (blockingMove && Math.random() < getDifficultyFactor(difficulty)) {
    return blockingMove;
  }
  
  // Otherwise, make a random move with some strategic bias based on difficulty
  if (Math.random() < getDifficultyFactor(difficulty) * 0.5) {
    // Prefer moves that don't set up boxes for the opponent
    const safeMove = findSafeMove(gameState, availableLines);
    if (safeMove) return safeMove;
  }
  
  // Random move as fallback
  const randomIndex = Math.floor(Math.random() * availableLines.length);
  return availableLines[randomIndex].id;
};

// Find a move that would complete a box
const findCompletingMove = (gameState: GameState, availableLines: Line[]): string | null => {
  for (const line of availableLines) {
    // Check if this line would complete a box
    // This is a simplified version - a real implementation would check the specific boxes
    // that would be completed by this line
    
    const { rows, cols } = gameState.boardSize;
    const { row, col, isHorizontal } = line;

    if (isHorizontal) {
      if (row > 0) {
        const topLine = gameState.lines.find(l => l.isHorizontal && l.row === row - 1 && l.col === col);
        const leftLine = gameState.lines.find(l => !l.isHorizontal && l.row === row - 1 && l.col === col);
        const rightLine = gameState.lines.find(l => !l.isHorizontal && l.row === row - 1 && l.col === col + 1);

        if (topLine?.drawn && leftLine?.drawn && rightLine?.drawn) {
          return line.id;
        }
      }

      if (row < rows) {
        const bottomLine = gameState.lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col);
        const leftLine = gameState.lines.find(l => !l.isHorizontal && l.row === row && l.col === col);
        const rightLine = gameState.lines.find(l => !l.isHorizontal && l.row === row && l.col === col + 1);

        if (bottomLine?.drawn && leftLine?.drawn && rightLine?.drawn) {
          return line.id;
        }
      }
    } else {
      if (col > 0) {
        const topLine = gameState.lines.find(l => l.isHorizontal && l.row === row && l.col === col - 1);
        const bottomLine = gameState.lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col - 1);
        const leftLine = gameState.lines.find(l => !l.isHorizontal && l.row === row && l.col === col - 1);

        if (topLine?.drawn && bottomLine?.drawn && leftLine?.drawn) {
          return line.id;
        }
      }

      if (col < cols) {
        const topLine = gameState.lines.find(l => l.isHorizontal && l.row === row && l.col === col);
        const bottomLine = gameState.lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col);
        const rightLine = gameState.lines.find(l => !l.isHorizontal && l.row === row && l.col === col + 1);

        if (topLine?.drawn && bottomLine?.drawn && rightLine?.drawn) {
          return line.id;
        }
      }
    }
  }
  return null;
};

// Find a move that would block the opponent from completing a box
const findBlockingMove = (gameState: GameState, availableLines: Line[]): string | null => {
  // Similar to findCompletingMove but focused on preventing the opponent 
  // from completing a box on their next turn
  
  const { rows, cols } = gameState.boardSize;
  const { currentPlayerId, lines } = gameState;

  for (const line of availableLines) {
    const { row, col, isHorizontal } = line;

    if (isHorizontal) {
      if (row > 0) {
        const topLine = lines.find(l => l.isHorizontal && l.row === row - 1 && l.col === col);
        const leftLine = lines.find(l => !l.isHorizontal && l.row === row - 1 && l.col === col);
        const rightLine = lines.find(l => !l.isHorizontal && l.row === row - 1 && l.col === col + 1);

        let drawnCount = 0;
        if (topLine?.drawn) drawnCount++;
        if (leftLine?.drawn) drawnCount++;
        if (rightLine?.drawn) drawnCount++;

        if (drawnCount === 2) {
          return line.id;
        }
      }

      if (row < rows) {
        const bottomLine = lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col);
        const leftLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col);
        const rightLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col + 1);

        let drawnCount = 0;
        if (bottomLine?.drawn) drawnCount++;
        if (leftLine?.drawn) drawnCount++;
        if (rightLine?.drawn) drawnCount++;

        if (drawnCount === 2) {
          return line.id;
        }
      }
    } else {
      if (col > 0) {
        const topLine = lines.find(l => l.isHorizontal && l.row === row && l.col === col - 1);
        const bottomLine = lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col - 1);
        const leftLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col - 1);

        let drawnCount = 0;
        if (topLine?.drawn) drawnCount++;
        if (bottomLine?.drawn) drawnCount++;
        if (leftLine?.drawn) drawnCount++;

        if (drawnCount === 2) {
          return line.id;
        }
      }

      if (col < cols) {
        const topLine = lines.find(l => l.isHorizontal && l.row === row && l.col === col);
        const bottomLine = lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col);
        const rightLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col + 1);

        let drawnCount = 0;
        if (topLine?.drawn) drawnCount++;
        if (bottomLine?.drawn) drawnCount++;
        if (rightLine?.drawn) drawnCount++;

        if (drawnCount === 2) {
          return line.id;
        }
      }
    }
  }

  return null;
};

// Find a move that doesn't set up the opponent to complete a box
const findSafeMove = (gameState: GameState, availableLines: Line[]): string | null => {
  // Look for moves that don't leave just one side of a box open
  
  const { rows, cols } = gameState.boardSize;
  const { lines } = gameState;

  for (const line of availableLines) {
    const { row, col, isHorizontal } = line;

    let risky = false;

    if (isHorizontal) {
      if (row > 0) {
        const topLine = lines.find(l => l.isHorizontal && l.row === row - 1 && l.col === col);
        const leftLine = lines.find(l => !l.isHorizontal && l.row === row - 1 && l.col === col);
        const rightLine = lines.find(l => !l.isHorizontal && l.row === row - 1 && l.col === col + 1);

        let drawnCount = 0;
        if (topLine?.drawn) drawnCount++;
        if (leftLine?.drawn) drawnCount++;
        if (rightLine?.drawn) drawnCount++;

        if (drawnCount === 1) {
          risky = true;
        }
      }

      if (row < rows) {
        const bottomLine = lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col);
        const leftLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col);
        const rightLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col + 1);

        let drawnCount = 0;
        if (bottomLine?.drawn) drawnCount++;
        if (leftLine?.drawn) drawnCount++;
        if (rightLine?.drawn) drawnCount++;

        if (drawnCount === 1) {
          risky = true;
        }
      }
    } else {
      if (col > 0) {
        const topLine = lines.find(l => l.isHorizontal && l.row === row && l.col === col - 1);
        const bottomLine = lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col - 1);
        const leftLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col - 1);

        let drawnCount = 0;
        if (topLine?.drawn) drawnCount++;
        if (bottomLine?.drawn) drawnCount++;
        if (leftLine?.drawn) drawnCount++;

        if (drawnCount === 1) {
          risky = true;
        }
      }

      if (col < cols) {
        const topLine = lines.find(l => l.isHorizontal && l.row === row && l.col === col);
        const bottomLine = lines.find(l => l.isHorizontal && l.row === row + 1 && l.col === col);
        const rightLine = lines.find(l => !l.isHorizontal && l.row === row && l.col === col + 1);

        let drawnCount = 0;
        if (topLine?.drawn) drawnCount++;
        if (bottomLine?.drawn) drawnCount++;
        if (rightLine?.drawn) drawnCount++;

        if (drawnCount === 1) {
          risky = true;
        }
      }
    }

    if (!risky) {
      return line.id;
    }
  }

  return null;
};

// Get a factor based on difficulty that determines how likely the computer
// is to make the optimal move
const getDifficultyFactor = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy': return 0.3;
    case 'medium': return 0.6;
    case 'hard': return 0.8;
    case 'expert': return 0.95;
    default: return 0.5;
  }
};
