// =============================================
// ZOROASTRIAN CALENDAR UTILITIES
// =============================================
// Functions to convert Gregorian dates to Zoroastrian calendar information
// Based on frontend implementation for consistency

// Names of 12 Mahs (Months)
const mahNames = [
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
const rojNames = [
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

// Names of 5 Gatha days
const gathaNames = [
  'Ahunavaiti Gatha',
  'Ushtavaiti Gatha', 
  'Spentamainyui Gatha',
  'Vohukhshathra Gatha',
  'Vahishtoishti Gatha',
  'Avardad-sal-Gah' // 6th Gatha for leap years in Fasli
];

// Reference dates for accurate calendar calculations (matching frontend)
const REFERENCE_DATES = {
  SHENSHAI: new Date(2023, 7, 16), // August 16, 2023 (Roj: Hormazd, Mah: Fravardin)
  KADMI: new Date(2023, 6, 17)     // July 17, 2023 (Roj: Hormazd, Mah: Fravardin)
};

// Check if a year is a leap year
function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
}

/**
 * Convert Gregorian date to Zoroastrian calendar
 * @param {Date} gregorianDate - The Gregorian date
 * @param {string} calendarType - 'Shenshai', 'Kadmi', or 'Fasli'
 * @param {boolean} beforeSunrise - Whether the event is before sunrise
 * @returns {Object} Object containing roj, mah, and other info
 */
function gregorianToZoroastrian(gregorianDate, calendarType = 'Shenshai', beforeSunrise = false) {
  try {
    let date = new Date(gregorianDate);
    
    // Adjust for before sunrise events
    if (beforeSunrise) {
      date = new Date(date);
      date.setDate(date.getDate() - 1);
    }
    
    // Set time to noon for consistent calculations
    date.setHours(12, 0, 0, 0);

    if (calendarType === 'Fasli') {
      return calculateFasliDate(date);
    } else if (calendarType === 'Shenshai' || calendarType === 'Kadmi') {
      return calculateTraditionalDate(date, calendarType);
    }
    
    // Default to Shenshai if unknown calendar type
    return calculateTraditionalDate(date, 'Shenshai');
    
  } catch (error) {
    console.error('Error in gregorianToZoroastrian:', error);
    return {
      roj: 'Hormazd',
      mah: 'Fravardin',
      isGatha: false,
      rojIndex: 0,
      mahIndex: 0
    };
  }
}

// Calculate Fasli calendar date
function calculateFasliDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  let zoroastrianYearStart;
  
  if (month > 2 || (month === 2 && day >= 21)) {
    zoroastrianYearStart = new Date(year, 2, 21);
  } else {
    zoroastrianYearStart = new Date(year - 1, 2, 21);
  }
  
  const daysDiff = Math.floor((date.getTime() - zoroastrianYearStart.getTime()) / (1000 * 60 * 60 * 24));
  const zoroastrianEndYear = zoroastrianYearStart.getFullYear() + 1;
  const isLeap = isLeapYear(zoroastrianEndYear);
  
  if (daysDiff >= 360) {
    const gathaIndex = daysDiff - 360;
    const maxGathas = isLeap ? 6 : 5;
    
    if (gathaIndex < maxGathas) {
      return {
        roj: gathaNames[gathaIndex],
        mah: 'Gatha Days',
        isGatha: true,
        rojIndex: gathaIndex,
        mahIndex: -1
      };
    }
  }
  
  const mahIndex = Math.floor(daysDiff / 30);
  const rojIndex = daysDiff % 30;
  
  return {
    roj: rojNames[rojIndex] || rojNames[0],
    mah: mahNames[mahIndex] || mahNames[0], 
    isGatha: false,
    rojIndex: rojIndex,
    mahIndex: mahIndex
  };
}

