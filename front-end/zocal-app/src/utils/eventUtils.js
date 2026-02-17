/**
 * Utility functions for event date calculations
 */

/**
 * Calculate the number of years that will be completed at the next occurrence
 * @param {Date} eventDate - The original event date
 * @param {Date} currentDate - The current date (default: today)
 * @returns {number} Number of years that will be completed at next instance
 */
export const calculateYears = (eventDate, currentDate = new Date()) => {
  const event = new Date(eventDate);
  const current = new Date(currentDate);
  
  // Reset time to start of day for accurate comparison
  event.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  // If today is their birthday (same month and day), return current age
  if (event.getMonth() === current.getMonth() && event.getDate() === current.getDate()) {
    return current.getFullYear() - event.getFullYear();
  }
  
  let years = current.getFullYear() - event.getFullYear();
  
  // Adjust if birthday hasn't occurred this year yet
  const monthDiff = current.getMonth() - event.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && current.getDate() < event.getDate())) {
    years--;
  }
  
  // Add 1 to show years that will be completed at next occurrence
  return Math.max(1, years + 1);
};

/**
 * Calculate the next occurrence of an annual event
 * @param {Date} eventDate - The original event date
 * @param {Date} currentDate - The current date (default: today)
 * @returns {Date} Next occurrence date
 */
export const getNextOccurrence = (eventDate, currentDate = new Date()) => {
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
 * @returns {string|number} "Today" if 0 days remaining, otherwise number of days remaining
 */
export const calculateDaysRemaining = (eventDate, currentDate = new Date()) => {
  const current = new Date(currentDate);
  const nextOccurrence = getNextOccurrence(eventDate, current);
  
  // Reset time to start of day for both dates
  current.setHours(0, 0, 0, 0);
  nextOccurrence.setHours(0, 0, 0, 0);
  
  const diffTime = nextOccurrence - current;
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return days === 0 ? "Today" : days;
};

/**
 * Format date in DD MMM YYYY format (e.g., "05 Dec 2020")
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date) => {
  const dateObj = new Date(date);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  
  return `${day} ${month} ${year}`;
};

/**
 * Check if a date is valid and within the allowed range (today and before, up to 100 years ago)
 * @param {Date|string} date - The date to validate
 * @returns {object} Validation result with isValid boolean and error message
 */
export const validateEventDate = (date) => {
  try {
    const dateObj = new Date(date);
    const today = new Date();
    const maxPastDate = new Date();
    maxPastDate.setFullYear(today.getFullYear() - 100);
    
    // Set time to start of day for fair comparison
    today.setHours(23, 59, 59, 999);
    dateObj.setHours(0, 0, 0, 0);
    maxPastDate.setHours(0, 0, 0, 0);
    
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    if (dateObj > today) {
      return { isValid: false, error: 'Event date cannot be in the future' };
    }
    
    if (dateObj < maxPastDate) {
      return { isValid: false, error: 'Event date cannot be more than 100 years ago' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid date' };
  }
};