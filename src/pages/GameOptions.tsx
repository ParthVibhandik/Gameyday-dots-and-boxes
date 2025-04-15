
import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";
import { Settings, ArrowLeft, ChevronLeft, ChevronRight, User, MonitorSmartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameOptions: React.FC = () => {
  const { settings, updateSettings, setShowSettings, startGame } = useGame();
  const navigate = useNavigate();
  
  // Player types (human or computer)
  const [playerTypes, setPlayerTypes] = useState<("human" | "computer")[]>(
    Array(settings.playerCount).fill("human").map((type, i) => i === 0 ? "human" : "computer")
  );
  
  const playerCounts = [2, 3, 4];
  const difficulties = ["easy", "medium", "hard", "expert"];
  const boardSizes = ["3x2", "5x4", "8x6", "11x9"];
  const themes = ["default"]; // More themes can be added later
  
  // Helper to get next or previous item from array
  const getAdjacentValue = <T extends unknown>(
    array: T[], 
    current: T, 
    direction: "next" | "prev"
  ): T => {
    const currentIndex = array.indexOf(current);
    if (currentIndex === -1) return array[0];
    
    if (direction === "next") {
      return array[(currentIndex + 1) % array.length];
    } else {
      return array[(currentIndex - 1 + array.length) % array.length];
    }
  };
  
  // Update player count and resize player types array
  const updatePlayerCount = (newCount: number) => {
    updateSettings({ playerCount: newCount as 2 | 3 | 4 });
    setPlayerTypes(prev => {
      if (newCount > prev.length) {
        // Add computer players
        return [...prev, ...Array(newCount - prev.length).fill("computer")];
      } else {
        // Remove excess players
        return prev.slice(0, newCount);
      }
    });
  };
  
  // Toggle player type (human/computer)
  const togglePlayerType = (index: number) => {
    setPlayerTypes(prev => {
      const newTypes = [...prev];
      newTypes[index] = newTypes[index] === "human" ? "computer" : "human";
      return newTypes;
    });
  };
  
  // Start game with current settings
  const handleStartGame = () => {
    startGame();
    navigate("/game");
  };

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
      
      {/* Back and Settings buttons */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
        <button
          className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={24} />
        </button>
        
        <button
          className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
          onClick={() => setShowSettings(true)}
        >
          <Settings size={24} />
        </button>
      </div>
      
      {/* Options Panel */}
      <div className="relative z-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center mb-4">OPTIONS</h2>
        
        {/* Player Count Selector */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-2">Choose Players</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updatePlayerCount(
                getAdjacentValue(playerCounts, settings.playerCount, "prev")
              )}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="px-8 py-2 mx-2 bg-white rounded-lg text-center text-xl font-medium">
              {settings.playerCount} Players
            </div>
            
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updatePlayerCount(
                getAdjacentValue(playerCounts, settings.playerCount, "next")
              )}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Player Type Selection */}
          <div className="flex justify-center mt-2">
            {playerTypes.map((type, index) => (
              <button
                key={index}
                className={`mx-1 p-2 rounded-lg ${
                  type === "human" ? "bg-red-500" : "bg-blue-500"
                } text-white`}
                onClick={() => togglePlayerType(index)}
              >
                {type === "human" ? <User size={24} /> : <MonitorSmartphone size={24} />}
              </button>
            ))}
          </div>
          <p className="text-center text-sm mt-1">Press a color to change player types.</p>
        </div>
        
        {/* Computer Difficulty */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-2">Computer Difficulty</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updateSettings({
                difficulty: getAdjacentValue(difficulties, settings.difficulty, "prev") as "easy" | "medium" | "hard" | "expert"
              })}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="px-8 py-2 mx-2 bg-white rounded-lg text-center text-xl font-medium capitalize">
              {settings.difficulty}
            </div>
            
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updateSettings({
                difficulty: getAdjacentValue(difficulties, settings.difficulty, "next") as "easy" | "medium" | "hard" | "expert"
              })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Board Size */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-2">Board Size</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updateSettings({
                boardSize: getAdjacentValue(boardSizes, settings.boardSize, "prev") as "3x2" | "5x4" | "8x6" | "11x9"
              })}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="px-8 py-2 mx-2 bg-white rounded-lg text-center text-xl font-medium capitalize">
              {settings.boardSize}
            </div>
            
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updateSettings({
                boardSize: getAdjacentValue(boardSizes, settings.boardSize, "next") as "3x2" | "5x4" | "8x6" | "11x9"
              })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Theme */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-center mb-2">Theme</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updateSettings({
                theme: getAdjacentValue(themes, settings.theme, "prev") as "default" | string
              })}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="px-8 py-2 mx-2 bg-white rounded-lg text-center text-xl font-medium capitalize">
              {settings.theme}
            </div>
            
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white"
              onClick={() => updateSettings({
                theme: getAdjacentValue(themes, settings.theme, "next") as "default" | string
              })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          className="w-full py-4 bg-teal-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-teal-600 transition-colors"
          onClick={handleStartGame}
        >
          Start
        </button>
      </div>
      
      {/* Game Board Decoration */}
      <div className="absolute bottom-4 w-80 h-20 opacity-50 z-0">
        <img 
          src="/lovable-uploads/46ba1fef-40b3-4c5c-93ff-158647cd9713.png" 
          alt="Game board decoration" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default GameOptions;
