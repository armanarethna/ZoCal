// Zoroastrian Calendar Names and Conversion Functions

// Names of 12 Mahs (Months)
export const mahNames = [
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
export const rojNames = [
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
export const gathaNames = [
  'Ahunavaiti',
  'Ushtavaiti', 
  'Spentamainyu',
  'Vohuxshathra',
  'Vahishtoishti',
  'Avardad-sal-Gah'  // Extra gatha for Fasli leap years
];

// Calendar Types
export const calendarTypes = {
  SHENSHAI: 'Shenshai',
  KADMI: 'Kadmi', 
  FASLI: 'Fasli'
};

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

// Debug function to trace calendar calculations
export const debugZoroastrianDate = (gregorianDate, calendarType = 'Shenshai') => {
  const date = new Date(gregorianDate);
  date.setHours(12, 0, 0, 0);
  
  console.log(`\n=== Debug for ${date.toDateString()} (${calendarType}) ===`);
  
  if (calendarType === 'Fasli') {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Determine Zoroastrian year start
    let zoroastrianYearStart;
    if (month > 2 || (month === 2 && day >= 21)) {
      zoroastrianYearStart = new Date(year, 2, 21);
      console.log(`Zoroastrian year starts: March 21, ${year}`);
    } else {
      zoroastrianYearStart = new Date(year - 1, 2, 21);
      console.log(`Zoroastrian year starts: March 21, ${year - 1}`);
    }
    
    const daysDiff = Math.floor((date.getTime() - zoroastrianYearStart.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`Days since Zoroastrian year start: ${daysDiff}`);
    
    const zoroastrianEndYear = zoroastrianYearStart.getFullYear() + 1;
    const isLeap = isLeapYear(zoroastrianEndYear);
    console.log(`Zoroastrian year ends in: ${zoroastrianEndYear} (leap: ${isLeap})`);
    
    if (daysDiff >= 360) {
      const gathaIndex = daysDiff - 360;
      const maxGathas = isLeap ? 6 : 5;
      console.log(`Gatha day: ${daysDiff} -> index ${gathaIndex} (max: ${maxGathas})`);
      if (gathaIndex < maxGathas) {
        console.log(`Gatha: ${gathaNames[gathaIndex]}`);
      }
    } else {
      const mahIndex = Math.floor(daysDiff / 30);
      const rojIndex = daysDiff % 30;
      console.log(`Regular day: ${daysDiff} -> Mah ${mahIndex} (${mahNames[mahIndex]}), Roj ${rojIndex} (${rojNames[rojIndex]})`);
    }
  } else if (calendarType === 'Shenshai' || calendarType === 'Kadmi') {
    const referenceDate = calendarType === 'Shenshai' ? REFERENCE_DATES.SHENSHAI : REFERENCE_DATES.KADMI;
    console.log(`Reference date: ${referenceDate.toDateString()}`);
    
    const daysSinceReference = Math.floor((date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`Days since reference: ${daysSinceReference}`);
    
    const dayInYear = ((daysSinceReference % 365) + 365) % 365;
    console.log(`Day in Zoroastrian year: ${dayInYear}`);
    
    if (dayInYear >= 360) {
      const gathaIndex = dayInYear - 360;
      console.log(`Gatha day: ${gathaNames[gathaIndex]} (index ${gathaIndex})`);
    } else {
      const mahIndex = Math.floor(dayInYear / 30);
      const rojIndex = dayInYear % 30;
      console.log(`Mah: ${mahNames[mahIndex]} (index ${mahIndex})`);
      console.log(`Roj: ${rojNames[rojIndex]} (index ${rojIndex})`);
    }
  }
  
  // Get final result
  const zoroDate = gregorianToZoroastrian(gregorianDate, calendarType);
  console.log(`Final result: ${zoroDate.roj} - ${zoroDate.mah}`);
  
  return zoroDate;
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