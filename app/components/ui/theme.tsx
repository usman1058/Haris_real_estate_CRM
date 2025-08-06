'use client';

import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/context/ThemeContext';
import { Button } from './Button';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title="Toggle Theme"
      className={`transition-colors duration-200 ${
        isDark
          ? 'text-yellow-400 hover:text-yellow-300'
          : 'text-gray-700 hover:text-black'
      }`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}
