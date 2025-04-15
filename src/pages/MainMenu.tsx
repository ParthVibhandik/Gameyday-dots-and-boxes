
import React from "react";
import { useGame } from "../contexts/GameContext";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const MainMenu: React.FC = () => {
  const { setShowSettings } = useGame();
  
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
      
      {/* Settings button */}
      <button
        className="absolute top-4 right-4 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white z-20"
        onClick={() => setShowSettings(true)}
      >
        <Settings size={24} />
      </button>
      
      {/* Game Title Board */}
      <div 
        className="relative bg-amber-700 border-8 border-amber-900 rounded-lg w-80 h-72 flex flex-col items-center justify-center mb-6 shadow-xl z-10"
        style={{
          backgroundImage: "url('/lovable-uploads/2f7ed8b7-1f37-47a6-a840-1d1280abdb33.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-red-500 drop-shadow-lg mb-2">
            Tabletop
          </div>
          
          <div className="text-8xl font-extrabold text-blue-500 drop-shadow-lg tracking-wider">
            DOTS
          </div>
          
          <div className="flex items-center my-2">
            <div className="w-16 h-2 bg-gray-700 rounded-full mr-2"></div>
            <div className="text-blue-500 text-4xl font-bold">&</div>
            <div className="w-16 h-2 bg-gray-700 rounded-full ml-2"></div>
          </div>
          
          <div className="text-8xl font-extrabold text-blue-500 drop-shadow-lg tracking-wider">
            BOXES
          </div>
        </div>
      </div>
      
      {/* Main Menu Buttons */}
      <div className="z-10 w-72 flex flex-col gap-3">
        <Link to="/options" className="w-full">
          <button className="w-full py-4 bg-teal-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-teal-600 transition-colors">
            Play Game
          </button>
        </Link>
        
        <button
          onClick={() => window.close()}
          className="w-full py-4 bg-teal-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-teal-600 transition-colors"
        >
          Exit
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

export default MainMenu;
