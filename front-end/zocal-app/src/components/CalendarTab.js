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
  FormControl,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Use user's default calendar preference if authenticated, otherwise default to Shenshai
  const getInitialCalendarType = React.useCallback(() => {
    if (isAuthenticated && user?.default_zoro_cal) {
      return user.default_zoro_cal;
    }
    return 'Shenshai';
  }, [isAuthenticated, user?.default_zoro_cal]);
  
  const [calendarType, setCalendarType] = React.useState(getInitialCalendarType);

  // Update calendar type when user changes or authentication status changes
  React.useEffect(() => {
    setCalendarType(getInitialCalendarType());
  }, [user?.default_zoro_cal, isAuthenticated, getInitialCalendarType]);

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

  const handleCalendarTypeTabChange = (event, newValue) => {
    const calendarTypes = ['Shenshai', 'Kadmi', 'Fasli'];
    setCalendarType(calendarTypes[newValue]);
  };

  const getCalendarTypeTabValue = () => {
    const calendarTypes = ['Shenshai', 'Kadmi', 'Fasli'];
    return calendarTypes.indexOf(calendarType);
  };

  const weekdays = isMobile ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const isCurrentMonth = isSameMonth(currentDate, today);

  return (
    <Box sx={{ p: isMobile ? 0 : 'inherit' }}>
      {/* Calendar Header */}
      <Paper 
        elevation={2}
        sx={{ 
          p: isMobile ? 0.5 : 1, 
          mb: isMobile ? 0.5 : 1,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'background.paper',
          border: 1,
          borderColor: 'divider'
        }}
      >
        {isMobile ? (
          // Mobile Layout - 2 Lines
          <Box>
            {/* Line 1: Calendar Type Tabs */}
            <Box display="flex" justifyContent="center" mb={1} sx={{ mx: -0.5 }}>
              <Tabs
                value={getCalendarTypeTabValue()}
                onChange={handleCalendarTypeTabChange}
                variant="fullWidth"
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    py: 0.5,
                    px: 1,
                  },
                  width: '100%',
                }}
              >
                <Tab label="Shenshai" />
                <Tab label="Kadmi" />
                <Tab label="Fasli" />
              </Tabs>
            </Box>

            {/* Line 2: Navigation, Year, and Today */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={0.5}>
                <IconButton onClick={handlePrevMonth} size="small">
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" fontWeight="bold" sx={{ minWidth: '60px', textAlign: 'center', fontSize: '1rem' }}>
                  {months[getMonth(currentDate)].substring(0, 3)}
                </Typography>
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRight />
                </IconButton>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 70, ml: 1 }}>
                  <Select
                    value={getYear(currentDate)}
                    onChange={handleYearChange}
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                onClick={handleToday}
                disabled={isCurrentMonth}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  minWidth: '60px',
                  py: 0.5,
                  px: 1,
                }}
              >
                <Today fontSize="small" />
              </Button>
            </Box>
          </Box>
        ) : (
          // Desktop Layout - Single Line
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap">
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
        )}
      </Paper>

      {/* Calendar Grid */}
      <Paper 
        elevation={3}
        sx={{ 
          p: isMobile ? 0.5 : 1,
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
            gap: isMobile ? 0.25 : 0.5
          }}
        >
          {/* Day Headers */}
          {weekdays.map((day) => (
            <Box 
              key={day}
              sx={{
                p: isMobile ? 0.25 : 0.5,
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
                variant={isMobile ? "caption" : "h6"} 
                fontWeight="bold"
                color="text.primary"
                sx={{ fontSize: isMobile ? '0.65rem' : '1.25rem' }}
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
                  minHeight: isMobile ? 45 : 75,
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
                  <CardContent sx={{ 
                    p: isMobile ? 0.25 : 0.5, 
                    '&:last-child': { pb: isMobile ? 0.25 : 0.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    {isCurrentMonth ? (
                      <>
                        {/* Gregorian Date */}
                        <Typography 
                          variant={isMobile ? "body2" : "h6"} 
                          fontWeight={isDayToday ? 'bold' : 'normal'}
                          color={(isDayToday || isFirstRojOfFirstMah || isFirstRojOfOtherMah || zoroastrianDate.isGatha) ? 'white' : 'primary.main'}
                          align="center"
                          sx={{ 
                            mb: isMobile ? 0.25 : 0.5,
                            fontSize: isMobile ? '0.75rem' : '1.25rem',
                            lineHeight: 1
                          }}
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
                            fontSize: isMobile ? '0.5rem' : '0.65rem',
                            lineHeight: isMobile ? 1.1 : 1.2,
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
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