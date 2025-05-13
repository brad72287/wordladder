import { IconButton } from '@/components/ui/icon-button';

interface GameHeaderProps {
  onHelpClick: () => void;
  onStatsClick: () => void;
  onSettingsClick: () => void;
}

export function GameHeader({ onHelpClick, onStatsClick, onSettingsClick }: GameHeaderProps) {
  return (
    <header style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }} className="px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Word Ladder</h1>
        <div className="flex space-x-3">
          <IconButton 
            iconClass="fas fa-question" 
            variant="ghost" 
            onClick={onHelpClick}
            aria-label="Help"
            className="hover:bg-primary-700 text-white"
          />
          <IconButton 
            iconClass="fas fa-chart-bar" 
            variant="ghost" 
            onClick={onStatsClick}
            aria-label="Statistics"
            className="hover:bg-primary-700 text-white"
          />
          <IconButton 
            iconClass="fas fa-cog" 
            variant="ghost" 
            onClick={onSettingsClick}
            aria-label="Settings"
            className="hover:bg-primary-700 text-white"
          />
        </div>
      </div>
    </header>
  );
}
