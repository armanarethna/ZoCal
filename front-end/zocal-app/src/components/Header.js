import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AuthModal from './AuthModal';
import SettingsModal from './SettingsModal';

const Header = ({ darkMode, handleThemeToggle, isAuthenticated, handleLogout }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleSettingsClick = () => {
    setSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setSettingsModalOpen(false);
  };
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          ZoCal - Your Personal Zoroastrian Calendar
        </Typography>
        
        {/* Authentication Buttons */}
        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ mr: 1 }}
            >
              Log Out
            </Button>
            {/* Settings Button for authenticated users */}
            <IconButton
              color="inherit"
              onClick={handleSettingsClick}
              aria-label="settings"
            >
              <SettingsIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              sx={{ mr: 1 }}
            >
              Log In
            </Button>
            {/* Theme Toggle Button for non-authenticated users */}
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label="toggle theme"
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </>
        )}
      </Toolbar>
      
      {/* Authentication Modal */}
      <AuthModal 
        open={authModalOpen} 
        onClose={handleCloseAuthModal} 
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        open={settingsModalOpen} 
        onClose={handleCloseSettingsModal} 
      />
    </AppBar>
  );
};

export default Header;