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
  
  // Event Category (Birthday, Anniversary, Others)
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['Birthday', 'Anniversary', 'Other'],
      message: 'Category must be Birthday, Anniversary, or Other'
    },
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
  reminder_days: {
    type: Number,
    enum: {
      values: [0, 1, 3, 7, 30],
      message: 'Reminder days must be 0, 1, 3, 7, or 30'
    },
    default: 0
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