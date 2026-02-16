import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { gregorianToZoroastrian, calendarTypes } from '../../utils/zoroastrianCalendar';
import CalendarInfoBox from '../molecules/CalendarInfoBox';
import { 
  setRojCalendarType,
  setRojSelectedDate,
  setRojBeforeSunrise,
  setRojResult,
  setRojIsValidDate
} from '../../store/calendarSlice';
import { ZOROASTRIAN_CALENDAR_TYPES } from '../../constants';

const RojCalculatorTab = () => {
  const dispatch = useDispatch();
  const { selectedDate, calendarType, beforeSunrise, result, isValidDate } = useSelector(
    (state) => state.calendar.rojCalculator
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to validate if a date string represents a valid date
  const validateDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;
    
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Check if basic format is correct
      if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      
      // Create date and check if it matches input
      const date = new Date(year, month - 1, day);
      const isValid = date.getFullYear() === year && 
                      date.getMonth() === (month - 1) && 
                      date.getDate() === day;
      
      return isValid;
    } catch (error) {
      return false;
    }
  };

  // Calculate result whenever inputs change
  useEffect(() => {
    if (selectedDate) {
      const isDateValid = validateDate(selectedDate);
      dispatch(setRojIsValidDate(isDateValid));
      
      if (isDateValid) {
        let dateToCalculate = new Date(selectedDate);
        
        // If before sunrise is checked, subtract one day
        if (beforeSunrise) {
          dateToCalculate.setDate(dateToCalculate.getDate() - 1);
        }
        
        const zoroastrianDate = gregorianToZoroastrian(dateToCalculate, calendarType);
        dispatch(setRojResult(zoroastrianDate));
      } else {
        dispatch(setRojResult(null));
      }
    } else {
      dispatch(setRojIsValidDate(false));
      dispatch(setRojResult(null));
    }
  }, [selectedDate, calendarType, beforeSunrise, dispatch]);

  // Create date format for min/max (100 years before/after current date)
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear - 100}-01-01`;
  const maxDate = `${currentYear + 100}-12-31`;

  const formatResult = () => {
    if (!isValidDate) return 'Invalid Date Input';
    if (!result) return '';
    
    if (result.isGatha) {
      return `${result.roj} (Gatha)`;
    } else {
      if (isMobile) {
        return (
          <>
            {result.roj} (Roj)
            <br />
            {result.mah} (Mah)
          </>
        );
      } else {
        return `${result.roj} (Roj), ${result.mah} (Mah)`;
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Card sx={{ 
        maxWidth: 600, 
        mx: 'auto',
        backgroundColor: 'var(--background-paper)',
        boxShadow: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mt: 2
      }}>
        <CardContent sx={{ p: 2.5, backgroundColor: 'var(--grey-50)' }}>
          <Typography variant="h6" gutterBottom>
            Gregorian to Zoroastrian
          </Typography>
            
            <Box sx={{ mt: 2, mb: 2 }}>
              {isMobile ? (
                <Box>
                  {/* Mobile Layout - Dropdowns on separate lines */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Calendar Type</InputLabel>
                    <Select
                      value={calendarType}
                      label="Calendar Type"
                      onChange={(e) => dispatch(setRojCalendarType(e.target.value))}
                    >
                      {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
                        <MenuItem key={type} value={calendarTypes[type.toUpperCase()]}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {/* Date Input */}
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={selectedDate}
                    onChange={(e) => dispatch(setRojSelectedDate(e.target.value))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: minDate,
                      max: maxDate
                    }}
                    sx={{ mb: 2 }}
                  />
                </Box>
              ) : (
                /* Desktop Layout - Original Dropdown */
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>Calendar Type</InputLabel>
                    <Select
                      value={calendarType}
                      label="Calendar Type"
                      onChange={(e) => dispatch(setRojCalendarType(e.target.value))}
                    >
                      {ZOROASTRIAN_CALENDAR_TYPES.map((type) => (
                        <MenuItem key={type} value={calendarTypes[type.toUpperCase()]}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    sx={{ flex: 1 }}
                    type="date"
                    label="Date"
                    value={selectedDate}
                    onChange={(e) => dispatch(setRojSelectedDate(e.target.value))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: minDate,
                      max: maxDate
                    }}
                  />
                </Box>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={beforeSunrise}
                    onChange={(e) => dispatch(setRojBeforeSunrise(e.target.checked))}
                  />
                }
                label="Before sunrise"
                sx={{ mb: 1 }}
              />
            </Box>

            <Divider sx={{ 
              my: 1.5,
              borderColor: 'primary.light',
              borderWidth: 1
            }} />

            <Box sx={{ 
              textAlign: 'center',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 2,
              p: 2,
              mx: -1
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: !isValidDate ? 'error.main' : 'primary.contrastText',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {formatResult()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ 
          maxWidth: 600, 
          mx: 'auto',
          mt: 2
        }}>
          <CalendarInfoBox calendarType={calendarType} />
        </Box>
      </Container>
    );
  };

export default RojCalculatorTab;