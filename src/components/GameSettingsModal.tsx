
import React from "react";
import { useGame } from "../contexts/GameContext";
import { X } from "lucide-react";

const GameSettingsModal: React.FC = () => {
  const { settings, updateSettings, showSettings, setShowSettings } = useGame();

  return (
    showSettings && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md">
          <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-100">
              <h2 className="text-2xl font-bold text-center w-full">Settings</h2>
              <button
                className="absolute right-4 top-4 p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                onClick={() => setShowSettings(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Settings Content */}
            <div className="p-6 bg-gray-800 text-white">
              {/* Sound Effects */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-xl">Sound Effects</div>
                <div className="relative">
                  <button
                    className={`w-16 h-8 rounded-full p-1 transition-colors ${
                      settings.soundEffects ? "bg-green-500" : "bg-gray-600"
                    }`}
                    onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                  >
                    <div className="text-sm font-medium">
                      {settings.soundEffects ? "ON" : "OFF"}
                    </div>
                    <div 
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.soundEffects ? "right-1" : "left-1"
                      }`} 
                    />
                  </button>
                </div>
              </div>
              
              {/* High Quality */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-xl">High Quality</div>
                <div className="relative">
                  <button
                    className={`w-16 h-8 rounded-full p-1 transition-colors ${
                      settings.highQuality ? "bg-green-500" : "bg-gray-600"
                    }`}
                    onClick={() => updateSettings({ highQuality: !settings.highQuality })}
                  >
                    <div className="text-sm font-medium">
                      {settings.highQuality ? "ON" : "OFF"}
                    </div>
                    <div 
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        settings.highQuality ? "right-1" : "left-1"
                      }`} 
                    />
                  </button>
                </div>
              </div>
              
              {/* Return to Site (placeholder) */}
              <a 
                href="/"
                className="w-full text-xl py-3 text-left border-t border-gray-700 block hover:bg-gray-700 px-6 transition-colors"
              >
                Return to Gametable Site
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GameSettingsModal;
