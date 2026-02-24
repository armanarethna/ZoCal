const mongoose = require('mongoose');

// =============================================
// EVENT MODEL FOR ZOCAL CALENDAR APP
// =============================================
// Based on PROJECT_REQUIREMENTS.md specifications

const eventSchema = new mongoose.Schema({
  // Event Basic Information
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    minlength: [2, 'Event name must be at least 2 characters'],
    maxlength: [50, 'Event name cannot exceed 50 characters']
  },
  
  // Event Category (Birthday, Anniversary, or custom)
  category: {
    type: String,
    required: [true, 'Event category is required'],
    trim: true,
    minlength: [2, 'Category must be at least 2 characters'],
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'Other'
  },
  
  // Event Date in standard format
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  
  // Before sunrise flag
  beforeSunrise: {
    type: Boolean,
    default: false
  },

  // Email reminder settings - days before event to send reminder
  // -1 = No Reminder, 0 = On The Day, 1/3/7/30 = Days before
  reminder_days: {
    type: Number,
    enum: {
      values: [-1, 0, 1, 3, 7, 30],
      message: 'Reminder days must be -1, 0, 1, 3, 7, or 30'
    },
    default: -1
  },
  
  // Reminder time settings
  reminder_time_hour: {
    type: Number,
    min: [1, 'Hour must be between 1 and 12'],
    max: [12, 'Hour must be between 1 and 12'],
    default: 12
  },
  
  reminder_time_minute: {
    type: Number,
    min: [0, 'Minute must be between 0 and 59'],
    max: [59, 'Minute must be between 0 and 59'],
    default: 0
  },
  
  reminder_time_ampm: {
    type: String,
    enum: {
      values: ['AM', 'PM'],
      message: 'Time period must be AM or PM'
    },
    default: 'PM'
  },
  
  // What calendar type(s) to send reminders for
  reminder_for: {
    type: String,
    enum: {
      values: ['Zoroastrian', 'Gregorian', 'Both'],
      message: 'Reminder for must be Zoroastrian, Gregorian, or Both'
    },
    default: 'Zoroastrian'
  },
  
  // User who created this event
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =============================================
// INDEXES FOR PERFORMANCE
// =============================================
eventSchema.index({ createdBy: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ name: 'text' }); // For text search

// =============================================
// VIRTUAL FIELDS
// =============================================

// Virtual field to check if event is today
eventSchema.virtual('isToday').get(function() {
  const today = new Date();
  const eventDate = new Date(this.eventDate);
  
  return today.toDateString() === eventDate.toDateString();
});

// =============================================
// INSTANCE METHODS
// =============================================

// Get public event data (excluding sensitive fields)
eventSchema.methods.getPublicData = function() {
  const eventObject = this.toObject();
  delete eventObject.__v;
  return eventObject;
};

// Check if user owns this event
eventSchema.methods.isOwnedBy = function(userId) {
  return this.createdBy.toString() === userId.toString();
};

// =============================================
// STATIC METHODS
// =============================================

// Find events by user
eventSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ createdBy: userId });
  
  // Apply sorting
  if (options.sortBy) {
    query.sort(options.sortBy);
  } else {
    query.sort({ eventDate: 1 });
  }
  
  return query;
};



// =============================================
// MIDDLEWARE
// =============================================

// Pre-save validation for date
eventSchema.pre('save', function(next) {
  // Validate date is a valid date object
  if (this.eventDate && isNaN(new Date(this.eventDate).getTime())) {
    return next(new Error('Invalid date provided'));
  }
  
  next();
});

module.exports = mongoose.model('Event', eventSchema);