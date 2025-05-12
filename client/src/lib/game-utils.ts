import { GameState, GameStats } from '@/hooks/use-game-state';

// Save game state to localStorage
export const saveGameState = (gameState: GameState): void => {
  try {
    localStorage.setItem('wordLadderGameState', JSON.stringify(gameState));
  } catch (err) {
    console.error('Error saving game state:', err);
  }
};

// Load game state from localStorage
export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem('wordLadderGameState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return null;
  } catch (err) {
    console.error('Error loading game state:', err);
    return null;
  }
};

// Save game statistics to localStorage
export const saveGameStats = (stats: GameStats): void => {
  try {
    localStorage.setItem('wordLadderStats', JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving game stats:', err);
  }
};

// Load game statistics from localStorage
export const loadGameStats = (): GameStats | null => {
  try {
    const savedStats = localStorage.getItem('wordLadderStats');
    if (savedStats) {
      return JSON.parse(savedStats);
    }
    return null;
  } catch (err) {
    console.error('Error loading game stats:', err);
    return null;
  }
};

// Calculate word difficulty based on length and common letters
export const calculateWordDifficulty = (word: string): 'easy' | 'medium' | 'hard' => {
  // Difficulty based on word length
  if (word.length <= 3) return 'easy';
  if (word.length <= 5) return 'medium';
  return 'hard';
};

// Generate a random word with the given difficulty
export const getRandomWordWithDifficulty = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<string> => {
  // This would ideally fetch from our API
  // For now, we'll return some static words based on difficulty
  const easyWords = ['CAT', 'DOG', 'BAT', 'HAT', 'MAT', 'RAT', 'SAT'];
  const mediumWords = ['COLD', 'WARM', 'CARD', 'WORD', 'GAME', 'PLAY', 'TIME'];
  const hardWords = ['BRAIN', 'CLOUD', 'EARTH', 'FLAME', 'GHOST', 'LIGHT', 'WITCH'];

  let wordList;
  switch (difficulty) {
    case 'easy':
      wordList = easyWords;
      break;
    case 'medium':
      wordList = mediumWords;
      break;
    case 'hard':
      wordList = hardWords;
      break;
    default:
      wordList = mediumWords;
  }

  return wordList[Math.floor(Math.random() * wordList.length)];
};
