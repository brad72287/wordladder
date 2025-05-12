import { cn } from '@/lib/utils';
import { LetterBlock } from '@/components/game/letter-block';
import { IconButton } from '@/components/ui/icon-button';

interface WordChainItemProps {
  index: number;
  word: string;
  isValid: boolean;
  isCurrent: boolean;
  changedLetterIndex?: number;
  onSubmit?: () => void;
}

export function WordChainItem({ 
  index, 
  word, 
  isValid, 
  isCurrent,
  changedLetterIndex,
  onSubmit
}: WordChainItemProps) {
  
  return (
    <div 
      className={cn(
        "word-chain-item p-2 rounded-lg border shadow-sm animate-slideUp",
        isCurrent 
          ? "border-2 border-primary-500 bg-white shadow" 
          : "border-gray-200 bg-white"
      )}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">#{index}</span>
        <div className="flex space-x-1">
          {word.split('').map((letter, letterIndex) => (
            <LetterBlock 
              key={letterIndex}
              letter={letter}
              isChanged={changedLetterIndex === letterIndex}
              isCurrent={isCurrent}
            />
          ))}
        </div>
        {!isCurrent ? (
          <span className={cn(isValid ? "text-success-500" : "text-error-500")}>
            <i className={isValid ? "fas fa-check-circle" : "fas fa-times-circle"}></i>
          </span>
        ) : (
          <IconButton 
            iconClass="fas fa-paper-plane" 
            className="text-primary-600 hover:text-primary-700 bg-transparent" 
            onClick={onSubmit}
            aria-label="Submit word"
          />
        )}
      </div>
    </div>
  );
}
