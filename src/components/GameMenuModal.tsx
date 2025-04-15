
import React from "react";
import { useGame } from "../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const GameMenuModal: React.FC = () => {
  const { showMenu, setShowMenu, resetGame, exitToMainMenu } = useGame();
  const navigate = useNavigate();

  const handleReset = () => {
    resetGame();
    setShowMenu(false);
  };

  const handleExit = () => {
    exitToMainMenu();
    navigate("/main");
  };

  return (
    showMenu && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md">
          <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-100">
              <h2 className="text-2xl font-bold text-center w-full">Menu</h2>
              <button
                className="absolute right-4 top-4 p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                onClick={() => setShowMenu(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Menu Options */}
            <div className="bg-gray-800 text-white">
              {/* Start Game Over */}
              <button
                className="w-full text-left text-xl py-4 px-6 hover:bg-gray-700 transition-colors"
                onClick={handleReset}
              >
                Start Game Over
              </button>
              
              {/* Exit to Main Menu */}
              <button
                className="w-full text-left text-xl py-4 px-6 border-t border-gray-700 hover:bg-gray-700 transition-colors"
                onClick={handleExit}
              >
                Exit to Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GameMenuModal;
