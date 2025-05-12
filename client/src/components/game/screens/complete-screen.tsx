import { Button } from '@/components/ui/button';
import { GameState } from '@/hooks/use-game-state';

interface CompleteScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export function CompleteScreen({ gameState, onPlayAgain, onBackToHome }: CompleteScreenProps) {
  const calculateEfficiency = () => {
    if (!gameState.startWord || !gameState.endWord) return 'N/A';
    
    // Calculate Levenshtein distance between start and end words
    const startWord = gameState.startWord;
    const endWord = gameState.endWord;
    let differentLetters = 0;
    
    for (let i = 0; i < startWord.length; i++) {
      if (startWord[i] !== endWord[i]) {
        differentLetters++;
      }
    }
    
    // Perfect score would be exactly the number of letter differences
    const optimalMoves = differentLetters;
    const actualMoves = gameState.moves;
    
    if (actualMoves <= optimalMoves) return 'Perfect!';
    if (actualMoves <= optimalMoves + 2) return 'Great!';
    if (actualMoves <= optimalMoves + 4) return 'Good';
    return 'Keep practicing';
  };
  
  const shareResults = () => {
    const text = `I solved a Word Ladder from ${gameState.startWord} to ${gameState.endWord} in ${gameState.moves} moves! Play Word Ladder now!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Word Ladder Results',
        text: text,
        url: window.location.href,
      }).catch(error => {
        console.log('Error sharing:', error);
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Results copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  const getTimeFromGame = () => {
    if (gameState.startTime && gameState.endTime) {
      const timeInSeconds = Math.floor((gameState.endTime - gameState.startTime) / 1000);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return '00:00';
  };
  
  return (
    <section className="flex-1 flex flex-col p-4">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-600 mb-2">Congratulations!</h2>
          <p className="text-gray-600">You completed the word ladder!</p>
        </div>
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-5 max-w-xs w-full">
          <h3 className="font-semibold mb-3 text-center text-primary-700">Your Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Words Used:</span>
              <span className="font-bold">{gameState.wordChain.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Time:</span>
              <span className="font-bold">{getTimeFromGame()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Efficiency:</span>
              <span className="font-bold text-success-500">{calculateEfficiency()}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-xs space-y-3">
          <Button 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center h-auto"
            onClick={shareResults}
          >
            <i className="fas fa-share-alt mr-2"></i> Share Results
          </Button>
          <Button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
          <Button 
            className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors h-auto"
            onClick={onBackToHome}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
