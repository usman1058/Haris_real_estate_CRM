"use client";

import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "./Button";


export function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title="Toggle Theme"
      className="text-gray-600 hover:text-black"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
