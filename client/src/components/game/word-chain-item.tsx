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
}

export function WordChainItem({ 
  index, 
  word, 
  isValid, 
  isCurrent,
  changedLetterIndex,
  targetWord = '',
  onSubmit
}: WordChainItemProps) {
  
  return (
    <div 
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: isCurrent ? 'var(--changed-color)' : 'var(--letter-bg)', 
        borderWidth: isCurrent ? '2px' : '1px' 
      }}
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
