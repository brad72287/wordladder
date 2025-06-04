import React from 'react';
import { Button } from '@/components/ui/button';
import { GameScreen } from '@/hooks/use-game-state'; // Assuming GameScreen is here or move to shared

export type TimeAttackCompleteScreenProps = {
  finalScore: number;
  startNewTimeAttackSession: () => void;
  setScreen: (screen: GameScreen) => void;
};

export function TimeAttackCompleteScreen({
  finalScore,
  startNewTimeAttackSession,
  setScreen,
}: TimeAttackCompleteScreenProps) {
  const handlePlayAgain = () => {
    startNewTimeAttackSession();
    setScreen('timeAttackGameplay');
  };

  const handleBackToHome = () => {
    setScreen('home');
  };

  return (
    <section className="flex-1 flex flex-col items-center justify-center p-4 text-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-primary-400 mb-6">
          Time's Up!
        </h2>

        <div className="mb-8">
          <p className="text-xl text-gray-300">Your Final Score:</p>
          <p className="text-5xl font-extrabold text-accent-400 my-2">
            {finalScore}
          </p>
          <p className="text-sm text-gray-400">
            {finalScore > 0 ? "Great effort!" : "Better luck next time!"}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handlePlayAgain}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
          >
            Play Again
          </Button>
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
