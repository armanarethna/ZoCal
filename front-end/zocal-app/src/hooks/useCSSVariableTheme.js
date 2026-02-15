import { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Hook to synchronize Material-UI theme with CSS variables
 * This ensures CSS variables update when the theme mode changes
 */
export const useCSSVariableTheme = () => {
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [darkMode]);
};