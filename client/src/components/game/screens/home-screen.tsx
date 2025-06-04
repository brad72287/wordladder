import { Button } from '@/components/ui/button';

interface HomeScreenProps {
  onNewGame: () => void;
  onContinueGame: () => boolean;
  hasSavedGame: boolean;
  onStartTimeAttack: () => void;
}

export function HomeScreen({ onNewGame, onContinueGame, hasSavedGame, onStartTimeAttack }: HomeScreenProps) {
  return (
    <section className="flex-1 flex flex-col p-4">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary-600 mb-2">Word Ladder</h2>
          <p className="text-gray-600">Transform one word into another, one letter at a time</p>
        </div>
        
        <div className="w-full max-w-xs">
          <Button 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors mb-3 h-auto"
            onClick={onNewGame}
          >
            New Game
          </Button>
          
          <Button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
            onClick={onContinueGame}
            disabled={!hasSavedGame}
          >
            Continue Game
          </Button>

          <Button
            onClick={onStartTimeAttack}
            variant="outline"
            className="w-full mt-3 border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 font-medium py-3 px-4 rounded-lg shadow transition-colors h-auto"
          >
            Time Attack
          </Button>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-5 max-w-xs w-full">
          <h3 className="font-semibold mb-2 text-center">How to Play</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-success-500 mt-1 mr-2"></i>
              <span>Change one letter at a time</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-success-500 mt-1 mr-2"></i>
              <span>Each new word must be valid</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-success-500 mt-1 mr-2"></i>
              <span>Reach the target word in as few steps as possible</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
