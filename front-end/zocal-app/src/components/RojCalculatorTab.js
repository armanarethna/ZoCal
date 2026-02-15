import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
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
  Divider
} from '@mui/material';
import { Calculate } from '@mui/icons-material';
import { gregorianToZoroastrian, calendarTypes } from '../utils/zoroastrianCalendar';
import { 
  setRojCalendarType,
  setRojSelectedDate,
  setRojBeforeSunrise,
  setRojResult,
  setRojIsValidDate
} from '../store/calendarSlice';

const RojCalculatorTab = () => {
  const dispatch = useDispatch();
  const { calendarType, selectedDate, beforeSunrise, result, isValidDate } = useSelector(state => state.calendar.rojCalculator);

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
      return `${result.roj} (Roj), ${result.mah} (Mah)`;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ 
        p: 3, 
        minHeight: 400,
        backgroundColor: 'grey.100',
        borderRadius: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Calculate sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4">
            Roj Calculator
          </Typography>
        </Box>

        <Card sx={{ 
          maxWidth: 600, 
          mx: 'auto',
          backgroundColor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <CardContent sx={{ p: 2.5, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Gregorian to Zoroastrian
            </Typography>
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Calendar Type</InputLabel>
                  <Select
                    value={calendarType}
                    label="Calendar Type"
                    onChange={(e) => dispatch(setRojCalendarType(e.target.value))}
                  >
                    <MenuItem value={calendarTypes.SHENSHAI}>Shenshai</MenuItem>
                    <MenuItem value={calendarTypes.KADMI}>Kadmi</MenuItem>
                    <MenuItem value={calendarTypes.FASLI}>Fasli</MenuItem>
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
              backgroundColor: 'primary.light',
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
      </Paper>
    </Container>
  );
};

export default RojCalculatorTab;