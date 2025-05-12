import { useState } from 'react';
import { useGameState } from '@/hooks/use-game-state';
import { GameHeader } from '@/components/game/header';
import { HomeScreen } from '@/components/game/screens/home-screen';
import { SetupScreen } from '@/components/game/screens/setup-screen';
import { GameplayScreen } from '@/components/game/screens/gameplay-screen';
import { CompleteScreen } from '@/components/game/screens/complete-screen';
import { InstructionsModal } from '@/components/game/instructions-modal';
import { StatisticsModal } from '@/components/game/statistics-modal';
import { SettingsModal } from '@/components/game/settings-modal';

export function GameContainer() {
  const gameState = useGameState();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <GameHeader 
        onHelpClick={() => setShowInstructions(true)} 
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {gameState.screen === 'home' && (
          <HomeScreen 
            onNewGame={() => gameState.setScreen('setup')}
            onContinueGame={gameState.continueGame}
            hasSavedGame={gameState.hasSavedGame}
          />
        )}
        
        {gameState.screen === 'setup' && (
          <SetupScreen 
            onStartGame={gameState.startNewGame}
            onCancel={() => gameState.setScreen('home')}
            error={gameState.error}
          />
        )}
        
        {gameState.screen === 'gameplay' && (
          <GameplayScreen 
            gameState={gameState.gameState}
            elapsedTime={gameState.elapsedTime}
            formatTime={gameState.formatTime}
            progress={gameState.progress}
            error={gameState.error}
            hints={gameState.hints}
            onSubmitWord={gameState.submitWord}
            onGenerateHints={gameState.generateHints}
          />
        )}
        
        {gameState.screen === 'complete' && (
          <CompleteScreen 
            gameState={gameState.gameState}
            onPlayAgain={() => gameState.setScreen('setup')}
            onBackToHome={() => gameState.setScreen('home')}
          />
        )}
      </main>

      <InstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      
      <StatisticsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={gameState.stats}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={gameState.settings}
        onUpdateSettings={gameState.updateSettings}
      />
    </div>
  );
}
