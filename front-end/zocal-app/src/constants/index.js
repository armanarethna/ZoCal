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
// TOOLTIP CONSTANTS
// =============================================

// Tooltip text for various components
export const TOOLTIP_TEXT = {
  ROJ_CALCULATOR: `Convert Gregorian dates to the Zoroastrian calendar system. 
    The calculator determines the Roj (day name) and Mah (month name) according to the selected calendar type. 
    Use 'Before sunrise' option if the time is before sunrise on the selected date, as Zoroastrian days begin at sunrise.`,
  EVENTS_TAB: `The Events tab displays your saved events including calculated Zoroastrian calendar details. 
    Events are sorted by their next occurrence date for Zoroastrian event date. 
    Calendar type determines which Zoroastrian calendar system is used. 
    Roj (day name) and Mah (month name) are determined based on the event date and selected calendar type.`
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

// =============================================
// CALENDAR INFORMATION
// =============================================

// Common information for all calendars
export const CALENDAR_COMMON_INFO = {
  ROJ: 'Roj (R): refers to day names. There are 30 in each month.',
  MAH: 'Mah (M): refers to month names. There are 12 in each year.',
  GATHA: 'Gatha (G): refers to the 5 days of prayers added to complete the solar cycle (365 days) at the end of the year.'
};

// Calendar-specific information
export const CALENDAR_SPECIFIC_INFO = {
  Shenshai: {
    description: 'Shenshai means imperial. Calendar instituted by the Parsis in India in 1129.'
  },
  Kadmi: {
    description: 'Kadmi means ancient. The most ancient of all 3 calendars.'
  },
  Fasli: {
    description: 'Fasli means seasonal. The most recent of all 3 calendars devised by Khurshedji Cama in 1906. Contains an extra Gatha day (leap day) in Gregorian leap years.'
  }
};