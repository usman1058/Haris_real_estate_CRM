'use client';

import React, { useContext } from 'react';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeContext } from '@/context/ThemeContext';

const ThemeToggleButton = () => {
  const theme = useTheme();
  const { toggleTheme, isDark } = useContext(ThemeContext);

  return (
    <IconButton color="inherit" onClick={toggleTheme}>
      {isDark ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggleButton;
