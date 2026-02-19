import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, Snackbar, Alert } from '@mui/material';
import { toggleTheme } from './store/themeSlice';
import { logout, getCurrentUser } from './store/authSlice';
import { useAppTheme } from './theme/theme';
import { useCSSVariableTheme } from './hooks/useCSSVariableTheme';
import Header from './components/molecules/Header';
import TabsNavigation from './components/tabs/TabsNavigation';
import EmailVerification from './components/auth/EmailVerification';
import PasswordReset from './components/auth/PasswordReset';
import { DEFAULTS } from './constants';
import './App.css';

// Main app component
const MainApp = () => {
  const [tabValue, setTabValue] = useState(DEFAULTS.TAB_VALUE);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <TabsNavigation tabValue={tabValue} handleTabChange={handleTabChange} />
    </>
  );
};

function App() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const { darkMode } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useAppTheme();
  
  // Sync CSS variables with theme changes
  useCSSVariableTheme();

  // Check for existing token on app initialization
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
    setSnackbar({ open: true, message: 'Logged out successfully', severity: 'info' });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ 
        backgroundColor: 'var(--background-default)',
        minHeight: '100vh'
      }}>
        <Header 
          darkMode={darkMode} 
          handleThemeToggle={handleThemeToggle}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/reset-password" element={<PasswordReset />} />
        </Routes>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={DEFAULTS.SNACKBAR_DURATION}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;