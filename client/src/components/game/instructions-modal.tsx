import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">How to Play</DialogTitle>
          <IconButton 
            iconClass="fas fa-times" 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-700" 
            onClick={onClose}
            aria-label="Close"
          />
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-700">Word Ladder is a word puzzle game where you transform one word into another by changing just one letter at a time.</p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Rules</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-success-500 mt-1 mr-2"></i>
                <span>Change exactly one letter per step</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-success-500 mt-1 mr-2"></i>
                <span>Each intermediate word must be a valid dictionary word</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-success-500 mt-1 mr-2"></i>
                <span>Try to reach the target word in as few steps as possible</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Example</h4>
            <p className="text-sm text-gray-700">Transform <span className="font-mono font-bold">COLD</span> to <span className="font-mono font-bold">WARM</span>:</p>
            <div className="space-y-1 text-sm font-mono">
              <div className="flex items-center">
                <span className="w-6 text-gray-500">#1</span>
                <span className="font-bold">COLD</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-gray-500">#2</span>
                <span className="font-bold">CORD</span> <span className="text-warning-500 ml-2">(changed L to R)</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-gray-500">#3</span>
                <span className="font-bold">CARD</span> <span className="text-warning-500 ml-2">(changed O to A)</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-gray-500">#4</span>
                <span className="font-bold">WARD</span> <span className="text-warning-500 ml-2">(changed C to W)</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 text-gray-500">#5</span>
                <span className="font-bold">WARM</span> <span className="text-warning-500 ml-2">(changed D to M)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Scoring</h4>
            <p className="text-sm text-gray-700">The fewer steps you use, the better your score! If you get stuck, hints are available but will affect your final score.</p>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 px-5 py-3 flex justify-end border-t rounded-b-lg mt-4">
          <Button 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={onClose}
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