// Calculate traditional calendar date (Shenshai/Kadmi)
function calculateTraditionalDate(date, calendarType) {
  const referenceDate = calendarType === 'Shenshai' ? REFERENCE_DATES.SHENSHAI : REFERENCE_DATES.KADMI;
  
  const daysSinceReference = Math.floor((date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayInYear = ((daysSinceReference % 365) + 365) % 365;
  
  if (dayInYear >= 360) {
    const gathaIndex = dayInYear - 360;
    return {
      roj: gathaNames[gathaIndex],
      mah: 'Gatha Days',
      isGatha: true,
      rojIndex: gathaIndex,
      mahIndex: -1
    };
  }
  
  const mahIndex = Math.floor(dayInYear / 30);
  const rojIndex = dayInYear % 30;
  
  return {
    roj: rojNames[rojIndex],
    mah: mahNames[mahIndex],
    isGatha: false,
    rojIndex: rojIndex,
    mahIndex: mahIndex
  };
}

/**
 * Convert Gregorian event to Zoroastrian calendar 
 */
function convertEventToZoroastrian(event, calendarType) {
  try {
    const eventDate = new Date(event.eventDate);
    const zoroastrianResult = gregorianToZoroastrian(eventDate, calendarType, event.beforeSunrise || false);
    
    return {
      ...event,
      roj: zoroastrianResult.roj,
      mah: zoroastrianResult.mah,
      isGatha: zoroastrianResult.isGatha
    };
  } catch (error) {
    console.error('Error converting event to Zoroastrian calendar:', error);
    return {
      ...event,
      roj: 'N/A',
      mah: 'N/A',
      isGatha: false
    };
  }
}

/**
 * Find next occurrence date by direct search
 */
function findNextOccurrenceDate(targetRoj, targetMah, isGatha, startDate, calendarType) {
  try {
    // Search up to 400 days in the future
    for (let daysToAdd = 1; daysToAdd <= 400; daysToAdd++) {
      const testDate = new Date(startDate);
      testDate.setDate(startDate.getDate() + daysToAdd);
      
      const zoroResult = gregorianToZoroastrian(testDate, calendarType, false);
      
      if (isGatha && zoroResult.isGatha && zoroResult.roj === targetRoj) {
        return testDate;
      } else if (!isGatha && !zoroResult.isGatha && 
                 zoroResult.roj === targetRoj && zoroResult.mah === targetMah) {
        return testDate;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in findNextOccurrenceDate:', error);
    return null;
  }
}

/**
 * Calculate next Gregorian date for Roj/Mah combination (for Falls On)
 */
function calculateNextGregorianDate(event, calendarType) {
  try {
    const zoroEvent = convertEventToZoroastrian(event, calendarType);
    const today = new Date();
    
    if (zoroEvent.roj === 'N/A') {
      return null;
    }

    // Get current Zoroastrian date
    const currentZoro = gregorianToZoroastrian(today, calendarType, false);
    
    // Check if today matches the event's roj/mah
    if (zoroEvent.isGatha && currentZoro.isGatha && zoroEvent.roj === currentZoro.roj) {
      return today;
    } else if (!zoroEvent.isGatha && !currentZoro.isGatha && 
               zoroEvent.roj === currentZoro.roj && zoroEvent.mah === currentZoro.mah) {
      return today;
    }

    // Find the next occurrence by checking future dates
    const nextDate = findNextOccurrenceDate(zoroEvent.roj, zoroEvent.mah, zoroEvent.isGatha, today, calendarType);
    return nextDate;
    
  } catch (error) {
    console.error('Error calculating next Gregorian date:', error);
    return null;
  }
}

/**
 * Legacy functions for backward compatibility
 */
function getRojMahFromDate(gregorianDate, calendarType = 'Shenshai') {
  const result = gregorianToZoroastrian(gregorianDate, calendarType);
  if (result.isGatha) {
    return null; // Gatha day
  }
  return {
    roj: result.roj,
    mah: result.mah
  };
}

function getGathaFromDate(gregorianDate, calendarType = 'Shenshai') {
  const result = gregorianToZoroastrian(gregorianDate, calendarType);
  if (result.isGatha) {
    return {
      name: result.roj,
      day: result.rojIndex + 1
    };
  }
  return null;
}

function getZoroastrianDateInfo(gregorianDate, calendarType = 'Shenshai') {
  const result = gregorianToZoroastrian(gregorianDate, calendarType);
  
  if (result.isGatha) {
    return {
      type: 'gatha',
      gatha: result.roj,
      gathaDay: result.rojIndex + 1,
      roj: null,
      mah: null,
      calendarType: calendarType
    };
  } else {
    return {
      type: 'regular',
      gatha: null,
      gathaDay: null,
      roj: result.roj,
      mah: result.mah,
      calendarType: calendarType
    };
  }
}

/**
 * Calculate days remaining until next Zoroastrian occurrence of an event
 */
function calculateZoroastrianDaysRemaining(event, calendarType) {
  try {
    const zoroEvent = convertEventToZoroastrian(event, calendarType);
    const today = new Date();
    
    if (zoroEvent.roj === 'N/A') {
      return -1; // Invalid event
    }

    // Get current Zoroastrian date
    const currentZoro = gregorianToZoroastrian(today, calendarType, false);
    
    // Check if today matches the event's roj/mah
    if (zoroEvent.isGatha && currentZoro.isGatha && zoroEvent.roj === currentZoro.roj) {
      return 0; // Today
    } else if (!zoroEvent.isGatha && !currentZoro.isGatha && 
               zoroEvent.roj === currentZoro.roj && zoroEvent.mah === currentZoro.mah) {
      return 0; // Today
    }

    // Find the next occurrence by checking future dates
    const nextDate = findNextOccurrenceDate(zoroEvent.roj, zoroEvent.mah, zoroEvent.isGatha, today, calendarType);
    if (nextDate) {
      // Set both dates to noon to get accurate day difference
      const todayAtNoon = new Date(today);
      todayAtNoon.setHours(12, 0, 0, 0);
      const nextDateAtNoon = new Date(nextDate);
      nextDateAtNoon.setHours(12, 0, 0, 0);
      
      const diffTime = nextDateAtNoon.getTime() - todayAtNoon.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    
    return -1; // Could not calculate
    
  } catch (error) {
    console.error('Error calculating Zoroastrian days remaining:', error);
    return -1;
  }
}

module.exports = {
  mahNames,
  rojNames,
  gathaNames,
  gregorianToZoroastrian,
  convertEventToZoroastrian,
  calculateNextGregorianDate,
  calculateZoroastrianDaysRemaining,
  getRojMahFromDate,
  getGathaFromDate,
  getZoroastrianDateInfo
};