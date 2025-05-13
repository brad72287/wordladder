import { useState, useEffect, useCallback } from 'react';
import { validateWord, areOneLetterApart } from '@/lib/word-validator';
import { saveGameState, loadGameState, saveGameStats, loadGameStats, getRandomWordWithDifficulty } from '@/lib/game-utils';
import { apiRequest } from '@/lib/queryClient';

export type GameScreen = 'home' | 'setup' | 'gameplay' | 'complete';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameSettings = {
  difficulty: DifficultyLevel;
  soundEffects: boolean;
  hints: boolean;
};

export type WordItem = {
  word: string;
  isValid: boolean;
  changedLetterIndex?: number;
};

export type GameState = {
  startWord: string;
  endWord: string;
  wordChain: WordItem[];
  currentWord: string;
  difficulty: DifficultyLevel;
  moves: number;
  startTime: number | null;
  endTime: number | null;
  isGameComplete: boolean;
};

export type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number;
  averageSteps: number;
  longestChain: number;
};

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'easy',
  soundEffects: true,
  hints: true,
};

const INITIAL_GAME_STATE: GameState = {
  startWord: '',
  endWord: '',
  wordChain: [],
  currentWord: '',
  difficulty: 'easy',
  moves: 0,
  startTime: null,
  endTime: null,
  isGameComplete: false,
};

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: 0,
  averageSteps: 0,
  longestChain: 0,
};

