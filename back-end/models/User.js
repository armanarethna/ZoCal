const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// =============================================
// USER MODEL SCHEMA
// =============================================

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },

  // Email Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationTokenExpires: {
    type: Date,
    select: false
  },

  // Password Reset
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetTokenExpires: {
    type: Date,
    select: false
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: false // Only becomes true after email verification
  },

  // User Preferences
  display_mode: {
    type: String,
    required: [true, 'Display mode is required'],
    enum: ['light', 'dark'],
    default: 'light'
  },

  default_zoro_cal: {
    type: String,
    required: [true, 'Default Zoroastrian calendar is required'],
    enum: ['Shenshai', 'Kadmi', 'Fasli'],
    default: 'Shenshai'
  },

  // User timezone for reminder scheduling
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    default: 'Asia/Kolkata'
  },

  // Tracking
  lastLogin: {
    type: Date
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =============================================
// INDEXES
// =============================================
userSchema.index({ createdAt: -1 });

// =============================================
// MIDDLEWARE (Pre-save hooks)
// =============================================

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// =============================================
// INSTANCE METHODS
// =============================================

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return verificationToken;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

// Verify email verification token
userSchema.methods.verifyEmailToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.emailVerificationToken === hashedToken && this.emailVerificationTokenExpires > Date.now();
};

// Verify password reset token
userSchema.methods.verifyResetToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.passwordResetToken === hashedToken && this.passwordResetTokenExpires > Date.now();
};

// Get public profile data
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// =============================================
// STATIC METHODS
// =============================================

// Find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Find user by verification token
userSchema.statics.findByVerificationToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() }
  })
  .select('+emailVerificationToken +emailVerificationTokenExpires');
};

// Find user by reset token
userSchema.statics.findByResetToken = function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  }).select('+passwordResetToken +passwordResetTokenExpires');
};

// =============================================
// VIRTUAL FIELDS
// =============================================

// Virtual for user's full profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/api/users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);