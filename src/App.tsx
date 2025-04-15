
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import Index from "./pages/Index";
import MainMenu from "./pages/MainMenu";
import GameOptions from "./pages/GameOptions";
import GameScreen from "./pages/GameScreen";
import NotFound from "./pages/NotFound";
import GameSettingsModal from "./components/GameSettingsModal";
import GameMenuModal from "./components/GameMenuModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/main" element={<MainMenu />} />
            <Route path="/options" element={<GameOptions />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Game Modals */}
          <GameSettingsModal />
          <GameMenuModal />
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
