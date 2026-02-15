import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <AppBar position="sticky" color="default" elevation={1} sx={{ zIndex: 1300 }}>
      <Toolbar sx={{ minHeight: isMobile ? '48px' : '64px' }}>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            fontSize: isMobile ? '0.9rem' : '1.25rem',
            lineHeight: isMobile ? '1.2' : '1.6'
          }}
        >
          {isMobile ? "ZoCal" : "ZoCal - Your Personal Zoroastrian Calendar"}
        </Typography>
        
        {/* Authentication Buttons */}
        {isAuthenticated ? (
          <>
            {isMobile ? (
              <IconButton
                color="inherit"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
                sx={{ mr: 0.5 }}
              >
                <LogoutIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ mr: 1 }}
              >
                Log Out
              </Button>
            )}
            {/* Settings Button for authenticated users */}
            <IconButton
              color="inherit"
              onClick={handleSettingsClick}
              aria-label="settings"
              size={isMobile ? "small" : "medium"}
            >
              <SettingsIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </>
        ) : (
          <>
            {isMobile ? (
              <IconButton
                color="inherit"
                onClick={handleLoginClick}
                aria-label="login"
                size="small"
                sx={{ mr: 0.5 }}
              >
                <LoginIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={handleLoginClick}
                sx={{ mr: 1 }}
              >
                Log In
              </Button>
            )}
            {/* Theme Toggle Button for non-authenticated users */}
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label="toggle theme"
              size={isMobile ? "small" : "medium"}
            >
              {darkMode ? <LightMode fontSize={isMobile ? "small" : "medium"} /> : <DarkMode fontSize={isMobile ? "small" : "medium"} />}
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