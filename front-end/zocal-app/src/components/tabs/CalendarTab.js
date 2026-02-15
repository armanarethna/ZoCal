import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { setYear, setMonth, isSameMonth } from 'date-fns';
import { nextMonth, prevMonth, goToToday, setCurrentDate } from '../../store/calendarSlice';
import CalendarTile from '../molecules/CalendarTile';
import MobileCalendarHeader from '../molecules/MobileCalendarHeader';
import DesktopCalendarHeader from '../molecules/DesktopCalendarHeader';
import { WEEKDAYS_FULL, WEEKDAYS_SHORT, DEFAULTS } from '../../constants';

const CalendarTab = () => {
  const dispatch = useDispatch();
  const { currentDate, calendarDays } = useSelector((state) => state.calendar);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Use user's default calendar preference if authenticated, otherwise default to Shenshai
  const getInitialCalendarType = React.useCallback(() => {
    if (isAuthenticated && user?.default_zoro_cal) {
      return user.default_zoro_cal;
    }
    return DEFAULTS.CALENDAR_TYPE;
  }, [isAuthenticated, user?.default_zoro_cal]);
  
  const [calendarType, setCalendarType] = React.useState(getInitialCalendarType);

  // Update calendar type when user changes or authentication status changes
  React.useEffect(() => {
    setCalendarType(getInitialCalendarType());
  }, [user?.default_zoro_cal, isAuthenticated, getInitialCalendarType]);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  React.useEffect(() => {
    // Initialize calendar days
    dispatch(setCurrentDate(currentDate));
  }, [dispatch, currentDate]);

  const handlePrevMonth = () => {
    dispatch(prevMonth());
  };

  const handleNextMonth = () => {
    dispatch(nextMonth());
  };

  const handleToday = () => {
    dispatch(goToToday());
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    const newDate = setMonth(currentDate, newMonth);
    dispatch(setCurrentDate(newDate));
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    const newDate = setYear(currentDate, newYear);
    dispatch(setCurrentDate(newDate));
  };

  const handleCalendarTypeChange = (event) => {
    setCalendarType(event.target.value);
  };

  const weekdays = isMobile ? WEEKDAYS_SHORT : WEEKDAYS_FULL;
  const today = new Date();
  const isCurrentMonth = isSameMonth(currentDate, today);

  return (
    <Box sx={{ p: isMobile ? 0 : 'inherit' }}>
      {/* Calendar Header */}
      <Paper 
        elevation={2}
        sx={{ 
          p: isMobile ? 0.5 : 1, 
          mt: isMobile ? 2.5 : 0,
          mb: isMobile ? 0.5 : 1,
          backgroundColor: 'var(--background-paper)',
          border: 1,
          borderColor: 'divider'
        }}
      >
        {isMobile ? (
          <MobileCalendarHeader
            currentDate={currentDate}
            calendarType={calendarType}
            isCurrentMonth={isCurrentMonth}
            years={years}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onYearChange={handleYearChange}
            onToday={handleToday}
            onCalendarTypeChange={handleCalendarTypeChange}
          />
        ) : (
          <DesktopCalendarHeader
            currentDate={currentDate}
            calendarType={calendarType}
            isCurrentMonth={isCurrentMonth}
            years={years}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            onToday={handleToday}
            onCalendarTypeChange={handleCalendarTypeChange}
          />
        )}
      </Paper>

      {/* Calendar Grid */}
      <Paper 
        elevation={3}
        sx={{ 
          p: isMobile ? 0.5 : 1,
          backgroundColor: 'var(--grey-50)',
          backgroundImage: 'var(--gradient-overlay)',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: isMobile ? 0.25 : 0.5
          }}
        >
          {/* Day Headers */}
          {weekdays.map((day) => (
            <Box 
              key={day}
              sx={{
                p: isMobile ? 0.25 : 0.5,
                backgroundColor: 'var(--calendar-header-bg)',
                borderRadius: 1,
                textAlign: 'center',
                border: 1,
                borderColor: 'var(--divider)'
              }}
            >
              <Typography 
                variant={isMobile ? "caption" : "h6"} 
                fontWeight="bold"
                sx={{ 
                  color: 'var(--text-primary)',
                  fontSize: isMobile ? '0.65rem' : '1.25rem'
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((dayObj, index) => (
            <CalendarTile 
              key={index}
              dayObj={dayObj}
              calendarType={calendarType}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default CalendarTab;