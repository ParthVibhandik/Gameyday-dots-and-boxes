import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";
import { Settings, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User, Computer } from "lucide-react";

const GameOptions: React.FC = () => {
  const { settings, updateSettings, setShowSettings, startGame, playerTypes, setPlayerTypes } = useGame();
  const navigate = useNavigate();
  
  const playerCounts = [2, 3, 4];
  const difficulties = ["easy", "medium", "hard", "expert"];
  const boardSizes = ["3x2", "5x4", "8x6", "11x9"];
  const themes = ["classic", "modern", "retro"];
  
  const localPlayerTypes = playerTypes.slice();

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

  const updatePlayerCount = (newCount: number) => {
    updateSettings({ playerCount: newCount as 2 | 3 | 4 });
    setPlayerTypes(prev => {
      if (newCount > prev.length) {
        return [...prev, ...Array(newCount - prev.length).fill("computer")];
      } else {
        return prev.slice(0, newCount);
      }
    });
  };

  const togglePlayerType = (index: number) => {
    setPlayerTypes(prev => {
      const newTypes = [...prev];
      newTypes[index] = newTypes[index] === "human" ? "computer" : "human";
      if (!newTypes.includes("human")) newTypes[0] = "human";
      return newTypes;
    });
  };

  const handleStartGame = () => {
    startGame(playerTypes);
    navigate("/game");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/assets/wooden-background.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} 
      />
      
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
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        <h2 className="text-4xl font-bold text-center mb-4">OPTIONS</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-2">Choose Players</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
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
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
              onClick={() => updatePlayerCount(
                getAdjacentValue(playerCounts, settings.playerCount, "next")
              )}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {playerTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => togglePlayerType(index)}
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                  ${type === "human" ? "bg-[#ea384c] hover:bg-[#ee263a]" : "bg-[#3b82f6] hover:bg-[#2563eb]"}
                `}
                style={{
                  boxShadow: '0 2px 6px 0 rgba(60,60,80,0.08)',
                  border: 'none'
                }}
                title={`Click to change Player ${index + 1} type`}
              >
                {type === "human" ? (
                  <User className="text-white" size={28} />
                ) : (
                  <Computer className="text-white" size={28} />
                )}
              </button>
            ))}
          </div>
          <p className="text-center text-sm mt-2 text-gray-600">Tap an icon to change player type</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-2">Computer Difficulty</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
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
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
              onClick={() => updateSettings({
                difficulty: getAdjacentValue(difficulties, settings.difficulty, "next") as "easy" | "medium" | "hard" | "expert"
              })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-2">Board Size</h3>
          <div className="flex items-center justify-center">
            <button 
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
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
              className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors"
              onClick={() => updateSettings({
                boardSize: getAdjacentValue(boardSizes, settings.boardSize, "next") as "3x2" | "5x4" | "8x6" | "11x9"
              })}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-center mb-2">Theme</h3>
          <div className="flex items-center justify-center gap-4">
            <button 
              className="w-12 h-12 bg-[#00e5ff] rounded-lg flex items-center justify-center text-white hover:bg-[#00c8e6] transition-colors"
              onClick={() => updateSettings({
                theme: getAdjacentValue(themes, settings.theme, "prev") as string
              })}
            >
              <ChevronLeft size={32} />
            </button>
            
            <div className="px-12 py-3 bg-white rounded-lg text-center text-2xl font-medium min-w-[200px] shadow-md">
              {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
            </div>
            
            <button 
              className="w-12 h-12 bg-[#00e5ff] rounded-lg flex items-center justify-center text-white hover:bg-[#00c8e6] transition-colors"
              onClick={() => updateSettings({
                theme: getAdjacentValue(themes, settings.theme, "next") as string
              })}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
        
        <button
          className="w-full py-4 bg-[#00e5b0] text-white text-2xl font-bold rounded-full shadow-lg hover:bg-[#00c89e] transition-colors transform hover:scale-105 duration-200"
          onClick={handleStartGame}
        >
          Start
        </button>
      </div>
      
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
