
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'auto') {
        // Check time of day (6 AM to 6 PM is daytime)
        const currentHour = new Date().getHours();
        const isDaytime = currentHour >= 6 && currentHour < 18;
        
        // Force light mode during daytime, otherwise use system preference
        if (isDaytime) {
          setIsDark(false);
          console.log('Auto theme: Daytime detected, using light mode');
        } else {
          setIsDark(systemColorScheme === 'dark');
          console.log('Auto theme: Nighttime, using system preference:', systemColorScheme);
        }
      } else {
        setIsDark(themeMode === 'dark');
        console.log('Manual theme mode:', themeMode);
      }
    };

    updateTheme();
    
    // Update theme every minute to catch time changes
    const interval = setInterval(updateTheme, 60000);
    
    return () => clearInterval(interval);
  }, [themeMode, systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
