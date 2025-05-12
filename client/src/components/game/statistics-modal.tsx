import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import { GameStats } from '@/hooks/use-game-state';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export function StatisticsModal({ isOpen, onClose, stats }: StatisticsModalProps) {
  const formatTime = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">Your Statistics</DialogTitle>
          <IconButton 
            iconClass="fas fa-times" 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-700" 
            onClick={onClose}
            aria-label="Close"
          />
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">{stats.gamesPlayed}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">
                {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">{stats.longestChain}</div>
              <div className="text-sm text-gray-600">Longest Chain</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">{stats.averageSteps || 'N/A'}</div>
              <div className="text-sm text-gray-600">Avg. Steps</div>
            </div>
          </div>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-primary-700">Best Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Best Time:</span>
                <span className="font-bold">{formatTime(stats.bestTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Games Won:</span>
                <span className="font-bold">{stats.gamesWon}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 px-5 py-3 flex justify-end border-t rounded-b-lg">
          <Button 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
