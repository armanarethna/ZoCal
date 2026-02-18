import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const AuthController = ({ open, onClose, initialMode = 'login', onRegistrationSuccess }) => {
  const [currentModal, setCurrentModal] = useState(initialMode);

  // Reset to initial mode when dialog opens
  React.useEffect(() => {
    if (open) {
      setCurrentModal(initialMode);
    }
  }, [open, initialMode]);

  // Handle modal switching
  const handleSwitchToLogin = () => setCurrentModal('login');
  const handleSwitchToSignUp = () => setCurrentModal('signup');
  const handleSwitchToForgotPassword = () => setCurrentModal('forgot');

  // Handle modal close
  const handleClose = () => {
    onClose();
    // Reset to login after a short delay to avoid jarring transition
    setTimeout(() => setCurrentModal('login'), 200);
  };

  return (
    <>
      <LoginModal
        open={open && currentModal === 'login'}
        onClose={handleClose}
        onSwitchToSignUp={handleSwitchToSignUp}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
      />
      
      <SignUpModal
        open={open && currentModal === 'signup'}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
        onRegistrationSuccess={onRegistrationSuccess}
      />
      
      <ForgotPasswordModal
        open={open && currentModal === 'forgot'}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default AuthController;