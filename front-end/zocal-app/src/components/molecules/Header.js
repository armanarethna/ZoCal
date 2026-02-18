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
  Logout as LogoutIcon,
  Login as LoginIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AuthController from '../auth/AuthController';
import SettingsModal from '../modals/SettingsModal';
import RegistrationSuccessModal from '../modals/RegistrationSuccessModal';

const Header = ({ darkMode, handleThemeToggle, isAuthenticated, handleLogout }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [registrationSuccessModalOpen, setRegistrationSuccessModalOpen] = useState(false);
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

  const handleRegistrationSuccess = () => {
    setRegistrationSuccessModalOpen(true);
  };

  const handleCloseRegistrationSuccessModal = () => {
    setRegistrationSuccessModalOpen(false);
  };

  const handleRegistrationSuccessLoginClick = () => {
    setRegistrationSuccessModalOpen(false);
    setAuthModalOpen(true);
  };
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ zIndex: 1400 }}>
      <Toolbar sx={{ minHeight: isMobile ? '48px' : '64px' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            fontSize: isMobile ? '1.25rem' : '1.25rem',
            lineHeight: isMobile ? '1.2' : '1.6'
          }}
        >
          {isMobile ? "ZoCal" : "ZoCal - Personal Zoroastrian Calendar"}
        </Typography>
        
        {isAuthenticated ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleSettingsClick}
              aria-label="settings"
              size={isMobile ? "small" : "medium"}
              sx={{ mr: 2 }}
            >
              <SettingsIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size={isMobile ? "small" : "medium"}
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              size={isMobile ? "small" : "medium"}
            >
              Log In
            </Button>
          </>
        )}
      </Toolbar>
      
      <AuthController 
        open={authModalOpen} 
        onClose={handleCloseAuthModal}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
      
      <SettingsModal 
        open={settingsModalOpen} 
        onClose={handleCloseSettingsModal} 
      />
      
      <RegistrationSuccessModal
        open={registrationSuccessModalOpen}
        onClose={handleCloseRegistrationSuccessModal}
        onLoginClick={handleRegistrationSuccessLoginClick}
      />
    </AppBar>
  );
};

export default Header;