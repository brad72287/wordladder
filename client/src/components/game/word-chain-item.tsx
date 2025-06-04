import { cn } from '@/lib/utils';
import { LetterBlock } from '@/components/game/letter-block';
import { IconButton } from '@/components/ui/icon-button';

interface WordChainItemProps {
  index: number;
  word: string;
  isValid: boolean;
  isCurrent: boolean;
  changedLetterIndex?: number;
  targetWord?: string;
  onSubmit?: () => void;
  isOptimalStep?: boolean; // Added new prop
}

export function WordChainItem({ 
  index, 
  word, 
  isValid, 
  isCurrent,
  changedLetterIndex,
  targetWord = '',
  onSubmit,
  isOptimalStep // Added new prop
}: WordChainItemProps) {
  
  const itemStyle: React.CSSProperties = {
    borderColor: isCurrent ? 'var(--changed-color)' : 'var(--letter-bg)',
    borderWidth: isCurrent ? '2px' : '1px',
    // Default background
    backgroundColor: 'var(--card-bg)',
  };

  // Apply conditional background for optimal/non-optimal steps
  if (!isCurrent) { // Don't apply optimal/non-optimal styling to the currently active input item
    if (isOptimalStep === true) {
      // Using CSS variables for theming consistency if available, otherwise fallback
      itemStyle.backgroundColor = 'var(--optimal-step-bg, rgba(74, 222, 128, 0.3))'; // Light green with opacity
    } else if (isOptimalStep === false) {
      // itemStyle.backgroundColor = 'var(--non-optimal-step-bg, rgba(252, 165, 165, 0.3))'; // Light red with opacity - or just default
      // For now, only highlighting optimal, non-optimal uses default --card-bg
    }
  }

  return (
    <div 
      style={itemStyle}
      className="word-chain-item p-2 rounded-lg border shadow-sm animate-slideUp"
    >
      <div className="flex justify-between items-center">
        <span className="text-xs opacity-60">#{index}</span>
        <div className="flex space-x-1">
          {word.split('').map((letter, letterIndex) => (
            <LetterBlock 
              key={letterIndex}
              letter={letter}
              isChanged={changedLetterIndex === letterIndex}
              isCurrent={isCurrent}
              targetWord={targetWord}
              index={letterIndex}
            />
          ))}
        </div>
        {!isCurrent ? (
          <span style={{ color: isValid ? 'var(--success-color)' : 'var(--destructive)' }}>
            <i className={isValid ? "fas fa-check-circle" : "fas fa-times-circle"}></i>
          </span>
        ) : (
          <IconButton 
            iconClass="fas fa-paper-plane" 
            style={{ color: 'var(--changed-color)' }}
            className="hover:opacity-80 bg-transparent" 
            onClick={onSubmit}
            aria-label="Submit word"
          />
        )}
      </div>
    </div>
  );
}
