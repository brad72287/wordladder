import { cn } from '@/lib/utils';

interface LetterBlockProps {
  letter: string;
  isChanged?: boolean;
  isCurrent?: boolean;
  isCorrectPosition?: boolean;
  targetWord?: string;
  index?: number;
}

export function LetterBlock({ 
  letter, 
  isChanged = false, 
  isCurrent = false, 
  isCorrectPosition = false,
  targetWord = '',
  index = -1
}: LetterBlockProps) {
  
  // Determine if this letter is in the correct position in the target word
  const isInTargetWord = targetWord && index >= 0 && targetWord[index] === letter;
  
  const getStyles = () => {
    if (isChanged) {
      return {
        backgroundColor: 'var(--changed-letter-bg)',
        color: 'var(--changed-letter-text)',
        transform: 'scale(1.05)'
      };
    }
    if (isInTargetWord) {
      return {
        backgroundColor: 'var(--correct-letter-bg)',
        color: 'var(--correct-letter-text)'
      };
    }
    if (isCurrent) {
      return {
        backgroundColor: 'var(--card-bg)',
        color: 'var(--letter-text)',
        border: '1px solid var(--changed-color)'
      };
    }
    return {
      backgroundColor: 'var(--letter-bg)',
      color: 'var(--letter-text)'
    };
  };
  
  return (
    <div 
      className="letter-block w-12 h-12 flex items-center justify-center rounded-md font-mono font-bold text-xl"
      style={getStyles()}
    >
      {letter}
    </div>
  );
}
