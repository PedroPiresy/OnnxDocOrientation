import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [lines, setLines] = useState<string[]>([]);

  const bootSequence = [
    'Starting system...',
    'Loading kernel modules... [OK]',
    'Initializing hardware... [OK]',
    'Mounting file systems... [OK]',
    'Starting network services... [OK]',
    'Loading portfolio data... [OK]',
    'Initializing terminal interface... [OK]',
    'System ready.',
    '',
    'Welcome to Portfolio Terminal v1.0',
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < bootSequence.length) {
        setLines((prev) => [...prev, bootSequence[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onLoadComplete, 500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="w-full max-w-4xl px-8">
        {lines.map((line, index) => (
          <div
            key={index}
            className="font-mono text-green-500 text-sm mb-1 animate-fadeIn"
          >
            {line}
          </div>
        ))}
        <div className="font-mono text-green-500 text-sm animate-pulse">_</div>
      </div>
    </div>
  );
}