import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, Snackbar, Alert } from '@mui/material';
import { toggleTheme } from './store/themeSlice';
import { logout, getCurrentUser } from './store/authSlice';
import { useAppTheme } from './theme/theme';
import Header from './components/Header';
import TabsNavigation from './components/TabsNavigation';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [tabValue, setTabValue] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const { darkMode } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useAppTheme();

  // Check for existing token on app initialization
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <Header 
          darkMode={darkMode} 
          handleThemeToggle={handleThemeToggle}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
        <TabsNavigation tabValue={tabValue} handleTabChange={handleTabChange} />
        <MainContent tabValue={tabValue} />
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
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