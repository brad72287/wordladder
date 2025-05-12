import { Button } from '@/components/ui/button';

interface LetterKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function LetterKeyboard({ onKeyPress }: LetterKeyboardProps) {
  const row1 = 'QWERTYUIOP'.split('');
  const row2 = 'ASDFGHJKL'.split('');
  const row3 = 'ZXCVBNM'.split('');

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center space-x-1">
        {row1.map((letter) => (
          <Button
            key={letter}
            className="w-8 h-10 bg-white hover:bg-gray-200 rounded shadow-sm text-gray-800 font-medium border border-gray-300 transition-colors p-0"
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
      <div className="flex justify-center space-x-1">
        {row2.map((letter) => (
          <Button
            key={letter}
            className="w-8 h-10 bg-white hover:bg-gray-200 rounded shadow-sm text-gray-800 font-medium border border-gray-300 transition-colors p-0"
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
      <div className="flex justify-center space-x-1">
        {row3.map((letter) => (
          <Button
            key={letter}
            className="w-8 h-10 bg-white hover:bg-gray-200 rounded shadow-sm text-gray-800 font-medium border border-gray-300 transition-colors p-0"
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </Button>
        ))}
        <Button
          className="w-12 h-10 bg-gray-200 hover:bg-gray-300 rounded shadow-sm text-gray-800 font-medium border border-gray-300 transition-colors flex items-center justify-center p-0"
          onClick={() => onKeyPress('BACKSPACE')}
          aria-label="Backspace"
        >
          <i className="fas fa-backspace"></i>
        </Button>
      </div>
    </div>
  );
}
