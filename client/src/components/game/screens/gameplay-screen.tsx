import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { LetterKeyboard } from '@/components/game/letter-keyboard';
import { WordChainItem } from '@/components/game/word-chain-item';
import { GameState } from '@/hooks/use-game-state';

interface GameplayScreenProps {
  gameState: GameState;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  progress: number;
  error: string;
  hints: string[];
  optimalMoves?: number;
  onSubmitWord: (word: string) => Promise<boolean>;
  onGenerateHints: () => Promise<void>;
  onUndoMove: () => boolean;
  onResetGame: () => boolean;
}

export function GameplayScreen({ 
  gameState, 
  elapsedTime, 
  formatTime, 
  progress,
  error,
  hints,
  optimalMoves = 0,
  onSubmitWord,
  onGenerateHints,
  onUndoMove,
  onResetGame
}: GameplayScreenProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wordInputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the component mounts
  useEffect(() => {
    if (wordInputRef.current) {
      wordInputRef.current.focus();
    }
  }, []);

  const handleSubmitWord = async () => {
    if (currentWord && !isSubmitting) {
      setIsSubmitting(true);
      const success = await onSubmitWord(currentWord);
      if (success) {
        setCurrentWord('');
      }
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (letter: string) => {
    if (letter === 'BACKSPACE') {
      setCurrentWord(prev => prev.slice(0, -1));
    } else if (currentWord.length < gameState.startWord.length) {
      setCurrentWord(prev => prev + letter);
    }
  };

  return (
    <section className="flex-1 flex flex-col">
      {/* Game progress bar */}
      <div className="py-2 px-4 border-b" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">Moves: <span className="font-bold" style={{ color: 'var(--changed-color)' }}>{gameState.moves}</span></span>
          <span className="font-medium" style={{ color: 'var(--changed-color)' }}>Optimal: {optimalMoves}</span>
          <span className="font-medium">Time: <span style={{ opacity: 0.8 }}>{formatTime(elapsedTime)}</span></span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Game board with word chain */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-xs opacity-60">Start Word</span>
            <span className="font-mono font-bold text-lg">{gameState.startWord}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs opacity-60">Target Word</span>
            <span className="font-mono font-bold text-lg" style={{ color: 'var(--changed-color)' }}>{gameState.endWord}</span>
          </div>
        </div>
        
        <div className="p-3 rounded-lg mb-4 text-xs" style={{ backgroundColor: 'var(--legend-bg)' }}>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: 'var(--correct-letter-bg)' }}></div>
            <span>Letter matches the target word</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: 'var(--changed-letter-bg)' }}></div>
            <span>Letter changed from previous word</span>
          </div>
        </div>
        
        {/* Game controls */}
        <div className="flex justify-between mb-4">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--letter-bg)' }}
            onClick={onUndoMove}
            disabled={gameState.wordChain.length <= 1}
          >
            <i className="fas fa-undo mr-1"></i> Undo
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--letter-bg)' }}
            onClick={onResetGame}
          >
            <i className="fas fa-sync-alt mr-1"></i> Reset
          </Button>
        </div>
        
        {/* Word chain container */}
        <div className="space-y-2 mb-4">
          {gameState.wordChain.map((item, index) => (
            <WordChainItem 
              key={index}
              index={index + 1}
              word={item.word}
              isValid={item.isValid}
              changedLetterIndex={item.changedLetterIndex}
              targetWord={gameState.endWord}
              isCurrent={false}
            />
          ))}
          
          {/* Current input word - only show if there's text entered */}
          {currentWord && (
            <WordChainItem 
              index={gameState.wordChain.length + 1}
              word={currentWord.padEnd(gameState.startWord.length, ' ')}
              isValid={true}
              isCurrent={true}
              targetWord={gameState.endWord}
              onSubmit={handleSubmitWord}
            />
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 text-error-500 text-sm font-medium bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Word input area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Enter your next word:</h3>
          <div className="flex space-x-2">
            <Input 
              ref={wordInputRef}
              type="text" 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg font-mono uppercase h-auto"
              placeholder={gameState.wordChain.length > 0 ? "" : "Enter word"}
              maxLength={gameState.startWord.length}
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitWord()}
            />
            <Button 
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-5 rounded-lg shadow transition-colors h-auto"
              onClick={handleSubmitWord}
              disabled={!currentWord || isSubmitting}
            >
              <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
        
        {/* Letter selection keyboard */}
        <LetterKeyboard onKeyPress={handleKeyPress} />
      </div>
    </section>
  );
}
