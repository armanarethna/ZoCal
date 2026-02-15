const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

// =============================================
// VALIDATION RULES
// =============================================

const register = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase, one uppercase letter and one number')
];

const login = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
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

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(errorResponse('User with this email already exists'));
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json(successResponse(
      'User registered successfully',
      {
        token,
        user: user.getPublicProfile()
      },
      201
    ));

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(errorResponse('Server error during registration'));
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

    // Update fields
    const { name } = req.body;
    if (name) user.name = name;

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
  handleGetCurrentUser,
  handleUpdateUserProfile,
  handleUpdateUserSettings,
  register,
  login,
  updateProfile,
  updateSettings
};