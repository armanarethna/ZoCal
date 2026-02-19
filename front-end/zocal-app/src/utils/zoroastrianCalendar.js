// Zoroastrian Calendar Names and Conversion Functions
import { MAH_NAMES, ROJ_NAMES, GATHA_NAMES, ZOROASTRIAN_CALENDAR_TYPES_ENUM } from '../constants';

// Export the constants for backward compatibility
export const mahNames = MAH_NAMES;
export const rojNames = ROJ_NAMES;
export const gathaNames = GATHA_NAMES;
export const calendarTypes = ZOROASTRIAN_CALENDAR_TYPES_ENUM;

// Reference start dates (Hormazd roj, Fravardin mah) - set to noon
const REFERENCE_DATES = {
  // Shenshai: September 9, 1926
  SHENSHAI: new Date(1926, 8, 9, 12, 0, 0, 0), // Month is 0-indexed, so 8 = September
  // Kadmi: August 10, 1926 
  KADMI: new Date(1926, 7, 10, 12, 0, 0, 0), // Month is 0-indexed, so 7 = August
};

// Helper function to check if a year is a leap year
export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

// Convert Gregorian date to Zoroastrian date
export const gregorianToZoroastrian = (gregorianDate, calendarType = 'Shenshai', beforeSunrise = false) => {
  const date = new Date(gregorianDate);
  date.setHours(12, 0, 0, 0);
  
  if (beforeSunrise) {
    date.setDate(date.getDate() - 1);
  }
  
  // Handle Fasli calendar (rebuilt from scratch)
  if (calendarType === 'Fasli') {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const day = date.getDate();
    
    // Determine which Zoroastrian year this date belongs to
    let zoroastrianYearStart;
    if (month > 2 || (month === 2 && day >= 21)) {
      // On/after March 21: belongs to Zoroastrian year starting this Gregorian year
      zoroastrianYearStart = new Date(year, 2, 21); // March 21 of current year
    } else {
      // Before March 21: belongs to Zoroastrian year starting previous Gregorian year
      zoroastrianYearStart = new Date(year - 1, 2, 21); // March 21 of previous year
    }
    
    // Calculate days since Zoroastrian year start (0-based)
    const daysDiff = Math.floor((date.getTime() - zoroastrianYearStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Determine if this is a leap year (based on the year when this Zoroastrian year ends)
    const zoroastrianEndYear = zoroastrianYearStart.getFullYear() + 1;
    const isCurrentYearLeap = isLeapYear(zoroastrianEndYear);
    
    // Fasli structure: 360 regular days + 5/6 Gatha days
    if (daysDiff >= 360) {
      // Gatha days (360-364 for normal year, 360-365 for leap year)
      const gathaIndex = daysDiff - 360;
      const maxGathas = isCurrentYearLeap ? 6 : 5;
      
      if (gathaIndex < maxGathas) {
        return {
          roj: gathaNames[gathaIndex],
          mah: 'Gatha',
          isGatha: true,
          rojIndex: gathaIndex,
          mahIndex: -1
        };
      }
    }
    
    // Regular days (0-359: 12 months × 30 days each)
    const mahIndex = Math.floor(daysDiff / 30);
    const rojIndex = daysDiff % 30;
    
    return {
      roj: rojNames[rojIndex],
      mah: mahNames[mahIndex],
      isGatha: false,
      rojIndex: rojIndex,
      mahIndex: mahIndex
    };
  }
  
  // Handle Shenshai and Kadmi (simplified approach)
  const referenceDate = calendarType === 'Shenshai' ? REFERENCE_DATES.SHENSHAI : REFERENCE_DATES.KADMI;
  const daysSinceReference = Math.round((date - referenceDate) / (1000 * 60 * 60 * 24));
  
  // Each Zoroastrian year is exactly 365 days, so find position in current year
  const dayInYear = ((daysSinceReference % 365) + 365) % 365;
  
  // Convert to roj and mah
  if (dayInYear >= 360) {
    // Gatha days (360-364)
    const gathaIndex = dayInYear - 360;
    return {
      roj: gathaNames[gathaIndex],
      mah: 'Gatha',
      isGatha: true,
      rojIndex: gathaIndex,
      mahIndex: -1
    };
  }
  
  // Regular days (0-359)
  const mahIndex = Math.floor(dayInYear / 30);
  const rojIndex = dayInYear % 30;
  
  return {
    roj: rojNames[rojIndex],
    mah: mahNames[mahIndex],
    isGatha: false,
    rojIndex: rojIndex,
    mahIndex: mahIndex
  };
};

// Helper function to find the next 6th Gatha date for Fasli calendar
export const findNext6thGathaDate = (startDate) => {
  const currentYear = startDate.getFullYear();
  
  // Check if current year is a leap year and if the 6th Gatha hasn't passed yet
  if (isLeapYear(currentYear)) {
    // In Fasli, the 6th Gatha falls on March 20th of the leap year
    const currentYearSixthGatha = new Date(currentYear, 2, 20); // March 20th (0-indexed month)
    if (currentYearSixthGatha > startDate) {
      return currentYearSixthGatha;
    }
  }
  
  // Find the next leap year
  let nextLeapYear = currentYear + 1;
  while (!isLeapYear(nextLeapYear)) {
    nextLeapYear++;
  }
  
  // The 6th Gatha in Fasli calendar falls on March 20th of the leap year
  return new Date(nextLeapYear, 2, 20); // March 20th (0-indexed month)
};

// Helper function to find next occurrence date by direct search
export const findNextOccurrenceDate = (targetRoj, targetMah, isGatha, startDate, calendarType) => {
  try {
    // Special handling for 6th Gatha (Avardad-sal-Gah) which only occurs in leap years
    if (isGatha && targetRoj === 'Avardad-sal-Gah' && calendarType === 'Fasli') {
      return findNext6thGathaDate(startDate);
    }
    
    const searchStartDate = new Date(startDate);
    searchStartDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    
    // Search up to 400 days in the future (covers more than one full year)
    // For 6th Gatha in non-Fasli calendars or other dates
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
    
    return null; // No match found within search range
  } catch (error) {
    console.error('Error in findNextOccurrenceDate:', error);
    return null;
  }
};

// Convert Gregorian event to Zoroastrian calendar with Roj and Mah
export const convertEventToZoroastrian = (event, calendarType) => {
  try {
    const eventDate = new Date(event.eventDate);
    const zoroastrianResult = gregorianToZoroastrian(eventDate, calendarType, event.beforeSunrise);
    
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
};

// Calculate days remaining until next occurrence of Roj/Mah combination
export const calculateZoroastrianDaysRemaining = (event, calendarType) => {
  try {
    const zoroEvent = convertEventToZoroastrian(event, calendarType);
    const today = new Date();
    
    if (zoroEvent.roj === 'N/A') {
      return 'N/A';
    }

    // Get current Zoroastrian date using same parameters as event conversion
    const currentZoro = gregorianToZoroastrian(today, calendarType, false);
    
    // Check if today matches the event's roj/mah
    if (zoroEvent.isGatha && currentZoro.isGatha && zoroEvent.roj === currentZoro.roj) {
      return "Today";
    } else if (!zoroEvent.isGatha && !currentZoro.isGatha && 
               zoroEvent.roj === currentZoro.roj && zoroEvent.mah === currentZoro.mah) {
      return "Today";
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
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    }
    
    return 'Calculating...';
    
  } catch (error) {
    console.error('Error calculating Zoroastrian days remaining:', error);
    return 'N/A';
  }
};

// Calculate next Gregorian date for Roj/Mah combination
export const calculateNextGregorianDate = (event, calendarType, formatDisplayDate) => {
  try {
    const zoroEvent = convertEventToZoroastrian(event, calendarType);
    const today = new Date();
    
    if (zoroEvent.roj === 'N/A') {
      return 'N/A';
    }

    // Get current Zoroastrian date
    const currentZoro = gregorianToZoroastrian(today, calendarType, false);
    
    // Check if today matches the event's roj/mah
    if (zoroEvent.isGatha && currentZoro.isGatha && zoroEvent.roj === currentZoro.roj) {
      return formatDisplayDate(today);
    } else if (!zoroEvent.isGatha && !currentZoro.isGatha && 
               zoroEvent.roj === currentZoro.roj && zoroEvent.mah === currentZoro.mah) {
      return formatDisplayDate(today);
    }

    // Find the next occurrence by checking future dates
    const nextDate = findNextOccurrenceDate(zoroEvent.roj, zoroEvent.mah, zoroEvent.isGatha, today, calendarType);
    return nextDate ? formatDisplayDate(nextDate) : 'Calculating...';
    
  } catch (error) {
    console.error('Error calculating next Gregorian date:', error);
    return 'N/A';
  }
};

// Sort events by their next Zoroastrian occurrence (closest first)
export const sortEventsByZoroastrianOccurrence = (events, calendarType) => {
  return events.sort((a, b) => {
    const daysA = calculateZoroastrianDaysRemaining(a, calendarType);
    const daysB = calculateZoroastrianDaysRemaining(b, calendarType);
    
    // Handle special cases
    if (daysA === "Today") return -1;
    if (daysB === "Today") return 1;
    if (daysA === 'N/A') return 1;
    if (daysB === 'N/A') return -1;
    if (daysA === 'Calculating...') return 1;
    if (daysB === 'Calculating...') return -1;
    
    // Extract numeric values from "X days" format
    const numA = typeof daysA === 'string' ? parseInt(daysA.replace(' days', '').replace(' day', '')) : daysA;
    const numB = typeof daysB === 'string' ? parseInt(daysB.replace(' days', '').replace(' day', '')) : daysB;
    
    return numA - numB;
  });
};

// Get special date information for Zoroastrian dates
export const getSpecialDateInfo = (zoroastrianDate, gregorianDate, calendarType) => {
  const { roj, mah, rojIndex, mahIndex } = zoroastrianDate;

  // Check special dates in priority order
  
  // 1. Nowruz (Zoroastrian): Roj Hormazd, Mah Fravardin
  if (rojIndex === 0 && mahIndex === 0) { // Hormazd roj, Fravardin mah
    return {
      name: 'Nowruz',
      description: "New year's day",
      type: 'nowruz-zoroastrian',
      color: 'green'
    };
  }

  // 2. Khordad Saal: Roj Khordad, Mah Fravardin
  if (roj === 'Khordad' && mah === 'Fravardin') {
    return {
      name: 'Khordad Saal',
      description: "Zarathushtra's birth",
      type: 'khordad-saal',
      color: 'lightgrey'
    };
  }

  // 3. Zarthost no Diso: Roj Khorshed, Mah Dae
  if (roj === 'Khorshed' && mah === 'Dae') {
    return {
      name: 'Zarthost no Diso',
      description: "Zarathushtra's death anniversary",
      type: 'zarthost-no-diso',
      color: 'brown'
    };
  }

  // 4. Nowruz (Gregorian): 21st March for Shenshai, Kadmi
  if ((calendarType === 'Shenshai' || calendarType === 'Kadmi') && gregorianDate) {
    const month = gregorianDate.getMonth();
    const day = gregorianDate.getDate();
    if (month === 2 && day === 21) { // March 21 (0-indexed month)
      return {
        name: 'Nowruz',
        description: 'First day of Spring / Spring equinox',
        type: 'nowruz-gregorian',
        color: 'green'
      };
    }
  }

  // 5. Gatha days
  if (zoroastrianDate.isGatha) {
    return {
      type: 'Gatha',
      color: 'purple'
    };
  }

  // 6. Jashans: When Roj and Mah match
  if (roj === mah) {
    return {
      name: `${roj} Jashan`,
      description: null,
      type: 'jashan',
      border: 'green'
    };
  }

  // 7. First day of month: Hormazd roj of each month
  if (rojIndex === 0 && mahIndex > 0) { // Hormazd roj, but not Fravardin mah (already covered by Nowruz)
    return {
      name: `First day of ${mah} mah`,
      description: null,
      type: 'first-day-month',
      border: 'yellow'
    };
  }

  return null;
};

// Check if a date is in Muktad period (5 days before Gatha, days 356-360)
export const isMuktadPeriod = (zoroastrianDate, dayInYear) => {
  if (zoroastrianDate.isGatha) {
    return false; // Gatha days themselves are not Muktad
  }
  
  // For non-Gatha days, check if we're in days 356-360 (0-indexed would be 355-359)
  // In the conversion function, dayInYear goes from 0-359 for regular days, then 360+ for Gatha
  return dayInYear >= 355 && dayInYear <= 359;
};

// Determine the type of Zoroastrian day
export const zoroDayType = (zoroastrianDate, gregorianDate = null, calendarType = 'Shenshai') => {
  if (zoroastrianDate.isGatha) {
    return 'Gatha';
  }

  // First check for Muktad period (has priority over other special dates)
  // We need to calculate day in year to check for Muktad
  const dayInYear = zoroastrianDate.mahIndex * 30 + zoroastrianDate.rojIndex;
  if (isMuktadPeriod(zoroastrianDate, dayInYear)) {
    return 'Muktad';
  }

  // Check for other special dates
  const specialDate = getSpecialDateInfo(zoroastrianDate, gregorianDate, calendarType);
  if (specialDate) {
    return specialDate.type;
  }

  return 'Default';
};