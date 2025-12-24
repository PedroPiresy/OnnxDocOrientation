import { useEffect } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypingText({ text, speed = 30, className = '', onComplete }: TypingTextProps) {
  const { displayedText, isTyping } = useTypingEffect(text, speed);

  // Chama onComplete quando terminar de digitar
  useEffect(() => {
    if (!isTyping && onComplete) {
      onComplete();
    }
  }, [isTyping, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">_</span>}
    </span>
  );
}

