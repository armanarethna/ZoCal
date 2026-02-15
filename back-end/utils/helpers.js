const jwt = require('jsonwebtoken');

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token
 * @param {String} expiresIn - Token expiration time
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generate a random string
 * @param {Number} length - Length of the string
 * @returns {String} Random string
 */
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user input
 * @param {String} input - String to sanitize
 * @returns {String} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potentially dangerous characters
    .slice(0, 1000); // Limit length
};

/**
 * Format success response
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
const successResponse = (message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return response;
};

/**
 * Format error response
 * @param {String} message - Error message
 * @param {Array} errors - Validation errors
 * @param {Number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
const errorResponse = (message, errors = null, statusCode = 400) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return response;
};

/**
 * Calculate pagination values
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination values
 */
const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  return {
    offset,
    limit: parseInt(limit),
    page: parseInt(page)
  };
};

/**
 * Format pagination response
 * @param {Array} data - Data array
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Paginated response
 */
const paginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {String} Formatted date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if date is in the past
 * @param {Date} date - Date to check
 * @returns {Boolean} Is in past
 */
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Get date range for filtering
 * @param {String} period - Time period (today, week, month, year)
 * @returns {Object} Start and end dates
 */
const getDateRange = (period) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start: startOfDay,
        end: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)
      };
    
    case 'week':
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      return {
        start: startOfWeek,
        end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
      };
    
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return {
        start: startOfMonth,
        end: endOfMonth
      };
    
    case 'year':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return {
        start: startOfYear,
        end: endOfYear
      };
    
    default:
      return {
        start: startOfDay,
        end: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)
      };
  }
};

/**
 * Calculate the next occurrence of an annual event
 * @param {Date} eventDate - The original event date
 * @param {Date} currentDate - The current date (default: today)
 * @returns {Date} Next occurrence date
 */
const getNextOccurrence = (eventDate, currentDate = new Date()) => {
  const event = new Date(eventDate);
  const current = new Date(currentDate);
  
  // Reset current date to start of day for accurate comparison
  current.setHours(0, 0, 0, 0);
  
  const nextOccurrence = new Date(current.getFullYear(), event.getMonth(), event.getDate());
  nextOccurrence.setHours(0, 0, 0, 0);
  
  // If the event has already passed this year, move to next year
  if (nextOccurrence < current) {
    nextOccurrence.setFullYear(current.getFullYear() + 1);
  }
  
  return nextOccurrence;
};

/**
 * Calculate days remaining until the next occurrence of an event
 * @param {Date} eventDate - The original event date
 * @param {Date} currentDate - The current date (default: today)
 * @returns {number} Number of days remaining
 */
const calculateDaysRemaining = (eventDate, currentDate = new Date()) => {
  const current = new Date(currentDate);
  const nextOccurrence = getNextOccurrence(eventDate, current);
  
  // Reset time to start of day for both dates
  current.setHours(0, 0, 0, 0);
  nextOccurrence.setHours(0, 0, 0, 0);
  
  const diffTime = nextOccurrence - current;
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return days;
};

module.exports = {
  generateToken,
  generateRandomString,
  isValidEmail,
  sanitizeInput,
  successResponse,
  errorResponse,
  getPagination,
  paginatedResponse,
  asyncHandler,
  formatDate,
  isPastDate,
  getDateRange,
  getNextOccurrence,
  calculateDaysRemaining
};