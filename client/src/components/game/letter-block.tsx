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
  
  return (
    <div 
      className={cn(
        "letter-block w-12 h-12 flex items-center justify-center rounded-md font-mono font-bold text-xl",
        isChanged && "bg-blue-500 text-white transform scale-105",
        isInTargetWord && "bg-green-500 text-white",
        isCurrent 
          ? "bg-primary-50 border border-primary-200" 
          : !isChanged && !isInTargetWord && "bg-gray-100"
      )}
    >
      {letter}
    </div>
  );
}
