"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "@/app/theme/darkTheme";
import lightTheme from "@/app/theme/lightTheme";
import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";

export const ThemeContext = createContext<any>(undefined);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDark, setIsDark] = useState(prefersDarkMode);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const value = useMemo(() => ({ toggleTheme, isDark }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
