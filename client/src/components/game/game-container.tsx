import { useState } from 'react';
import { useGameState } from '@/hooks/use-game-state';
import { useTimeAttackState } from '@/hooks/use-time-attack-state';
import { GameHeader } from '@/components/game/header';
import { HomeScreen } from '@/components/game/screens/home-screen';
import { SetupScreen } from '@/components/game/screens/setup-screen';
import { GameplayScreen } from '@/components/game/screens/gameplay-screen';
import { CompleteScreen } from '@/components/game/screens/complete-screen';
import { TimeAttackGameplayScreen } from '@/components/game/screens/time-attack-gameplay-screen';
import { TimeAttackCompleteScreen } from '@/components/game/screens/time-attack-complete-screen';
import { InstructionsModal } from '@/components/game/instructions-modal';
import { StatisticsModal } from '@/components/game/statistics-modal';
import { SettingsModal } from '@/components/game/settings-modal';

export function GameContainer() {
  const gameState = useGameState();
  const timeAttackState = useTimeAttackState();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="max-w-md mx-auto dark min-h-screen flex flex-col" style={{ backgroundColor: 'var(--game-bg)' }}>
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
            onStartTimeAttack={() => {
              timeAttackState.startNewTimeAttackSession();
              gameState.setScreen('timeAttackGameplay');
            }}
          />
        )}
        
        {gameState.screen === 'setup' && (
          <SetupScreen 
            onStartGame={gameState.startNewGame}
            onCancel={() => gameState.setScreen('home')}
            error={gameState.error}
            isGeneratingPuzzle={gameState.isGeneratingPuzzle}
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
            optimalMoves={gameState.optimalMoves}
            onSubmitWord={gameState.submitWord}
            onGenerateHints={gameState.generateHints}
            onUndoMove={gameState.undoLastMove}
            onResetGame={gameState.resetCurrentGame}
          />
        )}
        
        {gameState.screen === 'complete' && (
          <CompleteScreen 
            gameState={gameState.gameState}
            onPlayAgain={() => gameState.setScreen('setup')}
            onBackToHome={() => gameState.setScreen('home')}
          />
        )}

        {gameState.screen === 'timeAttackGameplay' && timeAttackState && (
          <TimeAttackGameplayScreen
            remainingTime={timeAttackState.remainingTime}
            timeAttackScore={timeAttackState.timeAttackScore}
            currentLadder={timeAttackState.currentLadder}
            isGeneratingNextLadder={timeAttackState.isGeneratingPuzzle}
            error={timeAttackState.error}
            submitWordToCurrentLadder={timeAttackState.submitWord}
            formatTime={timeAttackState.formatTime}
            setScreen={gameState.setScreen}
            isTimeAttackOver={timeAttackState.isTimeAttackOver}
            setError={timeAttackState.setError}
          />
        )}

        {gameState.screen === 'timeAttackComplete' && timeAttackState && (
          <TimeAttackCompleteScreen
            finalScore={timeAttackState.timeAttackScore}
            startNewTimeAttackSession={timeAttackState.startNewTimeAttackSession}
            setScreen={gameState.setScreen}
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
