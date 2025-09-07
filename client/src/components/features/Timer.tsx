import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  className?: string;
}

export const Timer = ({ duration, onTimeUp, className }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStyles = () => {
    const minutes = Math.floor(timeLeft / 60);
    
    if (minutes <= 5) {
      return 'text-destructive animate-pulse border-destructive bg-destructive/10';
    } else if (minutes <= 15) {
      return 'text-orange-500 border-orange-500 bg-orange-50';
    }
    return 'text-foreground border-border bg-background';
  };

  return (
    <div className={cn(
      'px-4 py-2 rounded-lg border-2 font-mono text-lg font-bold transition-all duration-300',
      getTimerStyles(),
      className
    )}>
      {formatTime(timeLeft)}
    </div>
  );
};