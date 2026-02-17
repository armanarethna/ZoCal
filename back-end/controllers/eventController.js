const { body, query, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { getPagination, paginatedResponse, successResponse, errorResponse } = require('../utils/helpers');

// =============================================
// VALIDATION RULES
// =============================================

const createEvent = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Event name must be between 2 and 50 characters'),
  
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  
  body('customCategory')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Custom category must be between 5 and 50 characters'),
  
  body('eventDate')
    .isISO8601()
    .withMessage('Event date must be a valid date in YYYY-MM-DD format')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      const maxPastDate = new Date();
      maxPastDate.setFullYear(today.getFullYear() - 100);
      
      // Set time to start of day for fair comparison
      today.setHours(23, 59, 59, 999);
      eventDate.setHours(0, 0, 0, 0);
      maxPastDate.setHours(0, 0, 0, 0);
      
      if (eventDate > today) {
        throw new Error('Event date cannot be in the future');
      }
      
      if (eventDate < maxPastDate) {
        throw new Error('Event date cannot be more than 100 years ago');
      }
      
      return true;
    }),
  
  body('beforeSunrise')
    .optional()
    .isBoolean()
    .withMessage('Before sunrise must be a boolean value'),

  body('reminder_days')
    .optional()
    .isIn([0, 1, 3, 7, 30])
    .withMessage('Reminder days must be 0, 1, 3, 7, or 30'),

  body('reminder_time_hour')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Reminder time hour must be between 1 and 12'),

  body('reminder_time_ampm')
    .optional()
    .isIn(['AM', 'PM'])
    .withMessage('Reminder time period must be AM or PM'),

  body('reminder_for')
    .optional()
    .isIn(['Zoroastrian', 'Gregorian', 'Both'])
    .withMessage('Reminder for must be Zoroastrian, Gregorian, or Both')
];

const getAllEvents = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .isIn(['Birthday', 'Anniversary', 'Other'])
    .withMessage('Invalid category'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term cannot be empty')
];

const updateEvent = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Event name must be between 2 and 50 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  
  body('customCategory')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Custom category must be between 5 and 50 characters'),
  
  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date in YYYY-MM-DD format')
    .custom((value) => {
      if (value) {
        const eventDate = new Date(value);
        const today = new Date();
        const maxPastDate = new Date();
        maxPastDate.setFullYear(today.getFullYear() - 100);
        
        // Set time to start of day for fair comparison
        today.setHours(23, 59, 59, 999);
        eventDate.setHours(0, 0, 0, 0);
        maxPastDate.setHours(0, 0, 0, 0);
        
        if (eventDate > today) {
          throw new Error('Event date cannot be in the future');
        }
        
        if (eventDate < maxPastDate) {
          throw new Error('Event date cannot be more than 100 years ago');
        }
      }
      
      return true;
    }),
  
  body('beforeSunrise')
    .optional()
    .isBoolean()
    .withMessage('Before sunrise must be a boolean value'),

  body('reminder_days')
    .optional()
    .isIn([0, 1, 3, 7, 30])
    .withMessage('Reminder days must be 0, 1, 3, 7, or 30'),

  body('reminder_time_hour')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Reminder time hour must be between 1 and 12'),

  body('reminder_time_ampm')
    .optional()
    .isIn(['AM', 'PM'])
    .withMessage('Reminder time period must be AM or PM'),

  body('reminder_for')
    .optional()
    .isIn(['Zoroastrian', 'Gregorian', 'Both'])
    .withMessage('Reminder for must be Zoroastrian, Gregorian, or Both')
];

// =============================================
// EVENT CONTROLLER
// =============================================

// @desc    Create a new event
const handleCreateEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const { name, category, customCategory, eventDate, beforeSunrise, reminder_days, reminder_time_hour, reminder_time_ampm, reminder_for } = req.body;

    // Use custom category if provided and category is "Other"
    const finalCategory = (category === 'Other' && customCategory) ? customCategory : category;

    // Create new event
    const event = new Event({
      name,
      category: finalCategory,
      eventDate: new Date(eventDate),
      beforeSunrise,
      reminder_days: reminder_days || 0,
      reminder_time_hour: reminder_time_hour || 12,
      reminder_time_ampm: reminder_time_ampm || 'PM',
      reminder_for: reminder_for || 'Zoroastrian',
      createdBy: req.user.userId
    });

    await event.save();

    // Send immediate reminder if event is within reminder period
    if (reminder_days && reminder_days > 0) {
      try {
        const reminderScheduler = require('../utils/reminderScheduler');
        const user = await User.findById(req.user.userId);
        const sentReminder = await reminderScheduler.sendImmediateReminderIfNeeded(event, user);
        
        if (sentReminder) {
          console.log(`📧 Immediate reminder sent for event: ${event.name}`);
        }
      } catch (reminderError) {
        // Don't fail event creation if reminder fails
        console.error('Failed to send immediate reminder:', reminderError.message);
      }
    }

    res.status(201).json(successResponse(
      'Event created successfully',
      event.getPublicData(),
      201
    ));

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json(errorResponse('Server error while creating event'));
  }
};

