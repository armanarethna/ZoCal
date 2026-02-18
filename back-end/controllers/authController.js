const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');
const emailService = require('../utils/emailService');

// =============================================
// VALIDATION RULES
// =============================================

const register = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

const login = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

const forgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
];

const resetPassword = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

const updateProfile = [
  // No profile fields to update currently
];

const updateSettings = [
  body('display_mode')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Display mode must be either light or dark'),
  
  body('default_zoro_cal')
    .optional()
    .isIn(['Shenshai', 'Kadmi', 'Fasli'])
    .withMessage('Default Zoroastrian calendar must be Shenshai, Kadmi, or Fasli')
];

// =============================================
// AUTH CONTROLLER
// =============================================

// @desc    Register a new user
const handleRegisterUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(errorResponse('A user with this email already exists'));
    }

    // Create new user (not active until email verification)
    const user = new User({
      email,
      password,
      isVerified: false,
      isActive: false
    });

    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken();
    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json(successResponse(
      'Registration successful! Please check your email to verify your account.',
      {
        message: 'A verification email has been sent to your email address. Please verify your email to complete registration.'
      },
      201
    ));

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(errorResponse('Server error during registration'));
  }
};

// @desc    Verify email address
const handleVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json(errorResponse('Verification token is required'));
    }

    // Find user by verification token (this already checks expiration)
    const user = await User.findByVerificationToken(token);
    
    if (!user) {
      return res.status(400).json(errorResponse('Invalid or expired verification token. This link may have already been used or has expired. Please request a new verification email if needed.'));
    }

    // Update user status
    user.isVerified = true;
    user.isActive = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    
    await user.save();

    // Generate JWT token for immediate login
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json(successResponse(
      'Email verified successfully! You are now logged in.',
      {
        token: authToken,
        user: user.getPublicProfile()
      }
    ));

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json(errorResponse('Server error during email verification'));
  }
};

// @desc    Login user
const handleLoginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(400).json(errorResponse('Invalid email or password'));
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(errorResponse('Invalid email or password'));
    }

    // Check if user is verified and active
    if (!user.isVerified) {
      return res.status(400).json(errorResponse('Please verify your email address before logging in. Check your email for the verification link.'));
    }

    if (!user.isActive) {
      return res.status(400).json(errorResponse('Your account is not active. Please contact support.'));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json(successResponse(
      'Login successful',
      {
        token,
        user: user.getPublicProfile()
      }
    ));

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(errorResponse('Server error during login'));
  }
};

// @desc    Forgot password - send reset email
const handleForgotPassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const { email } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json(errorResponse('No user found with this email address'));
    }

    // Check if user is verified and active
    if (!user.isVerified || !user.isActive) {
      return res.status(400).json(errorResponse('Account must be verified and active to reset password'));
    }

    // Generate password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);

      res.json(successResponse(
        'Password reset email sent successfully',
        {
          message: 'If an account with this email exists, a password reset link has been sent to your email address.'
        }
      ));

    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      
      // Clear the reset token since email failed
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();
      
      res.status(500).json(errorResponse('Failed to send reset email. Please try again.'));
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json(errorResponse('Server error during password reset request'));
  }
};

// @desc    Reset password with token
const handleResetPassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json(errorResponse('Reset token is required'));
    }

    // Find user by reset token
    const user = await User.findByResetToken(token);
    
    if (!user) {
      return res.status(400).json(errorResponse('Invalid or expired reset token'));
    }

    // Verify the token
    if (!user.verifyResetToken(token)) {
      return res.status(400).json(errorResponse('Invalid or expired reset token'));
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    
    await user.save();

    res.json(successResponse(
      'Password reset successful',
      {
        message: 'Your password has been reset successfully. You can now log in with your new password.'
      }
    ));

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json(errorResponse('Server error during password reset'));
  }
};

// @desc    Get current user data
const handleGetCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    res.json(successResponse(
      'User data retrieved successfully',
      user.getPublicProfile()
    ));

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json(errorResponse('Server error while fetching user data'));
  }
};

// @desc    Update user profile
const handleUpdateUserProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    // No profile fields to update currently
    // This endpoint is kept for future profile updates
    
    await user.save();

    res.json(successResponse(
      'Profile updated successfully',
      user.getPublicProfile()
    ));

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json(errorResponse('Server error while updating profile'));
  }
};

// @desc    Update user settings (display mode and calendar preference)
const handleUpdateUserSettings = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    // Update settings fields
    const { display_mode, default_zoro_cal } = req.body;
    if (display_mode) user.display_mode = display_mode;
    if (default_zoro_cal) user.default_zoro_cal = default_zoro_cal;

    await user.save();

    res.json(successResponse(
      'Settings updated successfully',
      user.getPublicProfile()
    ));

  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json(errorResponse('Server error while updating settings'));
  }
};

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleVerifyEmail,
  handleForgotPassword,
  handleResetPassword,
  handleGetCurrentUser,
  handleUpdateUserProfile,
  handleUpdateUserSettings,
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateSettings
};