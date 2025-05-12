import { cn } from '@/lib/utils';

interface LetterBlockProps {
  letter: string;
  isChanged?: boolean;
  isCurrent?: boolean;
}

export function LetterBlock({ letter, isChanged = false, isCurrent = false }: LetterBlockProps) {
  return (
    <div 
      className={cn(
        "letter-block w-12 h-12 flex items-center justify-center rounded-md font-mono font-bold text-xl",
        isChanged && "bg-warning-500 text-white transform scale-105",
        isCurrent 
          ? "bg-primary-50 border border-primary-200" 
          : !isChanged && "bg-gray-100"
      )}
    >
      {letter}
    </div>
  );
}
