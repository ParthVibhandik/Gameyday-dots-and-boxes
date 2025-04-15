
import React, { useRef, useEffect } from "react";
import { useGame } from "../contexts/GameContext";

const GameBoard: React.FC = () => {
  const { gameState, drawLine } = useGame();
  const boardRef = useRef<HTMLDivElement>(null);

  if (!gameState) return null;

  const { rows, cols } = gameState.boardSize;
  const dotSize = 12; // Size of dots in pixels
  const lineWidth = 5; // Width of lines in pixels
  const cellSize = 40; // Size of cells between dots
  const boardWidth = cols * cellSize + dotSize;
  const boardHeight = rows * cellSize + dotSize;

  // Get the player's color based on ID
  const getPlayerColor = (playerId?: number) => {
    if (playerId === undefined) return "#dddddd";
    return gameState.players.find(p => p.id === playerId)?.color || "#dddddd";
  };

  // Get the current player
  const currentPlayer = gameState.players[gameState.currentPlayerId];

  const handleLineClick = (lineId: string) => {
    if (!gameState) return;
    
    // Find the line in the game state
    const line = gameState.lines.find(l => l.id === lineId);
    
    // If line is already drawn, do nothing
    if (line && line.drawn) return;
    
    drawLine(lineId);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Current player indicator */}
      <div 
        className="mb-3 px-4 py-1 rounded-full flex items-center text-white"
        style={{ backgroundColor: currentPlayer.color }}
      >
        <div className="mr-2">
          {currentPlayer.type === "human" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="5" y="5" rx="2" />
              <path d="M15 2v3" />
              <path d="M15 19v3" />
              <path d="M22 15h-3" />
              <path d="M5 15H2" />
              <path d="M8.5 8.5 10 10" />
              <path d="M14 14l1.5 1.5" />
              <path d="M8.5 14 10 12.5" />
              <path d="M14 10l1.5-1.5" />
            </svg>
          )}
        </div>
        Turn
      </div>

      {/* Game board */}
      <div 
        ref={boardRef}
        className="relative bg-transparent rounded-lg"
        style={{ 
          width: boardWidth + 'px', 
          height: boardHeight + 'px',
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
              className="absolute rounded-full bg-white border border-red-500"
              style={{
                left: x - dotSize / 2,
                top: y - dotSize / 2,
                width: dotSize,
                height: dotSize,
                zIndex: 10
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
              className={`absolute ${!line.drawn ? "hover:bg-gray-300 cursor-pointer" : ""}`}
              style={{
                left: x + dotSize / 2,
                top: y - lineWidth / 2,
                width: cellSize - dotSize,
                height: lineWidth,
                backgroundColor: line.drawn ? getPlayerColor(line.playerId) : "transparent",
                border: line.drawn ? "none" : "1px dashed #999"
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
              className={`absolute ${!line.drawn ? "hover:bg-gray-300 cursor-pointer" : ""}`}
              style={{
                left: x - lineWidth / 2,
                top: y + dotSize / 2,
                width: lineWidth,
                height: cellSize - dotSize,
                backgroundColor: line.drawn ? getPlayerColor(line.playerId) : "transparent",
                border: line.drawn ? "none" : "1px dashed #999"
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
              className="absolute opacity-50 rounded-sm"
              style={{
                left: x + dotSize / 2,
                top: y + dotSize / 2,
                width: cellSize - dotSize,
                height: cellSize - dotSize,
                backgroundColor: playerColor,
                zIndex: 0
              }}
            />
          );
        })}
      </div>

      {/* Score display */}
      <div className="flex justify-center w-full mt-4">
        {gameState.players.map(player => (
          <div 
            key={player.id} 
            className="flex items-center px-3 py-1 mx-2 rounded-full text-white"
            style={{ backgroundColor: player.color }}
          >
            <div className="mr-2">
              {player.type === "human" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="5" y="5" rx="2" />
                  <path d="M15 2v3" />
                  <path d="M15 19v3" />
                  <path d="M22 15h-3" />
                  <path d="M5 15H2" />
                  <path d="M8.5 8.5 10 10" />
                  <path d="M14 14l1.5 1.5" />
                  <path d="M8.5 14 10 12.5" />
                  <path d="M14 10l1.5-1.5" />
                </svg>
              )}
            </div>
            <span className="font-bold">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
