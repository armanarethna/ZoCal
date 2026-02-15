const express = require('express');
const {
  handleRegisterUser,
  handleLoginUser,
  handleGetCurrentUser,
  handleUpdateUserProfile,
  handleUpdateUserSettings,
  register,
  login,
  updateProfile,
  updateSettings
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// =============================================
// CLEAN AUTH ROUTES - ALL LOGIC IN CONTROLLER
// =============================================

router.post('/register', register, handleRegisterUser);
router.post('/login', login, handleLoginUser);
router.get('/me', auth, handleGetCurrentUser);
router.put('/profile', auth, updateProfile, handleUpdateUserProfile);
router.put('/settings', auth, updateSettings, handleUpdateUserSettings);

module.exports = router;