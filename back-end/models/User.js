const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// =============================================
// USER MODEL SCHEMA TEMPLATE
// =============================================
// Customize this schema based on your application needs

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
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
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
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

// =============================================
// VIRTUAL FIELDS
// =============================================

// Virtual for user's full profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/api/users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);