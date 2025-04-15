
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext";
import GameBoard from "../components/GameBoard";
import { Settings, List } from "lucide-react";

const GameScreen: React.FC = () => {
  const { gameState, setShowSettings, setShowMenu } = useGame();
  const navigate = useNavigate();

  // Redirect to options if no game state exists
  useEffect(() => {
    if (!gameState) {
      navigate("/options");
    }
  }, [gameState, navigate]);

  if (!gameState) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background with wooden texture */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/assets/wooden-background.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} 
      />
      
      {/* Menu and Settings buttons */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
        <button
          className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
          onClick={() => setShowMenu(true)}
        >
          <List size={24} />
        </button>
        
        <button
          className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={24} />
        </button>
      </div>
      
      {/* Game Content */}
      <div className="relative z-10 w-full max-w-lg">
        <GameBoard />
      </div>
    </div>
  );
};

export default GameScreen;
