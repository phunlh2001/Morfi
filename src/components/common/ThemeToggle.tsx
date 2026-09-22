import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={`relative h-9 w-9 p-0 rounded-xl transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:text-amber-300 hover:bg-slate-700'
          : 'bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 scale-100 text-slate-700" />
      )}
    </Button>
  );
};
