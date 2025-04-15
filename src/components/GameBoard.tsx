
import React, { useRef } from "react";
import { useGame } from "../contexts/GameContext";

const GameBoard: React.FC = () => {
  const { gameState, drawLine } = useGame();
  const boardRef = useRef<HTMLDivElement>(null);

  if (!gameState) return null;

  const { rows, cols } = gameState.boardSize;
  const dotSize = 8; // Smaller dots like the reference
  const lineWidth = 4; // Thinner lines
  const cellSize = 45; // Slightly larger cells
  const boardWidth = cols * cellSize + dotSize;
  const boardHeight = rows * cellSize + dotSize;

  // Get the player's color based on ID
  const getPlayerColor = (playerId?: number) => {
    if (playerId === undefined) return "rgba(200, 200, 200, 0.3)";
    return gameState.players.find(p => p.id === playerId)?.color || "rgba(200, 200, 200, 0.3)";
  };

  // Get the current player
  const currentPlayer = gameState.players[gameState.currentPlayerId];

  const handleLineClick = (lineId: string) => {
    if (!gameState) return;
    const line = gameState.lines.find(l => l.id === lineId);
    if (line && line.drawn) return;
    drawLine(lineId);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Current player indicator */}
      <div 
        className="mb-6 px-6 py-2 rounded-full flex items-center gap-3 text-white font-medium text-lg transition-all duration-300"
        style={{ backgroundColor: currentPlayer.color }}
      >
        <div>
          {currentPlayer.type === "human" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="5" y="5" rx="2"/>
              <path d="M15 2v3"/>
              <path d="M15 19v3"/>
              <path d="M22 15h-3"/>
              <path d="M5 15H2"/>
            </svg>
          )}
        </div>
        Your Turn
      </div>

      {/* Game board */}
      <div 
        ref={boardRef}
        className="relative bg-white rounded-lg shadow-xl p-6"
        style={{ 
          width: boardWidth + 40 + 'px', 
          height: boardHeight + 40 + 'px',
        }}
      >
        {/* Render all dots */}
        {Array.from({ length: (rows + 1) * (cols + 1) }).map((_, index) => {
          const row = Math.floor(index / (cols + 1));
          const col = index % (cols + 1);
          const x = col * cellSize;
          const y = row * cellSize;
          
          return (
            <div
              key={`dot-${row}-${col}`}
              className="absolute bg-gray-600 rounded-full transition-transform duration-200 hover:scale-150"
              style={{
                left: x - dotSize / 2 + 20,
                top: y - dotSize / 2 + 20,
                width: dotSize,
                height: dotSize,
                zIndex: 20
              }}
            />
          );
        })}
        
        {/* Render horizontal lines */}
        {gameState.lines.filter(line => line.isHorizontal).map((line) => {
          const x = line.col * cellSize;
          const y = line.row * cellSize;
          
          return (
            <div
              key={line.id}
              className={`absolute ${!line.drawn ? "hover:bg-gray-300 cursor-pointer" : ""} transition-all duration-300`}
              style={{
                left: x + dotSize / 2 + 20,
                top: y - lineWidth / 2 + 20,
                width: cellSize - dotSize,
                height: lineWidth,
                backgroundColor: line.drawn ? getPlayerColor(line.playerId) : "transparent",
                border: line.drawn ? "none" : "1px dashed #ccc",
                transform: line.drawn ? "scale(1)" : "scale(0.97)",
                opacity: line.drawn ? 1 : 0.5
              }}
              onClick={() => !line.drawn && handleLineClick(line.id)}
            />
          );
        })}
        
        {/* Render vertical lines */}
        {gameState.lines.filter(line => !line.isHorizontal).map((line) => {
          const x = line.col * cellSize;
          const y = line.row * cellSize;
          
          return (
            <div
              key={line.id}
              className={`absolute ${!line.drawn ? "hover:bg-gray-300 cursor-pointer" : ""} transition-all duration-300`}
              style={{
                left: x - lineWidth / 2 + 20,
                top: y + dotSize / 2 + 20,
                width: lineWidth,
                height: cellSize - dotSize,
                backgroundColor: line.drawn ? getPlayerColor(line.playerId) : "transparent",
                border: line.drawn ? "none" : "1px dashed #ccc",
                transform: line.drawn ? "scale(1)" : "scale(0.97)",
                opacity: line.drawn ? 1 : 0.5
              }}
              onClick={() => !line.drawn && handleLineClick(line.id)}
            />
          );
        })}
        
        {/* Render boxes */}
        {gameState.boxes.map((box) => {
          const x = box.col * cellSize;
          const y = box.row * cellSize;
          const playerColor = gameState.players.find(p => p.id === box.ownerId)?.color;
          
          return box.completed && (
            <div
              key={box.id}
              className="absolute transition-all duration-500"
              style={{
                left: x + dotSize / 2 + 20,
                top: y + dotSize / 2 + 20,
                width: cellSize - dotSize,
                height: cellSize - dotSize,
                backgroundColor: playerColor,
                opacity: 0.2,
                transform: `scale(${box.completed ? 1 : 0})`,
                borderRadius: '4px'
              }}
            />
          );
        })}
      </div>

      {/* Score display */}
      <div className="flex justify-center w-full mt-6 gap-4">
        {gameState.players.map(player => (
          <div 
            key={player.id} 
            className="flex items-center px-6 py-2 rounded-full text-white transition-all duration-300"
            style={{ backgroundColor: player.color }}
          >
            <div className="mr-3">
              {player.type === "human" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="5" y="5" rx="2"/>
                  <path d="M15 2v3"/>
                  <path d="M15 19v3"/>
                  <path d="M22 15h-3"/>
                  <path d="M5 15H2"/>
                </svg>
              )}
            </div>
            <span className="font-bold text-lg">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
