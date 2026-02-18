const express = require('express');
const {
  handleRegisterUser,
  handleLoginUser,
  handleVerifyEmail,
  handleForgotPassword,
  handleResetPassword,
  handleGetCurrentUser,
  handleUpdateUserProfile,
  handleUpdateUserSettings,
  handleResendVerificationEmail,
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateSettings,
  resendVerificationEmail
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// =============================================
// AUTHENTICATION ROUTES
// =============================================

// Registration and login
router.post('/register', register, handleRegisterUser);
router.post('/login', login, handleLoginUser);

// Email verification
router.get('/verify-email', handleVerifyEmail);
router.post('/resend-verification', resendVerificationEmail, handleResendVerificationEmail);

// Password reset
router.post('/forgot-password', forgotPassword, handleForgotPassword);
router.post('/reset-password', resetPassword, handleResetPassword);

// Protected routes
router.get('/me', auth, handleGetCurrentUser);
router.put('/profile', auth, updateProfile, handleUpdateUserProfile);
router.put('/settings', auth, updateSettings, handleUpdateUserSettings);

module.exports = router;