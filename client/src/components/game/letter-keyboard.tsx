import { Button } from '@/components/ui/button';

interface LetterKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function LetterKeyboard({ onKeyPress }: LetterKeyboardProps) {
  const row1 = 'QWERTYUIOP'.split('');
  const row2 = 'ASDFGHJKL'.split('');
  const row3 = 'ZXCVBNM'.split('');

  const keyStyle = {
    backgroundColor: 'var(--letter-bg)',
    color: 'var(--letter-text)',
    borderColor: 'var(--border)'
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center space-x-1">
        {row1.map((letter) => (
          <Button
            key={letter}
            className="w-8 h-10 rounded shadow-sm font-medium border transition-colors p-0 hover:opacity-80"
            style={keyStyle}
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
            className="w-8 h-10 rounded shadow-sm font-medium border transition-colors p-0 hover:opacity-80"
            style={keyStyle}
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
            className="w-8 h-10 rounded shadow-sm font-medium border transition-colors p-0 hover:opacity-80"
            style={keyStyle}
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </Button>
        ))}
        <Button
          className="w-12 h-10 rounded shadow-sm font-medium border transition-colors flex items-center justify-center p-0 hover:opacity-80"
          style={{
            backgroundColor: 'var(--changed-letter-bg)',
            color: 'var(--changed-letter-text)',
            borderColor: 'var(--changed-letter-bg)'
          }}
          onClick={() => onKeyPress('BACKSPACE')}
          aria-label="Backspace"
        >
          <i className="fas fa-backspace"></i>
        </Button>
      </div>
    </div>
  );
}
