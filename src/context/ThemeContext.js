import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import { lightColors } from '../styles/lightTheme';
import { darkColors } from '../styles/darkTheme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme,
      colors: isDark ? darkColors : lightColors,
    }),
    [isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};