export function useGameState() {
  const [screen, setScreen] = useState<GameScreen>('home');
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState('');
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);

  // Load persisted game state and settings
  useEffect(() => {
    const savedState = loadGameState();
    const savedStats = loadGameStats();
    
    if (savedState) {
      setGameState(savedState);
      setHasSavedGame(true);
    }
    
    if (savedStats) {
      setStats(savedStats);
    }
  }, []);

  // Timer effect for game in progress
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (screen === 'gameplay' && gameState.startTime && !gameState.endTime) {
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - gameState.startTime!) / 1000));
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [screen, gameState.startTime, gameState.endTime]);

  // Save game state when it changes
  useEffect(() => {
    if (gameState.startWord && (gameState.wordChain.length > 0 || gameState.endWord)) {
      saveGameState(gameState);
    }
  }, [gameState]);

  // Generate random words for start and end based on difficulty
  const generateRandomPuzzle = useCallback(async (difficulty: DifficultyLevel) => {
    setIsGeneratingPuzzle(true);
    setError('');
    
    try {
      // Get length based on difficulty
      let wordLength = 3;
      if (difficulty === 'medium') wordLength = 4;
      if (difficulty === 'hard') wordLength = 5;
      
      // Fetch two random words with the same length
      const startWordRes = await fetch(`/api/random-word?length=${wordLength}&difficulty=${difficulty}`);
      if (!startWordRes.ok) throw new Error('Failed to fetch start word');
      const startWordData = await startWordRes.json();
      
      const endWordRes = await fetch(`/api/random-word?length=${wordLength}&difficulty=${difficulty}`);
      if (!endWordRes.ok) throw new Error('Failed to fetch end word');
      const endWordData = await endWordRes.json();
      
      let startWord = startWordData.word.toUpperCase();
      let endWord = endWordData.word.toUpperCase();
      
      // Make sure we don't get the same word for start and end
      if (startWord === endWord) {
        // Try to get a different end word
        const anotherEndWordRes = await fetch(`/api/random-word?length=${wordLength}&difficulty=${difficulty}`);
        if (anotherEndWordRes.ok) {
          const anotherEndWordData = await anotherEndWordRes.json();
          endWord = anotherEndWordData.word.toUpperCase();
        }
        
        // If we still have the same word, modify one letter
        if (startWord === endWord) {
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          const pos = Math.floor(Math.random() * endWord.length);
          const currentLetter = endWord[pos];
          let newLetter;
          
          do {
            newLetter = letters[Math.floor(Math.random() * letters.length)];
          } while (newLetter === currentLetter);
          
          endWord = endWord.substring(0, pos) + newLetter + endWord.substring(pos + 1);
        }
      }
      
      return { startWord, endWord };
    } catch (error) {
      console.error('Error generating random puzzle:', error);
      
      // Fallback to local word generation if the API fails
      const startWord = await getRandomWordWithDifficulty(difficulty);
      let endWord = await getRandomWordWithDifficulty(difficulty);
      
      // Make sure they're not the same word
      while (startWord.toUpperCase() === endWord.toUpperCase()) {
        endWord = await getRandomWordWithDifficulty(difficulty);
      }
      
      return { 
        startWord: startWord.toUpperCase(), 
        endWord: endWord.toUpperCase() 
      };
    } finally {
      setIsGeneratingPuzzle(false);
    }
  }, []);

  const startNewGame = useCallback(async (startWord: string, endWord: string, difficulty: DifficultyLevel): Promise<boolean> => {
    // If both words are empty, generate a random puzzle
    if (!startWord && !endWord) {
      try {
        const { startWord: generatedStart, endWord: generatedEnd } = await generateRandomPuzzle(difficulty);
        startWord = generatedStart;
        endWord = generatedEnd;
      } catch (err) {
        setError('Failed to generate random puzzle. Please try again or enter words manually.');
        return false;
      }
    } else if (!startWord || !endWord) {
      setError('Both start and end words are required');
      return false;
    }
    
    if (startWord.length !== endWord.length) {
      setError('Start and end words must be the same length');
      return false;
    }
    
    // Reset error
    setError('');
    
    const initialItem: WordItem = {
      word: startWord.toUpperCase(),
      isValid: true
    };
    
    setGameState({
      startWord: startWord.toUpperCase(),
      endWord: endWord.toUpperCase(),
      wordChain: [initialItem],
      currentWord: '',
      difficulty,
      moves: 0,
      startTime: Date.now(),
      endTime: null,
      isGameComplete: false
    });
    
    setElapsedTime(0);
    setScreen('gameplay');
    
    return true;
  }, [generateRandomPuzzle]);

  const continueGame = useCallback(() => {
    if (gameState.startWord && gameState.endWord) {
      setScreen('gameplay');
      return true;
    }
    return false;
  }, [gameState]);

  const submitWord = useCallback(async (word: string) => {
    if (!word) {
      setError('Please enter a word');
      return false;
    }
    
    const formattedWord = word.toUpperCase();
    const lastWord = gameState.wordChain[gameState.wordChain.length - 1].word;
    
    // Check if the word is already in the chain
    if (gameState.wordChain.some(item => item.word === formattedWord)) {
      setError('Word already used in this ladder');
      return false;
    }
    
    // Check if only one letter is changed
    if (!areOneLetterApart(lastWord, formattedWord)) {
      setError('You can only change one letter at a time');
      return false;
    }
    
    // Validate if word exists in dictionary
    try {
      const isValid = await validateWord(formattedWord);
      
      if (!isValid) {
        setError(`"${formattedWord}" is not a valid word`);
        return false;
      }
      
      // Find which letter changed
      let changedLetterIndex = -1;
      for (let i = 0; i < lastWord.length; i++) {
        if (lastWord[i] !== formattedWord[i]) {
          changedLetterIndex = i;
          break;
        }
      }
      
      const newItem: WordItem = {
        word: formattedWord,
        isValid: true,
        changedLetterIndex
      };
      
      const newChain = [...gameState.wordChain, newItem];
      const newMoves = gameState.moves + 1;
      
      // Check if the game is complete
      const isComplete = formattedWord === gameState.endWord;
      
      setGameState(prev => ({
        ...prev,
        wordChain: newChain,
        currentWord: '',
        moves: newMoves,
        endTime: isComplete ? Date.now() : null,
        isGameComplete: isComplete
      }));
      
      setError('');
      
      // If game is complete, update stats and show completion screen
      if (isComplete) {
        const gameTime = Math.floor(((Date.now() - gameState.startTime!) / 1000));
        
        // Update stats
        const newStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + 1,
          bestTime: stats.bestTime === 0 ? gameTime : Math.min(stats.bestTime, gameTime),
          averageSteps: Math.round(((stats.averageSteps * stats.gamesWon) + newMoves) / (stats.gamesWon + 1)),
          longestChain: Math.max(stats.longestChain, newMoves + 1)
        };
        
        setStats(newStats);
        saveGameStats(newStats);
        
        // Show completion screen after a short delay
        setTimeout(() => {
          setScreen('complete');
        }, 500);
      }
      
      return true;
    } catch (err) {
      setError('Error validating word. Please try again.');
      return false;
    }
  }, [gameState, stats]);

  const undoLastMove = useCallback(() => {
    if (gameState.wordChain.length <= 1) {
      return false; // Nothing to undo
    }
    
    setGameState(prev => ({
      ...prev,
      wordChain: prev.wordChain.slice(0, -1),
      moves: prev.moves > 0 ? prev.moves - 1 : 0
    }));
    
    setError('');
    return true;
  }, [gameState]);

  const resetCurrentGame = useCallback(() => {
    if (gameState.startWord && gameState.endWord) {
      const initialItem: WordItem = {
        word: gameState.startWord,
        isValid: true
      };
      
      setGameState(prev => ({
        ...prev,
        wordChain: [initialItem],
        currentWord: '',
        moves: 0,
        startTime: Date.now(),
        endTime: null,
        isGameComplete: false
      }));
      
      setElapsedTime(0);
      setError('');
      
      return true;
    }
    return false;
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    setScreen('home');
    setError('');
    setElapsedTime(0);
    setHasSavedGame(false);
    localStorage.removeItem('wordLadderGameState');
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('wordLadderSettings', JSON.stringify({ ...settings, ...newSettings }));
  }, [settings]);

  // Format time for display (MM:SS format)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate optimal number of moves (Levenshtein distance)
  const calculateOptimalMoves = () => {
    if (!gameState.startWord || !gameState.endWord) return 0;
    
    let differentLetters = 0;
    for (let i = 0; i < gameState.startWord.length; i++) {
      if (gameState.startWord[i] !== gameState.endWord[i]) {
        differentLetters++;
      }
    }
    return differentLetters;
  };
  
  const optimalMoves = calculateOptimalMoves();

  const progress = gameState.wordChain.length > 1 
    ? Math.min(100, Math.round((gameState.wordChain.length - 1) / (optimalMoves * 1.5) * 100))
    : 0;

  // Empty array for hints to maintain interface compatibility
  const hints: string[] = [];

  return {
    screen,
    setScreen,
    gameState,
    settings,
    stats,
    error,
    elapsedTime,
    formatTime,
    hasSavedGame,
    hints,
    progress,
    optimalMoves,
    isGeneratingPuzzle,
    startNewGame,
    continueGame,
    submitWord,
    resetGame,
    updateSettings,
    generateHints: async () => {}, // No-op placeholder function
    undoLastMove,
    resetCurrentGame,
    generateRandomPuzzle
  };
}
