import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today
} from '@mui/icons-material';
import { format, getYear, getMonth, setYear, setMonth, isSameMonth } from 'date-fns';
import { 
  nextMonth, 
  prevMonth, 
  goToToday, 
  setCurrentDate
} from '../store/calendarSlice';
import { 
  gregorianToZoroastrian 
} from '../utils/zoroastrianCalendar';

const CalendarTab = () => {
  const dispatch = useDispatch();
  const { currentDate, calendarDays } = useSelector((state) => state.calendar);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Use user's default calendar preference if authenticated, otherwise default to Shenshai
  const getInitialCalendarType = () => {
    if (isAuthenticated && user?.default_zoro_cal) {
      return user.default_zoro_cal;
    }
    return 'Shenshai';
  };
  
  const [calendarType, setCalendarType] = React.useState(getInitialCalendarType);

  // Update calendar type when user changes or authentication status changes
  React.useEffect(() => {
    setCalendarType(getInitialCalendarType());
  }, [user?.default_zoro_cal, isAuthenticated]);

  // Generate month and year options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
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

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const isCurrentMonth = isSameMonth(currentDate, today);

  return (
    <Box>
      {/* Calendar Header */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 1, 
          mb: 1,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={handlePrevMonth} sx={{ px: 0 }}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextMonth} sx={{ px: 0 }}>
              <ChevronRight />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="bold">
              <FormControl variant="standard" sx={{ mr: 1, minWidth: 120 }}>
                <Select
                  value={getMonth(currentDate)}
                  onChange={handleMonthChange}
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: 'none' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                  }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={month} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ minWidth: 80 }}>
                <Select
                  value={getYear(currentDate)}
                  onChange={handleYearChange}
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: 'none' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ ml: 2, minWidth: 100 }}>
                <Select
                  value={calendarType}
                  onChange={handleCalendarTypeChange}
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: 'none' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                  }}
                >
                  <MenuItem value="Shenshai">Shenshai</MenuItem>
                  <MenuItem value="Kadmi">Kadmi</MenuItem>
                  <MenuItem value="Fasli">Fasli</MenuItem>
                </Select>
              </FormControl>
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Today />}
            onClick={handleToday}
            disabled={isCurrentMonth}
            size="medium"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              minWidth: '120px',
              py: 1,
              px: 2.5,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark'
              },
              '&.Mui-disabled': {
                backgroundColor: 'grey.400',
                color: 'white'
              }
            }}
          >
            Today
          </Button>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 1,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
          backgroundImage: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
            : 'linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5
          }}
        >
          {/* Day Headers */}
          {weekdays.map((day) => (
            <Box 
              key={day}
              sx={{
                p: 0.5,
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'var(--calendar-header-bg-dark)' 
                  : 'var(--calendar-header-bg-light)',
                borderRadius: 1,
                textAlign: 'center',
                border: 1,
                borderColor: 'divider'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="bold"
                color="text.primary"
              >
                {day}
              </Typography>
            </Box>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((dayObj, index) => {
            const { date, isCurrentMonth, isToday: isDayToday } = dayObj;
            const zoroastrianDate = gregorianToZoroastrian(date, calendarType);
            
            // Check if this is the first roj of any mah
            const isFirstRojOfMah = !zoroastrianDate.isGatha && zoroastrianDate.rojIndex === 0;
            const isFirstRojOfFirstMah = isFirstRojOfMah && zoroastrianDate.mahIndex === 0;
            const isFirstRojOfOtherMah = isFirstRojOfMah && zoroastrianDate.mahIndex > 0;
            
            return (
              <Card 
                key={index}
                elevation={isDayToday ? 3 : 1}
                sx={{ 
                  minHeight: 75,
                  backgroundColor: isDayToday 
                    ? 'primary.main'
                    : (isCurrentMonth && isFirstRojOfFirstMah)
                      ? 'success.light'  // Green for first roj of Fravardin
                    : (isCurrentMonth && isFirstRojOfOtherMah)
                      ? 'warning.light'  // Orange/amber for first roj of other mahs
                    : (isCurrentMonth && zoroastrianDate.isGatha)
                      ? (theme) => theme.palette.mode === 'dark' 
                        ? 'var(--calendar-gatha-bg-dark)' 
                        : 'var(--calendar-gatha-bg-light)'
                      : isCurrentMonth 
                        ? 'background.paper'
                        : (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                  border: isDayToday ? 2 : 1,
                  borderColor: isDayToday ? 'primary.dark' : 'divider',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                  <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                    {isCurrentMonth ? (
                      <>
                        {/* Gregorian Date */}
                        <Typography 
                          variant="h6" 
                          fontWeight={isDayToday ? 'bold' : 'normal'}
                          color={(isDayToday || isFirstRojOfFirstMah || isFirstRojOfOtherMah || zoroastrianDate.isGatha) ? 'white' : 'primary.main'}
                          align="center"
                          sx={{ mb: 0.5 }}
                        >
                          {format(date, 'd')}
                        </Typography>
                        
                        {/* Zoroastrian Date */}
                        <Typography 
                          variant="caption" 
                          display="block"
                          color={(isDayToday || isFirstRojOfFirstMah || isFirstRojOfOtherMah || zoroastrianDate.isGatha)
                            ? 'white' 
                            : 'text.primary'
                          }
                          align="center"
                          sx={{ 
                            fontSize: '0.65rem',
                            lineHeight: 1.2
                          }}
                        >
                          {zoroastrianDate.isGatha ? (
                            `${zoroastrianDate.roj} (G)`
                          ) : (
                            <>
                              {zoroastrianDate.roj} (R)
                              <br />
                              {zoroastrianDate.mah} (M)
                            </>
                          )}
                        </Typography>
                      </>
                    ) : null}
                  </CardContent>
                </Card>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default CalendarTab;