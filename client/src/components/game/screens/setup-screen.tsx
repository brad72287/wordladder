import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DifficultyLevel } from '@/hooks/use-game-state';

interface SetupScreenProps {
  onStartGame: (startWord: string, endWord: string, difficulty: DifficultyLevel) => boolean;
  onCancel: () => void;
  error: string;
}

export function SetupScreen({ onStartGame, onCancel, error }: SetupScreenProps) {
  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');

  const handleStartGame = () => {
    onStartGame(startWord, endWord, difficulty);
  };

  return (
    <section className="flex-1 flex flex-col p-4">
      <div className="flex-1 flex flex-col py-6 space-y-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">New Game</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="startWord" className="text-sm font-medium text-gray-700">Start Word</Label>
            <Input 
              type="text" 
              id="startWord" 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg font-mono uppercase h-auto"
              placeholder="COLD"
              maxLength={5}
              value={startWord}
              onChange={(e) => setStartWord(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-gray-500">Enter a 3-5 letter word to start with</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endWord" className="text-sm font-medium text-gray-700">Target Word</Label>
            <Input 
              type="text" 
              id="endWord" 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg font-mono uppercase h-auto"
              placeholder="WARM"
              maxLength={startWord ? startWord.length : 5}
              value={endWord}
              onChange={(e) => setEndWord(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-gray-500">Enter a word with the same length as your start word</p>
          </div>
          
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
            <p className="text-xs text-gray-500 mt-2">Affects the word pool and word length</p>
          </div>
        </div>
        
        {error && (
          <div className="text-error-500 text-sm font-medium">{error}</div>
        )}
        
        <div className="pt-4 space-y-3">
          <Button 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
            onClick={handleStartGame}
          >
            Start Game
          </Button>
          <Button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors h-auto"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </section>
  );
}
