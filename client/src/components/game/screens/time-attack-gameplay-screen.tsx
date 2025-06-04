import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GameState, WordItem, GameScreen } from '@/hooks/use-game-state'; // Assuming these are here or move to shared
// import { TimeAttackStats } from '@/hooks/use-time-attack-state'; // Not directly needed for props of this screen

// Props definition for TimeAttackGameplayScreen
export type TimeAttackGameplayScreenProps = {
  remainingTime: number;
  timeAttackScore: number;
  currentLadder: GameState;
  isGeneratingNextLadder: boolean;
  error: string | null;
  submitWordToCurrentLadder: (word: string) => Promise<boolean>;
  formatTime: (seconds: number) => string;
  setScreen: (screen: GameScreen) => void;
  isTimeAttackOver: boolean;
  setError: (error: string | null) => void; // Added to clear errors
};

import clsx from 'clsx'; // Assuming clsx is available

// Simple display for word chain items - can be expanded later
const WordSliver: React.FC<{ item: WordItem, isStart: boolean, isEnd: boolean }> = ({ item, isStart, isEnd }) => {
  // Base classes
  const baseClasses = 'p-2 my-1 rounded-md text-center transition-colors duration-300 ease-in-out';

  // Conditional classes
  const itemClasses = clsx(baseClasses, {
    // Optimal step: light green background
    'bg-green-200 dark:bg-green-700 dark:bg-opacity-40 text-green-800 dark:text-green-100': item.isOptimalStep === true && !isStart && !isEnd,
    // Non-optimal step or undefined: default, slightly dimmer if not optimal
    'bg-gray-200 dark:bg-gray-700': item.isOptimalStep !== true && !isStart && !isEnd,
    // Special styling for invalid words (takes precedence)
    'bg-red-300 dark:bg-red-700 text-red-800 dark:text-red-100': !item.isValid,
    // Special styling for start and end words
    'bg-blue-200 dark:bg-blue-800 dark:bg-opacity-50 text-blue-800 dark:text-blue-100': isStart,
    'bg-green-300 dark:bg-green-800 dark:bg-opacity-60 text-green-900 dark:text-green-50': isEnd && item.isValid, // Ensure end word optimal styling if valid
  });

  return (
    <div className={itemClasses}>
      <span className="text-lg font-medium tracking-wider">
        {item.word.split('').map((char, index) => (
          <span key={index} className={clsx({'text-primary-400 dark:text-primary-300 font-bold': index === item.changedLetterIndex})}>
            {char}
          </span>
        ))}
      </span>
    </div>
  );
};


export function TimeAttackGameplayScreen({
  remainingTime,
  timeAttackScore,
  currentLadder,
  isGeneratingNextLadder,
  error,
  submitWordToCurrentLadder,
  formatTime,
  setScreen,
  isTimeAttackOver,
  setError,
}: TimeAttackGameplayScreenProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isTimeAttackOver) {
      setScreen('timeAttackComplete');
    }
  }, [isTimeAttackOver, setScreen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGeneratingNextLadder) return;
    setError(null); // Clear previous errors
    const success = await submitWordToCurrentLadder(inputValue);
    if (success) {
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear error on new input
    setInputValue(e.target.value.toUpperCase());
  };

  if (isGeneratingNextLadder || !currentLadder.startWord) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-lg">Generating next ladder...</p>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col p-4 overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold text-primary-400">
          Time: {formatTime(remainingTime)}
        </div>
        <div className="text-xl font-bold">
          Score: <span className="text-accent-400">{timeAttackScore}</span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-center">
            <div className="text-center">
                <p className="text-xs text-gray-400">START</p>
                <p className="text-2xl font-bold tracking-wider">{currentLadder.startWord}</p>
            </div>
            <div className="text-center">
                <p className="text-xs text-gray-400">TARGET</p>
                <p className="text-2xl font-bold tracking-wider">{currentLadder.endWord}</p>
            </div>
        </div>
      </div>

      <div className="flex-1 mb-4 overflow-y-auto max-h-60vh">
        {currentLadder.wordChain.map((item, index) => (
          <WordSliver
            key={index}
            item={item}
            isStart={index === 0}
            isEnd={item.word === currentLadder.endWord && index > 0}
          />
        ))}
      </div>

      {isGeneratingNextLadder && (
        <div className="text-center my-2 p-2 bg-yellow-500 text-black rounded-md">
          Generating next puzzle...
        </div>
      )}

      {error && (
        <div className="text-center my-2 p-2 bg-red-500 text-white rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-auto sticky bottom-0 py-2 bg-[var(--game-bg)]">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter next word"
            maxLength={currentLadder.startWord.length}
            className="flex-1 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
            disabled={isGeneratingNextLadder || isTimeAttackOver}
            autoFocus
          />
          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700"
            disabled={isGeneratingNextLadder || !inputValue.trim() || isTimeAttackOver}
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
}
