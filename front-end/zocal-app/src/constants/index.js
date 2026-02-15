// Frontend Constants - Centralized location for all constant values

// =============================================
// CALENDAR CONSTANTS
// =============================================

// Gregorian Month Names
export const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Day of Week Names
export const WEEKDAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Zoroastrian Calendar Types
export const ZOROASTRIAN_CALENDAR_TYPES = ['Shenshai', 'Kadmi', 'Fasli'];

export const ZOROASTRIAN_CALENDAR_TYPES_ENUM = {
  SHENSHAI: 'Shenshai',
  KADMI: 'Kadmi', 
  FASLI: 'Fasli'
};

// =============================================
// ZOROASTRIAN CALENDAR NAMES
// =============================================

// Names of 12 Mahs (Months)
export const MAH_NAMES = [
  'Fravardin',
  'Ardibehesht', 
  'Khordad',
  'Tir',
  'Amardad',
  'Shehrevar',
  'Meher',
  'Avan',
  'Adar',
  'Dae',
  'Bahman',
  'Aspandard'
];

// Names of 30 Rojs (Days)
export const ROJ_NAMES = [
  'Hormazd',
  'Bahman',
  'Ardibehesht',
  'Shehrevar',
  'Aspandard',
  'Khordad',
  'Amardad',
  'Dae-Pa-Adar',
  'Adar',
  'Avan',
  'Khorshed',
  'Mohor',
  'Tir',
  'Gosh',
  'Dae-Pa-Meher',
  'Meher',
  'Srosh',
  'Rashne',
  'Fravardin',
  'Behram',
  'Ram',
  'Govad',
  'Dae-Pa-Din',
  'Din',
  'Ashishvangh',
  'Ashtad',
  'Asman',
  'Zamyad',
  'Mareshpand',
  'Aneran'
];

// Names of 5 Gathas + 1 extra for Fasli leap years
export const GATHA_NAMES = [
  'Ahunavaiti',
  'Ushtavaiti', 
  'Spentamainyu',
  'Vohuxshathra',
  'Vahishtoishti',
  'Avardad-sal-Gah'  // Extra gatha for Fasli leap years
];

// =============================================
// USER PREFERENCES
// =============================================

// Display Mode Options
export const DISPLAY_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Default Zoroastrian Calendar Options
export const DEFAULT_ZORO_CAL_OPTIONS = {
  SHENSHAI: 'Shenshai',
  KADMI: 'Kadmi',
  FASLI: 'Fasli'
};

// =============================================
// UI CONSTANTS
// =============================================

// Validation Messages
export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_LENGTH: 'Name must be between 2 and 50 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_COMPLEXITY: 'Password must contain at least one lowercase, one uppercase letter and one number',
  PASSWORDS_DONT_MATCH: 'Passwords do not match'
};

// =============================================
// APP CONFIGURATION
// =============================================

// Default Values
export const DEFAULTS = {
  CALENDAR_TYPE: 'Shenshai',
  DISPLAY_MODE: 'light',
  TAB_VALUE: 1, // Calendar tab
  SNACKBAR_DURATION: 6000
};