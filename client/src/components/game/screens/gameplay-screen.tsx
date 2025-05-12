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
      <div className="py-2 px-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">Moves: <span className="font-bold text-primary-600">{gameState.moves}</span></span>
          <span className="font-medium">Time: <span className="text-gray-700">{formatTime(elapsedTime)}</span></span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Game board with word chain */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Start Word</span>
            <span className="font-mono font-bold text-lg text-gray-800">{gameState.startWord}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500">Target Word</span>
            <span className="font-mono font-bold text-lg text-primary-600">{gameState.endWord}</span>
          </div>
        </div>
        
        {/* Game controls */}
        <div className="flex justify-between mb-4">
          <Button
            size="sm"
            variant="outline"
            className="text-gray-600 text-xs"
            onClick={onUndoMove}
            disabled={gameState.wordChain.length <= 1}
          >
            <i className="fas fa-undo mr-1"></i> Undo
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="text-gray-600 text-xs"
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
        
        {/* Hints and suggestions */}
        {hints.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
            <h3 className="font-medium text-gray-700 mb-1">Hints</h3>
            <p className="text-gray-600 mb-2">Try one of these valid words:</p>
            <div className="flex flex-wrap gap-2">
              {hints.map((hint, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md font-mono h-auto"
                  onClick={() => setCurrentWord(hint)}
                >
                  {hint}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Generate hints button */}
        {hints.length === 0 && gameState.wordChain.length > 0 && (
          <Button
            className="mb-4 text-primary-600 border border-primary-600 bg-white hover:bg-primary-50 w-full"
            onClick={onGenerateHints}
          >
            <i className="fas fa-lightbulb mr-2"></i> Get Hints
          </Button>
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
