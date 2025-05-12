import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DifficultyLevel } from '@/hooks/use-game-state';
import { Separator } from '@/components/ui/separator';

interface SetupScreenProps {
  onStartGame: (startWord: string, endWord: string, difficulty: DifficultyLevel) => Promise<boolean>;
  onCancel: () => void;
  error: string;
  isGeneratingPuzzle?: boolean;
}

export function SetupScreen({ onStartGame, onCancel, error, isGeneratingPuzzle = false }: SetupScreenProps) {
  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [useManualInput, setUseManualInput] = useState(false);

  const handleStartGame = async () => {
    if (useManualInput) {
      await onStartGame(startWord, endWord, difficulty);
    } else {
      // Pass empty strings to trigger random word generation
      await onStartGame('', '', difficulty);
    }
  };

  return (
    <section className="flex-1 flex flex-col p-4">
      <div className="flex-1 flex flex-col py-6 space-y-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">New Game</h2>
        
        <div className="space-y-4">
          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-2">Difficulty</p>
            <div className="flex space-x-2">
              <Button 
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg ${difficulty === 'easy' 
                  ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
                onClick={() => setDifficulty('easy')}
              >
                Easy
              </Button>
              <Button 
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg ${difficulty === 'medium' 
                  ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
                onClick={() => setDifficulty('medium')}
              >
                Medium
              </Button>
              <Button 
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg ${difficulty === 'hard' 
                  ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
                onClick={() => setDifficulty('hard')}
              >
                Hard
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {difficulty === 'easy' ? '3-letter words' : 
               difficulty === 'medium' ? '4-letter words' : 
               '5-letter words'}
            </p>
          </div>
          
          <div className="flex items-center mt-4">
            <Button
              type="button"
              variant="outline"
              className={`flex-1 py-2 rounded-lg ${!useManualInput 
                ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
              onClick={() => setUseManualInput(false)}
            >
              <i className="fas fa-random mr-2"></i> Random Words
            </Button>
            <span className="mx-2 text-gray-500">or</span>
            <Button
              type="button"
              variant="outline"
              className={`flex-1 py-2 rounded-lg ${useManualInput 
                ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
              onClick={() => setUseManualInput(true)}
            >
              <i className="fas fa-pencil-alt mr-2"></i> Custom Words
            </Button>
          </div>
        </div>
        
        {useManualInput && (
          <div className="space-y-6 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <Label htmlFor="startWord" className="text-sm font-medium text-gray-700">Start Word</Label>
              <Input 
                type="text" 
                id="startWord" 
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg font-mono uppercase h-auto"
                placeholder="COLD"
                maxLength={difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5}
                value={startWord}
                onChange={(e) => setStartWord(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-gray-500">Enter a {difficulty === 'easy' ? '3' : difficulty === 'medium' ? '4' : '5'}-letter word to start with</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endWord" className="text-sm font-medium text-gray-700">Target Word</Label>
              <Input 
                type="text" 
                id="endWord" 
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg font-mono uppercase h-auto"
                placeholder="WARM"
                maxLength={difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5}
                value={endWord}
                onChange={(e) => setEndWord(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-gray-500">Enter a word with the same length as your start word</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-error-500 text-sm font-medium bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="pt-4 space-y-3">
          <Button 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
            onClick={handleStartGame}
            disabled={isGeneratingPuzzle || (useManualInput && (!startWord || !endWord))}
          >
            {isGeneratingPuzzle ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Generating Puzzle...
              </>
            ) : (
              'Start Game'
            )}
          </Button>
          <Button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors h-auto"
            onClick={onCancel}
            disabled={isGeneratingPuzzle}
          >
            Cancel
          </Button>
        </div>
      </div>
    </section>
  );
}
