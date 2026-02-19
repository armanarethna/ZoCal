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
// ZOROASTRIAN MEANINGS
// =============================================

// Meanings for 30 Rojs (Days)
export const ROJ_MEANINGS = [
  'lord of wisdom',                    // 1. Hormazd
  'good mind',                         // 2. Bahman
  'truth and order',                   // 3. Ardibehesht
  'dominion',                          // 4. Shehervar
  'devotion',                          // 5. Aspandard
  'wholeness or perfection',           // 6. Khordad
  'immortality',                       // 7. Amardad
  'day before fire',                   // 8. Dae-pa-Adar
  'fire',                              // 9. Adar
  'water',                             // 10. Avan
  'sun',                               // 11. Khorshed
  'moon',                              // 12. Mohor
  'the star of Sirius',                // 13. Tir
  'cow or soul of life',               // 14. Gosh
  'day before light',                  // 15. Dae-pa-Meher
  'light',                             // 16. Meher
  'paying attention',                  // 17. Srosh
  'truth',                             // 18. Rashne
  'guardian angel',                    // 19. Fravardin
  'victory or triumph over evil',      // 20. Behram
  'peace or joy',                      // 21. Ram
  'wind or atmosphere',                // 22. Govad
  'day before religion',               // 23. Dae-pa-Din
  'religion',                          // 24. Din
  'blessings or rewards',              // 25. Ashishvangh
  'rectitude or justice',              // 26. Ashtad
  'sky',                               // 27. Asman
  'earth',                             // 28. Zamyad
  'holy word',                         // 29. Mareshpand
  'endless light'                      // 30. Aneran
];

// Meanings for 12 Mahs (Months)
export const MAH_MEANINGS = [
  'guardian angel',                    // 1. Fravardin
  'truth and order',                   // 2. Ardibehesht
  'wholeness or perfection',           // 3. Khordad
  'the star of Sirius',                // 4. Tir
  'immortality',                       // 5. Amardad
  'dominion',                          // 6. Shehrevar
  'light',                             // 7. Meher
  'water',                             // 8. Avan
  'fire',                              // 9. Adar
  'creator',                           // 10. Dae
  'good mind',                         // 11. Bahman
  'devotion'                           // 12. Aspandard
];

// Meanings for Gatha Days
export const GATHA_MEANINGS = [
  '1st day of prayers',                // Ahunavaiti
  '2nd day of prayers',                // Ushtavaiti
  '3rd day of prayers',                // Spentamainyu
  '4th day of prayers',                // Vohuxshathra
  '5th day of prayers',                // Vahishtoishti
  'leap day prayers'                   // Avardad-sal-Gah
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

// =============================================
// TOOLTIP CONSTANTS
// =============================================

// Tooltip text for various components
export const TOOLTIP_TEXT = {
  ROJ_CALCULATOR: `Convert Gregorian dates to the Zoroastrian calendar system. 
    The calculator determines Zoroastrian details based on date and selected calendar type. 
    'Before sunrise' option is provided, as Zoroastrian days begin at sunrise.`,
  EVENTS_TAB: `The Events tab displays your saved events with both Gregorian and Zoroastrian details. 
    Events are sorted by their next occurrence date for Zoroastrian event date. 
    Calendar type determines which Zoroastrian calendar system is used.`,
  BEFORE_SUNRISE: `'Before sunrise' option is provided, as Zoroastrian days begin at sunrise.`,
  REMINDER_INFO: `Reminders will be sent to the registered email address at selected time (timezone can be changed in settings). Reminder email will also contain calendar link to add to google calendar. Reminders can be set up for Gregorian, Zoroastrian or both events.`
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