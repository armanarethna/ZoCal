import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

// Base theme configuration
const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#4285f4' : '#1976d2',
      light: darkMode ? '#7baaf7' : '#42a5f5',
      dark: darkMode ? '#1565c0' : '#0d47a1',
    },
    secondary: {
      main: darkMode ? '#ff9800' : '#ff6f00',
    },
    background: {
      default: darkMode ? '#121212' : '#fafafa',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
    },
    grey: {
      50: darkMode ? '#444444' : '#fafafa',
      100: darkMode ? '#2d2d2d' : '#f5f5f5',
      200: darkMode ? '#404040' : '#eeeeee',
      700: darkMode ? '#616161' : '#616161',
      800: darkMode ? '#424242' : '#424242',
      900: darkMode ? '#212121' : '#212121',
    },
    text: {
      primary: darkMode ? '#ffffff' : '#000000',
      secondary: darkMode ? '#b3b3b3' : '#666666',
    },
    divider: darkMode ? '#333333' : '#e0e0e0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          boxShadow: darkMode 
            ? '0 1px 3px rgba(255,255,255,0.12)' 
            : '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 120,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
  },
});

// Theme hook that integrates with Redux
export const useAppTheme = () => {
  const { darkMode } = useSelector((state) => state.theme);
  return getTheme(darkMode);
};

// Default theme export
export default getTheme(false);