import { useState, useEffect, useCallback } from 'react';
import { validateWord, areOneLetterApart } from '@/lib/word-validator';
// Assuming game-utils will be updated or a new one created for time attack stats
import { saveGameStats, loadGameStats, getRandomWordWithDifficulty } from '@/lib/game-utils';
import { apiRequest } from '@/lib/queryClient';

// Types copied from use-game-state.tsx - consider moving to a shared location
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type WordItem = {
  word: string;
  isValid: boolean;
  changedLetterIndex?: number;
  isOptimalStep?: boolean;
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

// Renamed and adapted for Time Attack
export type TimeAttackStats = {
  sessionsPlayed: number;
  highestScore: number;
  totalWordsSolved: number;
};

const INITIAL_LADDER_STATE: GameState = {
  startWord: '',
  endWord: '',
  wordChain: [],
  currentWord: '',
  difficulty: 'medium', // Default difficulty for time attack ladders
  moves: 0,
  startTime: null,
  endTime: null,
  isGameComplete: false,
};

const INITIAL_TIME_ATTACK_STATS: TimeAttackStats = {
  sessionsPlayed: 0,
  highestScore: 0,
  totalWordsSolved: 0,
};

const TIME_ATTACK_DURATION_SECONDS = 60;
const TIME_ATTACK_STATS_KEY = 'wordLadderTimeAttackStats';

const getLevenshteinDistance = (wordA: string, wordB: string): number => {
  if (wordA.length !== wordB.length) {
    return Math.max(wordA.length, wordB.length);
  }
  let distance = 0;
  for (let i = 0; i < wordA.length; i++) {
    if (wordA[i] !== wordB[i]) {
      distance++;
    }
  }
  return distance;
};

export function useTimeAttackState() {
  const [currentLadder, setCurrentLadder] = useState<GameState>(INITIAL_LADDER_STATE);
  const [stats, setStats] = useState<TimeAttackStats>(INITIAL_TIME_ATTACK_STATS);
  const [error, setError] = useState('');
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);

  // Time Attack specific state
  const [timeAttackScore, setTimeAttackScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(TIME_ATTACK_DURATION_SECONDS);
  const [isTimeAttackActive, setIsTimeAttackActive] = useState(false);
  const [isTimeAttackOver, setIsTimeAttackOver] = useState(false);

  // Load persisted stats
  useEffect(() => {
    const savedStats = loadGameStats<TimeAttackStats>(TIME_ATTACK_STATS_KEY);
    if (savedStats) {
      setStats(savedStats);
    }
  }, []);

  // Timer effect for Time Attack session
  // This effect also handles saving stats when the game is over.
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isTimeAttackActive && !isTimeAttackOver) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimeAttackActive(false);
            setIsTimeAttackOver(true);
            // Update stats when time is up
            setStats(prevStats => {
              const newSessionsPlayed = prevStats.sessionsPlayed + 1;
              const newHighestScore = Math.max(prevStats.highestScore, timeAttackScore);
              const newTotalWordsSolved = prevStats.totalWordsSolved + timeAttackScore;

              const updatedStats: TimeAttackStats = {
                sessionsPlayed: newSessionsPlayed,
                highestScore: newHighestScore,
                totalWordsSolved: newTotalWordsSolved,
              };
              saveGameStats<TimeAttackStats>(updatedStats, TIME_ATTACK_STATS_KEY);
              return updatedStats;
            });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimeAttackActive, isTimeAttackOver, timeAttackScore]);


  const generateRandomPuzzle = useCallback(async (difficulty: DifficultyLevel) => {
    setIsGeneratingPuzzle(true);
    setError('');
    try {
      let wordLength = 3;
      if (difficulty === 'medium') wordLength = 4;
      if (difficulty === 'hard') wordLength = 5;

      const startWordRes = await fetch(`/api/random-word?length=${wordLength}&difficulty=${difficulty}`);
      if (!startWordRes.ok) throw new Error('Failed to fetch start word');
      const startWordData = await startWordRes.json();

      const endWordRes = await fetch(`/api/random-word?length=${wordLength}&difficulty=${difficulty}`);
      if (!endWordRes.ok) throw new Error('Failed to fetch end word');
      const endWordData = await endWordRes.json();

      let startWord = startWordData.word.toUpperCase();
      let endWord = endWordData.word.toUpperCase();

      if (startWord === endWord) {
        const anotherEndWordRes = await fetch(`/api/random-word?length=${wordLength}&difficulty=${difficulty}`);
        if (anotherEndWordRes.ok) {
          const anotherEndWordData = await anotherEndWordRes.json();
          endWord = anotherEndWordData.word.toUpperCase();
        }
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
      const startWord = await getRandomWordWithDifficulty(difficulty);
      let endWord = await getRandomWordWithDifficulty(difficulty);
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

  const startNextTimeAttackLadder = useCallback(async () => {
    setIsGeneratingPuzzle(true);
    // For time attack, let's use a fixed difficulty or cycle through them.
    // Using 'medium' for now as per INITIAL_LADDER_STATE.
    // A more advanced version could vary difficulty.
    const difficulty = currentLadder.difficulty || 'medium';
    try {
      const { startWord, endWord } = await generateRandomPuzzle(difficulty);
      const initialItem: WordItem = {
        word: startWord,
        isValid: true,
        isOptimalStep: true
      };
      setCurrentLadder({
        startWord,
        endWord,
        wordChain: [initialItem],
        currentWord: '',
        difficulty,
        moves: 0,
        startTime: Date.now(), // Ladder start time
        endTime: null,
        isGameComplete: false,
      });
    } catch (err) {
      setError('Failed to generate next ladder. Please try again.');
      // Potentially end the time attack session if a ladder can't be generated
      setIsTimeAttackActive(false);
      setIsTimeAttackOver(true);
    } finally {
      setIsGeneratingPuzzle(false);
    }
  }, [generateRandomPuzzle, currentLadder.difficulty]);

  const startNewTimeAttackSession = useCallback(() => {
    setTimeAttackScore(0);
    setRemainingTime(TIME_ATTACK_DURATION_SECONDS);
    setIsTimeAttackActive(true);
    setIsTimeAttackOver(false);
    setError('');
    // Start the first ladder
    // Reset currentLadder to initial state before starting a new one to avoid issues with difficulty
    setCurrentLadder(prev => ({...INITIAL_LADDER_STATE, difficulty: prev.difficulty }));
    startNextTimeAttackLadder();
  }, [startNextTimeAttackLadder]);

  const submitWord = useCallback(async (word: string) => {
    if (!isTimeAttackActive || isTimeAttackOver || currentLadder.isGameComplete) {
      return false;
    }
    if (!word) {
      setError('Please enter a word');
      return false;
    }

    const formattedWord = word.toUpperCase();
    const lastWord = currentLadder.wordChain[currentLadder.wordChain.length - 1].word;

    if (currentLadder.wordChain.some(item => item.word === formattedWord)) {
      setError('Word already used in this ladder');
      return false;
    }

    if (!areOneLetterApart(lastWord, formattedWord)) {
      setError('You can only change one letter at a time');
      return false;
    }

    try {
      const isValid = await validateWord(formattedWord);
      if (!isValid) {
        setError(`"${formattedWord}" is not a valid word`);
        return false;
      }

      let changedLetterIndex = -1;
      for (let i = 0; i < lastWord.length; i++) {
        if (lastWord[i] !== formattedWord[i]) {
          changedLetterIndex = i;
          break;
        }
      }

      const previousWordItem = currentLadder.wordChain[currentLadder.wordChain.length - 1];
      const targetWord = currentLadder.endWord;
      const distPreviousToTarget = getLevenshteinDistance(previousWordItem.word, targetWord);
      const distCurrentToTarget = getLevenshteinDistance(formattedWord, targetWord);
      const currentIsOptimal = distCurrentToTarget < distPreviousToTarget ||
                               (distCurrentToTarget === distPreviousToTarget && previousWordItem.isOptimalStep === true);

      const newItem: WordItem = {
        word: formattedWord,
        isValid: true,
        changedLetterIndex,
        isOptimalStep: currentIsOptimal
      };
      const newChain = [...currentLadder.wordChain, newItem];
      const newMoves = currentLadder.moves + 1;
      const isLadderComplete = formattedWord === currentLadder.endWord;

      setCurrentLadder(prev => ({
        ...prev,
        wordChain: newChain,
        currentWord: '',
        moves: newMoves,
        endTime: isLadderComplete ? Date.now() : null,
        isGameComplete: isLadderComplete,
      }));

      setError('');

      if (isLadderComplete) {
        setTimeAttackScore(prevScore => prevScore + 1);
        // Load next ladder immediately
        startNextTimeAttackLadder();
      }
      return true;
    } catch (err) {
      setError('Error validating word. Please try again.');
      return false;
    }
  }, [currentLadder, isTimeAttackActive, isTimeAttackOver, startNextTimeAttackLadder]);

  const endCurrentTimeAttackSession = useCallback(() => {
    setIsTimeAttackActive(false);
    setIsTimeAttackOver(true);

    // Stats are updated in the timer effect when time runs out,
    // but if a user manually ends it, we should record stats here too.
    setStats(prevStats => {
      const newSessionsPlayed = prevStats.sessionsPlayed + 1;
      const newHighestScore = Math.max(prevStats.highestScore, timeAttackScore);
      const newTotalWordsSolved = prevStats.totalWordsSolved + timeAttackScore;

      const updatedStats: TimeAttackStats = {
        sessionsPlayed: newSessionsPlayed,
        highestScore: newHighestScore,
        totalWordsSolved: newTotalWordsSolved,
      };
      saveGameStats<TimeAttackStats>(updatedStats, TIME_ATTACK_STATS_KEY);
      return updatedStats;
    });
  }, [timeAttackScore]);

  // Format time for display (MM:SS format)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeAttackScore,
    remainingTime,
    isTimeAttackActive,
    isTimeAttackOver,
    currentLadder,
    submitWord,
    startNewTimeAttackSession,
    endCurrentTimeAttackSession, // Added for manual ending if needed
    error,
    setError, // Expose setError to allow clearing errors from UI
    isGeneratingPuzzle,
    stats, // Expose time attack stats
    formatTime, // Utility function
    // Potentially add a function to set currentLadder.difficulty if needed
  };
}