// @desc    Get all user's events with pagination and filtering
const handleGetAllEvents = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const { page = 1, limit = 10, category, search, upcoming } = req.query;
    const { offset, limit: queryLimit } = getPagination(page, limit);

    let events;
    let totalCount;

    // Handle different query types
    if (search) {
      // Search by name
      events = await Event.searchByName(search, req.user.userId)
        .limit(queryLimit)
        .skip(offset)
        .populate('createdBy', 'name email');
      
      totalCount = await Event.find({
        $text: { $search: search },
        createdBy: req.user.userId
      }).countDocuments();

    } else if (category) {
      // Filter by category
      events = await Event.find({ 
        category, 
        createdBy: req.user.userId
      }).sort({ eventDate: 1 })
        .limit(queryLimit)
        .skip(offset)
        .populate('createdBy', 'name email');
      
      totalCount = await Event.countDocuments({
        category,
        createdBy: req.user.userId
      });

    } else if (upcoming) {
      // Get upcoming events - simplified since we removed the complex aggregation
      events = await Event.findByUser(req.user.userId)
        .limit(queryLimit)
        .skip(offset)
        .populate('createdBy', 'name email');
      
      totalCount = await Event.countDocuments({
        createdBy: req.user.userId
      });

    } else {
      // Get all events
      events = await Event.findByUser(req.user.userId)
        .limit(queryLimit)
        .skip(offset)
        .populate('createdBy', 'name email');
      
      totalCount = await Event.countDocuments({
        createdBy: req.user.userId
      });
    }

    res.json(successResponse(
      'Events retrieved successfully',
      paginatedResponse(events, totalCount, page, limit)
    ));

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json(errorResponse('Server error while fetching events'));
  }
};

// @desc    Get single event by ID
const handleGetEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    }).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json(errorResponse('Event not found'));
    }

    res.json(successResponse(
      'Event retrieved successfully',
      event.getPublicData()
    ));

  } catch (error) {
    console.error('Get event error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json(errorResponse('Invalid event ID format'));
    }
    
    res.status(500).json(errorResponse('Server error while fetching event'));
  }
};

// @desc    Update event
const handleUpdateEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation errors', errors.array()));
    }

    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!event) {
      return res.status(404).json(errorResponse('Event not found'));
    }

    // Update fields
    const { name, category, customCategory, eventDate, beforeSunrise, reminder_days, reminder_time_hour, reminder_time_ampm, reminder_for } = req.body;
    
    if (name !== undefined) event.name = name;
    if (category !== undefined) {
      // Use custom category if provided and category is "Other"
      const finalCategory = (category === 'Other' && customCategory) ? customCategory : category;
      event.category = finalCategory;
    }
    if (eventDate !== undefined) event.eventDate = new Date(eventDate);
    if (beforeSunrise !== undefined) event.beforeSunrise = beforeSunrise;
    if (reminder_days !== undefined) event.reminder_days = reminder_days;
    if (reminder_time_hour !== undefined) event.reminder_time_hour = reminder_time_hour;
    if (reminder_time_ampm !== undefined) event.reminder_time_ampm = reminder_time_ampm;
    if (reminder_for !== undefined) event.reminder_for = reminder_for;

    await event.save();

    // Send immediate reminder if reminder_days was updated and event is within reminder period
    if (reminder_days !== undefined && reminder_days > 0) {
      try {
        const reminderScheduler = require('../utils/reminderScheduler');
        const user = await User.findById(req.user.userId);
        const sentReminder = await reminderScheduler.sendImmediateReminderIfNeeded(event, user);
        
        if (sentReminder) {
          console.log(`📧 Immediate reminder sent for updated event: ${event.name}`);
        }
      } catch (reminderError) {
        // Don't fail event update if reminder fails
        console.error('Failed to send immediate reminder:', reminderError.message);
      }
    }

    res.json(successResponse(
      'Event updated successfully',
      event.getPublicData()
    ));

  } catch (error) {
    console.error('Update event error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json(errorResponse('Invalid event ID format'));
    }
    
    res.status(500).json(errorResponse('Server error while updating event'));
  }
};

// @desc    Delete event
const handleDeleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!event) {
      return res.status(404).json(errorResponse('Event not found'));
    }

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.json(successResponse('Event deleted successfully'));

  } catch (error) {
    console.error('Delete event error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json(errorResponse('Invalid event ID format'));
    }
    
    res.status(500).json(errorResponse('Server error while deleting event'));
  }
};

// @desc    Search events by name
const handleSearchEvents = async (req, res) => {
  try {
    const searchTerm = req.params.term.trim();
    
    if (!searchTerm) {
      return res.status(400).json(errorResponse('Search term is required'));
    }

    const events = await Event.find({
      name: { $regex: searchTerm, $options: 'i' },
      createdBy: req.user.userId
    }).sort({ eventDate: 1 })
      .populate('createdBy', 'name email');

    res.json(successResponse(
      `Found ${events.length} events matching "${searchTerm}"`,
      events
    ));

  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json(errorResponse('Server error while searching events'));
  }
};

module.exports = {
  handleCreateEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleSearchEvents,
  createEvent,
  getAllEvents,
  updateEvent,
  auth
};