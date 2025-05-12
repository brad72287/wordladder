import { useState } from 'react';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GameSettings } from '@/hooks/use-game-state';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }: SettingsModalProps) {
  const [tempSettings, setTempSettings] = useState<GameSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(tempSettings);
    onClose();
  };

  const handleChange = (key: keyof GameSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-gray-800">Settings</DialogTitle>
          <IconButton 
            iconClass="fas fa-times" 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-700" 
            onClick={onClose}
            aria-label="Close"
          />
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Game Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects" className="cursor-pointer">Sound Effects</Label>
                <Switch
                  id="sound-effects"
                  checked={tempSettings.soundEffects}
                  onCheckedChange={(checked) => handleChange('soundEffects', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="hints" className="cursor-pointer">Enable Hints</Label>
                <Switch
                  id="hints"
                  checked={tempSettings.hints}
                  onCheckedChange={(checked) => handleChange('hints', checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Default Difficulty</h3>
            <div className="flex space-x-2">
              <Button 
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg ${tempSettings.difficulty === 'easy' 
                  ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
                onClick={() => handleChange('difficulty', 'easy')}
              >
                Easy
              </Button>
              <Button 
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg ${tempSettings.difficulty === 'medium' 
                  ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
                onClick={() => handleChange('difficulty', 'medium')}
              >
                Medium
              </Button>
              <Button 
                type="button"
                className={`flex-1 py-2 px-3 rounded-lg ${tempSettings.difficulty === 'hard' 
                  ? 'bg-primary-100 text-primary-700 font-medium border-2 border-primary-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'}`}
                onClick={() => handleChange('difficulty', 'hard')}
              >
                Hard
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-800">About</h3>
            <p className="text-sm text-gray-600">
              Word Ladder v1.0.0 - A word puzzle game where you transform one word into another, 
              one letter at a time.
            </p>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 px-5 py-3 flex justify-end border-t rounded-b-lg">
          <Button 
            variant="outline"
            className="mr-2"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
